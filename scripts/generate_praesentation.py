#!/usr/bin/env python3
"""
generate_praesentation.py  –  Trainer-Präsentation als PPTX
Design: FKB Campus Masterdeck (editorial, Variante B)
Skalierung: 1920px HTML-Canvas → PPTX-Pt = HTML-px × 0.5

Verwendung: python3 scripts/generate_praesentation.py M01
            python3 scripts/generate_praesentation.py all
Ausgabe:    public/downloads/praesentation/MXX.pptx
"""

import sys, re, textwrap
from pathlib import Path

try:
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN, MSO_AUTO_SIZE
    from lxml import etree
    import yaml
except ImportError as e:
    print(f"Fehlende Abhängigkeit: {e}\npip3 install python-pptx pyyaml lxml")
    sys.exit(1)

# ── Farbsystem (FKB Campus Masterdeck, oklch → hex) ───────────────────────
BG      = RGBColor(0xF8, 0xF8, 0xFA)   # off-white
BG2     = RGBColor(0xF0, 0xF0, 0xF5)   # sekundär
INK     = RGBColor(0x19, 0x1D, 0x2E)   # fast schwarz
INK2    = RGBColor(0x4D, 0x52, 0x70)   # body text
INK3    = RGBColor(0x7B, 0x7F, 0xA0)   # meta, labels
LINE    = RGBColor(0xE0, 0xE0, 0xE8)   # trennlinie
PRIMARY = RGBColor(0x1F, 0x2B, 0x56)   # tiefblau
PRI_INK = RGBColor(0xF8, 0xF8, 0xFA)   # text auf primary
ACCENT  = RGBColor(0xD9, 0xBF, 0x7A)   # warmer sand
ACC_INK = RGBColor(0x3A, 0x2A, 0x0A)   # text auf accent

# ── Typografie ─────────────────────────────────────────────────────────────
SERIF = "Georgia"       # Source Serif 4 → Georgia
SANS  = "Arial"         # Inter Tight → Arial
MONO  = "Courier New"   # JetBrains Mono → Courier New

# ── Foliengröße 16:9 Widescreen ───────────────────────────────────────────
# 1920px-HTML / 144 px per inch = 13.333"; 1080px / 144 = 7.5"
# Fontgrößen: HTML-px × 0.5 = PPTX-Pt
PX  = 144   # px per inch

def p(n):   return Inches(n / PX)   # pixel → inches

# Masterdeck-konforme Pt-Größen (HTML-px × 0.5, leicht angehoben für Lesbarkeit)
T_COVER   = Pt(60)   # 240px × 0.5 = 120 → 60 (konservativ für lange Titel)
T_SECTION = Pt(48)   # 96px  × 0.5 = 48
T_H2      = Pt(38)   # 76px  × 0.5 = 38
T_H3      = Pt(28)   # 56px  × 0.5 = 28
T_LEAD    = Pt(14)   # 28px  × 0.5 = 14
T_BODY    = Pt(13)   # 24px  × 0.5 = 12, +1 für Lesbarkeit
T_META    = Pt(10)   # 20px  × 0.5 = 10
T_MONO    = Pt(9)    # 18px  × 0.5 = 9

# Margins / feste Y-Werte (in px, dann via p())
M         = 96    # horizontaler Rand
RUNNER_Y  = 44    # Runner oben
RULE_Y    = 130   # Trennlinie nach Runner
TITLE_Y   = 145   # Beginn Titelbereich
TITLE_H   = 280   # Höhe Titelbox (großzügig für Umbrüche)
BODY_Y    = 440   # Beginn Contentbereich
BODY_H    = 510   # Höhe Contentbereich
BOT_Y     = 1012  # Runner unten
W         = 1920 - 2 * M   # Nutzbreite = 1728

# ── Pfade ──────────────────────────────────────────────────────────────────
SCRIPT_DIR   = Path(__file__).parent
AKADEMIE_DIR = SCRIPT_DIR.parent
MODULES_DIR  = AKADEMIE_DIR / "content" / "modules"
OUTPUT_DIR   = AKADEMIE_DIR / "public" / "downloads" / "praesentation"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ══════════════════════════════════════════════════════════════════════════
# MARKDOWN-PARSER
# ══════════════════════════════════════════════════════════════════════════

def clean(text: str) -> str:
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"\*(.+?)\*",     r"\1", text)
    text = re.sub(r"`(.+?)`",       r"\1", text)
    text = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", text)
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
    return text.strip()

def bullets(text: str, n=6) -> list:
    out = []
    for ln in text.splitlines():
        ln = ln.strip()
        if re.match(r"^[-*•]\s+", ln):
            b = clean(re.sub(r"^[-*•]\s+", "", ln))
            if b: out.append(b)
    if not out:
        for para in re.split(r"\n{2,}", text):
            c = clean(para).strip()
            if c and not c.startswith("|") and len(c) > 15:
                out.append(textwrap.shorten(c, 220, placeholder="…"))
    return out[:n]

def md_table(text: str):
    rows = []
    for ln in text.splitlines():
        ln = ln.strip()
        if not ln.startswith("|"): continue
        if re.match(r"^\|[-| :]+\|$", ln): continue
        rows.append([clean(c.strip()) for c in ln.strip("|").split("|")])
    return rows if len(rows) >= 2 else None

def sections(body: str, level: int) -> list:
    pat   = rf"^{'#'*level}\s+(.+)$"
    parts = re.split(pat, body, flags=re.MULTILINE)
    return [{"title": parts[i].strip(), "body": parts[i+1].strip()}
            for i in range(1, len(parts)-1, 2)]

def praxisfall(body: str):
    m = re.search(
        r"###\s+(?:Praxisfall|Der Fall|Fallstudie|Fallbeispiel)[^\n]*\n(.*?)(?=###|\Z)",
        body, re.DOTALL | re.IGNORECASE)
    if not m: return None, None
    c = m.group(1).strip()
    nm = re.search(r"\*\*(.+?)\*\*", c)
    return (nm.group(1) if nm else "Praxisfall"), clean(c[:400])

def parse_module(mid: str) -> dict:
    path = MODULES_DIR / f"{mid.upper()}.md"
    if not path.exists():
        print(f"Modul nicht gefunden: {path}"); sys.exit(1)
    raw  = path.read_text(encoding="utf-8")
    fm_m = re.match(r"^---\s*\n(.*?)\n---\s*\n", raw, re.DOTALL)
    if not fm_m: print("Kein Frontmatter."); sys.exit(1)
    fm   = yaml.safe_load(fm_m.group(1))
    body = raw[fm_m.end():]

    def extract(key):
        m = re.search(rf"<!-- CONTENT_{key}_START -->(.*?)<!-- CONTENT_{key}_END -->",
                      body, re.DOTALL)
        return (m.group(1).strip(), body[:m.start()] + body[m.end():]) if m else ("", body)

    _,    body = extract("TRAINER")
    _,    body = extract("THEORIE")
    body = re.sub(r"<!--.*?-->", "", body, flags=re.DOTALL)
    body = re.sub(r"\n{3,}", "\n\n", body)

    lz = fm.get("lernziele", [])
    return {
        "id":      str(fm.get("id", mid)),
        "title":   str(fm.get("title", "")),
        "subtitle":str(fm.get("subtitle", "")),
        "feld":    str(fm.get("kompetenzfeld", "")),
        "stufe":   str(fm.get("stufe", "")),
        "dauer":   str(fm.get("dauer", "")),
        "version": str(fm.get("version", "")),
        "lz":      [z["text"] if isinstance(z, dict) else str(z) for z in lz],
        "body":    body.strip(),
    }


# ══════════════════════════════════════════════════════════════════════════
# RENDER-PRIMITIVES
# ══════════════════════════════════════════════════════════════════════════

def new_prs():
    prs = Presentation()
    prs.slide_width  = Inches(13.333)
    prs.slide_height = Inches(7.5)
    return prs

def blank(prs):
    return prs.slides.add_slide(prs.slide_layouts[6])

def bg(slide, color: RGBColor):
    f = slide.background.fill
    f.solid(); f.fore_color.rgb = color

def rect(slide, lx, ty, w, h, color: RGBColor):
    """Rechteck in px."""
    s = slide.shapes.add_shape(1, p(lx), p(ty), p(w), p(h))
    s.fill.solid(); s.fill.fore_color.rgb = color
    s.line.fill.background()
    return s

def rule(slide, lx, ty, w, color: RGBColor):
    rect(slide, lx, ty, w, 1, color)

def tb(slide, text, lx, ty, w, h,
       font=SANS, size=T_BODY, bold=False, italic=False,
       color=INK, align=PP_ALIGN.LEFT, autofit=True) -> None:
    """Text-Box mit px-Koordinaten und optionalem Auto-Fit."""
    if not str(text).strip(): return
    tx = slide.shapes.add_textbox(p(lx), p(ty), p(w), p(h))
    tf = tx.text_frame
    tf.word_wrap = True
    if autofit:
        tf.auto_size = MSO_AUTO_SIZE.TEXT_TO_FIT_SHAPE
    par = tf.paragraphs[0]
    par.alignment = align
    run = par.add_run()
    run.text = str(text)
    run.font.name   = font
    run.font.size   = size
    run.font.bold   = bold
    run.font.italic = italic
    run.font.color.rgb = color

def tbl_rows(slide, rows: list, lx, ty, w, h):
    """PPTX-Tabelle aus Markdown-Rows."""
    if not rows: return
    nr = len(rows)
    nc = max(len(r) for r in rows)
    tbl = slide.shapes.add_table(nr, nc, p(lx), p(ty), p(w), p(h)).table
    for ri, row in enumerate(rows):
        for ci in range(nc):
            cell = tbl.cell(ri, ci)
            text = row[ci] if ci < len(row) else ""
            tf   = cell.text_frame
            tf.word_wrap = True
            par  = tf.paragraphs[0]
            run  = par.add_run()
            run.text = clean(text)
            run.font.name  = MONO
            run.font.size  = Pt(10)
            run.font.bold  = (ri == 0)
            if ri == 0:
                run.font.color.rgb = BG
                _cell_bg(cell, INK)
            elif ri % 2 == 0:
                run.font.color.rgb = INK
                _cell_bg(cell, BG2)
            else:
                run.font.color.rgb = INK
                _cell_bg(cell, BG)

def _cell_bg(cell, color: RGBColor):
    tc   = cell._tc
    tcPr = tc.get_or_add_tcPr()
    hex6 = f"{color[0]:02X}{color[1]:02X}{color[2]:02X}"
    fill = etree.fromstring(
        f'<a:solidFill xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
        f'<a:srgbClr val="{hex6}"/></a:solidFill>')
    tcPr.append(fill)


# ── Shared Chrome ──────────────────────────────────────────────────────────

def chrome(slide, section="", dark=False, pg=""):
    """Runner oben (Logo + Sektion) und unten (Seitenzahl)."""
    c = PRI_INK if dark else INK
    m = INK3
    tb(slide, "FKB  Campus",
       lx=M, ty=RUNNER_Y, w=400, h=44,
       font=SANS, size=T_META, bold=True, color=c)
    if section:
        tb(slide, section.upper(),
           lx=M, ty=RUNNER_Y, w=W, h=44,
           font=MONO, size=T_MONO, color=(INK3 if dark else INK3),
           align=PP_ALIGN.RIGHT)
    if pg:
        tb(slide, pg,
           lx=M, ty=BOT_Y, w=W, h=36,
           font=MONO, size=T_MONO, color=m, align=PP_ALIGN.RIGHT)

def h_rule(slide, ty=RULE_Y, dark=False):
    rule(slide, M, ty, W, INK if not dark else RGBColor(0x40,0x48,0x70))


# ══════════════════════════════════════════════════════════════════════════
# FOLIEN-TYPEN
# ══════════════════════════════════════════════════════════════════════════

def s_cover(prs, m):
    """01 — COVER."""
    s = blank(prs); bg(s, BG)
    # Oben
    tb(s, "FKB  Campus", M, 48, 500, 44, SANS, T_META, bold=True, color=INK)
    tb(s, f"{m['id']}  ·  {m['version']}", M, 48, W, 44,
       MONO, T_MONO, color=INK3, align=PP_ALIGN.RIGHT)
    # Großer Titel (60pt, erlaubt Umbrüche, autofit verhindert Überlauf)
    tb(s, m["title"], M, 440, W, 320,
       SERIF, T_COVER, bold=False, color=INK)
    # Trennlinie
    rule(s, M, 770, W, INK)
    # Meta-Grid
    sub = m.get("subtitle") or m.get("feld") or ""
    tb(s, sub,          M,    790, 820, 180, SERIF, T_LEAD, italic=True, color=INK2)
    tb(s, "ZIELSTUFE",  950,  790, 400,  28, MONO, T_MONO, color=INK3)
    tb(s, m["stufe"],   950,  820, 400,  80, SERIF, T_LEAD, color=INK)
    tb(s, "DAUER",      1400, 790, 420,  28, MONO, T_MONO, color=INK3)
    tb(s, m["dauer"],   1400, 820, 420,  80, SERIF, T_LEAD, color=INK)


def s_agenda(prs, m, pg):
    """02 — AGENDA / LERNZIELE."""
    s = blank(prs); bg(s, BG)
    chrome(s, "§ 00 — Lernziele", pg=pg)
    h_rule(s)
    # Linke Spalte: Titel
    tb(s, "Inhalt.", M, TITLE_Y, 500, 260, SERIF, T_SECTION, italic=True, color=PRIMARY)
    # Rechte Spalte: Lernziele
    ROMAN = ["I.","II.","III.","IV.","V.","VI.","VII.","VIII."]
    lz = m["lz"]
    row_h = min(108, 820 // max(len(lz), 1))
    for i, t in enumerate(lz[:8]):
        y = RULE_Y + 10 + i * row_h
        rule(s, 640, y, 1184, LINE)
        tb(s, ROMAN[i] if i < len(ROMAN) else f"{i+1}.",
           640, y+6, 80, row_h-6, SERIF, Pt(26), italic=True, color=PRIMARY)
        tb(s, textwrap.shorten(t, 180, placeholder="…"),
           740, y+10, 1080, row_h-10, SERIF, T_LEAD, color=INK)


def s_section(prs, roman, title, sub, section, pg):
    """03 — SECTION DIVIDER (dunkel)."""
    s = blank(prs); bg(s, INK)
    chrome(s, section, dark=True, pg=pg)
    # Riesige Zahl links (280pt = ~156px Buchstabenhöhe auf 1080px Folie)
    tb(s, roman, M, 100, 860, 860, SERIF, Pt(280), italic=True, color=ACCENT)
    # Titel + Sub rechts unten
    tb(s, title, 1060, 640, 764, 280, SERIF, T_H2, color=PRI_INK, align=PP_ALIGN.RIGHT)
    if sub:
        tb(s, textwrap.shorten(sub, 160, placeholder="…"),
           1060, 920, 764, 100, SERIF, T_LEAD, italic=True,
           color=INK3, align=PP_ALIGN.RIGHT)


def s_headline(prs, title, left, right, section, pg):
    """04 — HEADLINE + STANDFIRST."""
    s = blank(prs); bg(s, BG)
    chrome(s, section, pg=pg)
    h_rule(s)
    tb(s, "Kernaussage", M, RULE_Y+10, 600, 28, MONO, T_MONO, color=INK3)
    tb(s, title, M, TITLE_Y, W, TITLE_H, SERIF, T_H2, color=INK)
    rule(s, M, TITLE_Y + TITLE_H + 10, W, INK)
    by = TITLE_Y + TITLE_H + 20
    if left:
        tb(s, textwrap.shorten(left, 350, placeholder="…"),
           M, by, 820, BODY_H - 60, SERIF, T_LEAD, color=INK)
    if right:
        tb(s, "Mitnahme", 960, by, 764, 28, MONO, T_MONO, color=PRIMARY)
        tb(s, textwrap.shorten(right, 280, placeholder="…"),
           960, by+34, 764, BODY_H - 90, SERIF, T_LEAD, italic=True, color=INK)


def s_content(prs, title, items, section, pg):
    """Standard-Content-Folie: Titel + Bullet-Liste."""
    s = blank(prs); bg(s, BG)
    chrome(s, section, pg=pg)
    h_rule(s)
    tb(s, title, M, TITLE_Y, W, TITLE_H, SERIF, T_H2, color=INK)
    rule(s, M, TITLE_Y + TITLE_H + 10, W, LINE)
    for i, b in enumerate(items[:6]):
        y = TITLE_Y + TITLE_H + 24 + i * 84
        if y + 84 > BOT_Y: break
        tb(s, "–", M, y+4, 40, 56, SERIF, Pt(22), color=PRIMARY)
        tb(s, textwrap.shorten(b, 220, placeholder="…"),
           M+52, y, W-52, 80, SERIF, T_LEAD, color=INK)
        rule(s, M+52, y+76, W-52, LINE)


def s_two_col(prs, title, left, right, section, pg):
    """05 — ZWEI SPALTEN."""
    s = blank(prs); bg(s, BG)
    chrome(s, section, pg=pg)
    h_rule(s)
    tb(s, title, M, TITLE_Y, W, 200, SERIF, T_H2, color=INK)
    rule(s, M, TITLE_Y+210, W, INK)
    by = TITLE_Y + 220

    def col(items, lx, cw, label=""):
        if label:
            tb(s, label.upper(), lx, by, cw, 28, MONO, T_MONO, color=INK3)
            rule(s, lx, by+32, cw, INK)
            start = by + 42
        else:
            start = by
        for i, item in enumerate(items[:5]):
            y = start + i * 96
            if y + 90 > BOT_Y: break
            tb(s, f"0{i+1}", lx, y+4, 48, 40, MONO, T_META, color=PRIMARY)
            tb(s, textwrap.shorten(item, 180, placeholder="…"),
               lx+60, y, cw-60, 88, SERIF, T_LEAD, color=INK)
            rule(s, lx, y+90, cw, LINE)

    col(left[1:] if left else [], M,   800, left[0] if left else "")
    col(right[1:] if right else [], 1024, 800, right[0] if right else "")


def s_pullquote(prs, quote, author, role, section, pg):
    """06 — PULL QUOTE (primary bg)."""
    s = blank(prs); bg(s, PRIMARY)
    chrome(s, section, dark=True, pg=pg)
    # Anführungszeichen
    tb(s, "„", M, 120, 320, 260, SERIF, Pt(200), italic=True, color=ACCENT)
    # Zitat
    tb(s, textwrap.shorten(quote, 260, placeholder="…"),
       M, 360, W, 380, SERIF, T_H2, italic=True, color=PRI_INK)
    rule(s, M, 760, 680, RGBColor(0x40,0x48,0x70))
    # Avatar + Attribution
    initials = "".join(w[0] for w in str(author).split()[:2]).upper()
    rect(s, M, 780, 64, 64, ACCENT)
    tb(s, initials, M, 788, 64, 48, MONO, T_META, bold=True,
       color=ACC_INK, align=PP_ALIGN.CENTER)
    tb(s, str(author), M+80, 780, 640, 38, SERIF, T_LEAD, bold=True, color=PRI_INK)
    tb(s, str(role), M+80, 820, 640, 32, MONO, T_MONO, color=INK3)


def s_table(prs, title, rows, context, section, pg):
    """08 — DATA TABLE."""
    s = blank(prs); bg(s, BG)
    chrome(s, section, pg=pg)
    h_rule(s)
    tb(s, title, M, TITLE_Y, 760, TITLE_H, SERIF, T_H2, color=INK)
    if context:
        tb(s, textwrap.shorten(context, 180, placeholder="…"),
           M, TITLE_Y + TITLE_H + 20, 760, 160, SERIF, T_LEAD, color=INK2)
    if rows:
        nr = len(rows)
        th = min(p(nr * 60), p(BODY_H - 60))
        tbl_rows(s, rows, 900, TITLE_Y, 924, nr * 60)


def s_image_led(prs, name, situation, section, pg):
    """10 — IMAGE-LED (Praxisfall)."""
    s = blank(prs); bg(s, BG)
    # Linkes Drittel: Bild-Platzhalter
    rect(s, 0, 0, 700, 1080, RGBColor(0xC8,0xAE,0x62))
    for yi in range(0, 1080, 20):
        rule(s, 0, yi, 700, RGBColor(0xBE,0xA2,0x55))
    tb(s, "Praxisfall", 24, 1020, 660, 36,
       MONO, T_MONO, color=ACC_INK)
    # Runner + Section
    chrome(s, section, pg=pg)
    # Rechte Spalte
    tb(s, "Praxisfall", 760, 160, 1060, 32,
       MONO, T_MONO, color=INK3)
    tb(s, name, 760, 196, 1060, 260, SERIF, T_H2, color=INK)
    if situation:
        tb(s, textwrap.shorten(situation, 400, placeholder="…"),
           760, 470, 1060, 480, SERIF, T_LEAD, color=INK2)


def s_sources(prs, src_list, pg):
    """11 — QUELLENAPPARAT (dunkel)."""
    s = blank(prs); bg(s, INK)
    chrome(s, "Quellenapparat", dark=True, pg=pg)
    tb(s, "Quellenapparat", M, RULE_Y+6, 800, 32,
       MONO, T_MONO, color=INK3)
    tb(s, "Quellen.", M, TITLE_Y, 1728, 200, SERIF, T_H2, color=PRI_INK)
    rule(s, M, TITLE_Y+210, W, RGBColor(0x40,0x48,0x70))
    mid = len(src_list) // 2 + 1
    for i, t in enumerate(src_list[:mid]):
        tb(s, t, M, TITLE_Y+220 + i*72, 800, 68,
           MONO, T_MONO, color=RGBColor(0xBF,0xC3,0xD8))
    for i, t in enumerate(src_list[mid:mid+7]):
        tb(s, t, 940, TITLE_Y+220 + i*72, 824, 68,
           MONO, T_MONO, color=RGBColor(0xBF,0xC3,0xD8))


def s_closing(prs, m, pg):
    """12 — CLOSING."""
    s = blank(prs); bg(s, BG)
    tb(s, "FKB  Campus", M, 72, 500, 44, SANS, T_META, bold=True, color=INK)
    tb(s, f"Ende · {m['version']}", M, 72, W, 44,
       MONO, T_MONO, color=INK3, align=PP_ALIGN.RIGHT)
    # Großer Titel – zwei Zeilen
    tb(s, "Danke.\nFragen?", M, 180, W, 560, SERIF, Pt(96), color=INK)
    rule(s, M, 760, W, INK)
    # Unteres Grid
    lead = (f"Modul «{m['title']}» auf FKB Campus — "
            f"{len(m['lz'])} Lernziele, Praxisfall und Quellenapparat.")
    tb(s, lead, M, 780, 900, 180, SERIF, T_LEAD, italic=True, color=INK)
    tb(s, "Kontakt",       1060, 780, 380, 28,  MONO, T_MONO, color=INK3)
    tb(s, "info@benedikt-zoller.de", 1060, 812, 380, 60, SERIF, T_LEAD, color=INK)
    tb(s, "Modul",         1480, 780, 344, 28,  MONO, T_MONO, color=INK3)
    tb(s, f"{m['id']} · {m['stufe']}", 1480, 812, 344, 60, SERIF, T_LEAD, color=INK)


# ══════════════════════════════════════════════════════════════════════════
# MODUL → PRÄSENTATION
# ══════════════════════════════════════════════════════════════════════════

ROMAN = ["I.","II.","III.","IV.","V.","VI.","VII.","VIII.","IX.","X."]

SKIP_KW    = {"musterlösung","trainer-hinweis","trainer-tipp","trainertipp",
              "feedbackbogen","beobachtungsbogen"}
PFALL_KW   = {"praxisfall","der fall","fallstudie","fallbeispiel"}
REFLEX_KW  = {"reflexionsfragen","fragen zur reflexion","selbstcheck","reflexion"}
QUELLEN_KW = {"quellenverzeichnis","literaturverzeichnis"}

def is_skip(t):    return any(k in t.lower() for k in SKIP_KW)
def is_pfall(t):   return any(k in t.lower() for k in PFALL_KW)
def is_reflex(t):  return any(k in t.lower() for k in REFLEX_KW)
def is_quellen(t): return any(k in t.lower() for k in QUELLEN_KW)

def build(mid: str) -> Path:
    m   = parse_module(mid)
    prs = new_prs()
    h2s = sections(m["body"], 2)

    # Seitenanzahl schätzen
    pages = [0]
    def pg():
        pages[0] += 1
        return f"{pages[0]:02d}"

    # 01 Cover
    s_cover(prs, m); pg()

    # 02 Agenda
    if m["lz"]:
        s_agenda(prs, m, pg());

    roman_idx = 0

    for h2 in h2s:
        t2 = clean(h2["title"])
        b2 = h2["body"]

        # Quellenverzeichnis → Quellenapparat-Folie
        if is_quellen(t2):
            src = [ln.strip("- ").strip() for ln in b2.splitlines()
                   if ln.strip() and not ln.startswith("#")]
            if src:
                s_sources(prs, [clean(x) for x in src[:14]], pg())
            continue

        # Section Divider
        roman = ROMAN[roman_idx] if roman_idx < len(ROMAN) else f"{roman_idx+1}."
        roman_idx += 1
        h3s = sections(b2, 3)
        sub = clean(h3s[0]["title"]) if h3s else ""
        s_section(prs, roman, t2, sub, t2, pg())

        for h3 in h3s:
            t3 = clean(h3["title"])
            b3 = h3["body"]
            sec = f"§ {roman[:-1]} · {t2}"

            if is_skip(t3): continue

            # Praxisfall → Image-Led
            if is_pfall(t3):
                name, sit = praxisfall("### " + t3 + "\n" + b3)
                s_image_led(prs, name or t3, sit or clean(b3[:350]), sec, pg())
                continue

            # Reflexionsfragen → Content
            if is_reflex(t3):
                qs = [m.group(1).strip()
                      for m in re.finditer(r"^\d+\.\s+(.+)$", b3, re.MULTILINE)]
                if not qs: qs = bullets(b3, 5)
                if qs: s_content(prs, t3, qs, sec, pg())
                continue

            # Tabelle?
            tbl = md_table(b3)
            if tbl:
                ctx = next((clean(p) for p in re.split(r"\n{2,}", b3)
                            if not p.strip().startswith("|") and clean(p)), "")
                s_table(prs, t3, tbl, ctx[:180], sec, pg())
                # Rest-H4 nach Tabelle
                for h4 in sections(b3, 4):
                    if is_skip(h4["title"]): continue
                    bs = bullets(h4["body"])
                    if bs: s_content(prs, clean(h4["title"]), bs, sec, pg())
                continue

            # H4-Unterabschnitte?
            h4s = sections(b3, 4)
            if h4s:
                intro = re.split(r"^####", b3, maxsplit=1, flags=re.MULTILINE)[0]
                left  = " ".join(bullets(intro, 2))
                s_headline(prs, t3, left, "", sec, pg())
                for h4 in h4s:
                    if is_skip(h4["title"]): continue
                    t4  = clean(h4["title"])
                    b4  = h4["body"]
                    tbl4 = md_table(b4)
                    if tbl4:
                        s_table(prs, t4, tbl4, "", sec, pg())
                    else:
                        bs = bullets(b4)
                        if bs: s_content(prs, t4, bs, sec, pg())
                continue

            # Nur Bullets
            bs = bullets(b3)
            if not bs: continue
            if len(bs) >= 4:
                half = len(bs) // 2
                s_two_col(prs, t3, [""] + bs[:half], [""] + bs[half:], sec, pg())
            else:
                s_content(prs, t3, bs, sec, pg())

    # 12 Closing
    s_closing(prs, m, pg())

    out = OUTPUT_DIR / f"{mid.upper()}.pptx"
    prs.save(out)
    print(f"✓  {out}  ({len(prs.slides)} Folien)")
    return out


# ══════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════

def main():
    if len(sys.argv) < 2:
        print("Verwendung: python3 generate_praesentation.py M01|all")
        sys.exit(1)
    arg = sys.argv[1].strip().lower()
    if arg == "all":
        for path in sorted(MODULES_DIR.glob("*.md")):
            try:   build(path.stem)
            except Exception as e: print(f"✗  {path.stem}: {e}")
    else:
        build(arg)

if __name__ == "__main__":
    main()
