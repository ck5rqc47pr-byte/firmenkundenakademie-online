#!/usr/bin/env python3
"""
generate_praesentation.py  –  Trainer-Präsentation als PPTX
Verwendung: python3 scripts/generate_praesentation.py M01
            python3 scripts/generate_praesentation.py all
Ausgabe:    public/downloads/praesentation/MXX.pptx
"""

import sys, os, re, textwrap
from pathlib import Path

try:
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN
    from pptx.oxml.ns import qn
    import yaml
except ImportError as e:
    print(f"Fehlende Abhängigkeit: {e}")
    print("pip3 install python-pptx pyyaml")
    sys.exit(1)

# ── CI-Farben ──────────────────────────────────────────────────────────────
PRIMARY  = RGBColor(0x00, 0x3D, 0xA5)
ACCENT   = RGBColor(0xE0, 0x5B, 0x00)
WHITE    = RGBColor(0xFF, 0xFF, 0xFF)
DARK     = RGBColor(0x1A, 0x1A, 0x1A)
GRAY     = RGBColor(0x55, 0x65, 0x75)
LIGHT_BG = RGBColor(0xF4, 0xF6, 0xFA)
LINE     = RGBColor(0xD1, 0xD5, 0xDB)
HINT_BG  = RGBColor(0xFF, 0xF3, 0xE0)   # orange tint für Trainer-Hinweise

SLIDE_W = Inches(13.33)
SLIDE_H = Inches(7.5)

SCRIPT_DIR   = Path(__file__).parent
AKADEMIE_DIR = SCRIPT_DIR.parent
MODULES_DIR  = AKADEMIE_DIR / "content" / "modules"
OUTPUT_DIR   = AKADEMIE_DIR / "public" / "downloads" / "praesentation"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ══════════════════════════════════════════════════════════════════════════
# MODUL PARSEN
# ══════════════════════════════════════════════════════════════════════════

def parse_module(module_id: str) -> dict:
    path = MODULES_DIR / f"{module_id.upper()}.md"
    if not path.exists():
        print(f"Modul nicht gefunden: {path}"); sys.exit(1)

    text = path.read_text(encoding="utf-8")
    fm_m = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if not fm_m:
        print("Kein Frontmatter."); sys.exit(1)

    fm   = yaml.safe_load(fm_m.group(1))
    body = text[fm_m.end():]

    def extract_block(key):
        m = re.search(
            rf"<!-- CONTENT_{key}_START -->(.*?)<!-- CONTENT_{key}_END -->",
            body, re.DOTALL)
        return (m.group(1).strip(), body[:m.start()] + body[m.end():]) if m else ("", body)

    trainer_content, body = extract_block("TRAINER")
    _,               body = extract_block("THEORIE")

    body = re.sub(r"<!--.*?-->", "", body, flags=re.DOTALL)
    body = re.sub(r"^>.*?Stand:.*$", "", body, flags=re.MULTILINE)
    body = re.sub(r"\n{3,}", "\n\n", body)

    lernziele = fm.get("lernziele", [])
    lz_texts  = [lz["text"] if isinstance(lz, dict) else str(lz) for lz in lernziele]

    return {
        "id":            str(fm.get("id", module_id)),
        "title":         str(fm.get("title", "")),
        "subtitle":      str(fm.get("subtitle", "")),
        "kompetenzfeld": str(fm.get("kompetenzfeld", "")),
        "stufe":         str(fm.get("stufe", "")),
        "dauer":         str(fm.get("dauer", "")),
        "format":        str(fm.get("format", "")),
        "version":       str(fm.get("version", "")),
        "lernziele":     lz_texts,
        "folgemodule":   fm.get("folgemodule", []) or [],
        "body":          body.strip(),
        "trainer":       trainer_content,
    }


# ══════════════════════════════════════════════════════════════════════════
# INHALTS-ANALYSE
# ══════════════════════════════════════════════════════════════════════════

def clean_md(text: str) -> str:
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"\*(.+?)\*",     r"\1", text)
    text = re.sub(r"`(.+?)`",       r"\1", text)
    text = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", text)
    text = re.sub(r"^#+\s+", "", text, flags=re.MULTILINE)
    return text.strip()


def extract_bold_definitions(text: str) -> list[tuple[str,str]]:
    """**Begriff:** Erklärung → [(Begriff, Erklärung), ...]"""
    results = []
    for m in re.finditer(r"\*\*(.+?)\*\*[:\s]+(.+?)(?=\n\n|\*\*|$)", text, re.DOTALL):
        term = m.group(1).strip(" :*")
        desc = clean_md(m.group(2).replace("\n", " ")).strip()
        if term and desc and len(desc) > 10:
            results.append((term, textwrap.shorten(desc, 180, placeholder="…")))
    return results


def extract_bullets(text: str, max_items=7) -> list[str]:
    bullets = []
    for line in text.splitlines():
        line = line.strip()
        if re.match(r"^[-*•\d]+[.)]\s+", line):
            b = re.sub(r"^[-*•\d]+[.)]\s+", "", line)
            b = clean_md(b)
            if b: bullets.append(b)
    if not bullets:
        for para in re.split(r"\n{2,}", text):
            para = clean_md(para).strip()
            if para and not para.startswith("|") and len(para) > 20:
                bullets.append(textwrap.shorten(para, 160, placeholder="…"))
    return bullets[:max_items]


def parse_md_table(text: str) -> list[list[str]] | None:
    """Markdown-Tabelle → [[header...], [row...], ...]"""
    rows = []
    for line in text.splitlines():
        line = line.strip()
        if not line.startswith("|"): continue
        if re.match(r"^\|[-| :]+\|$", line): continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        rows.append(cells)
    return rows if len(rows) >= 2 else None


def extract_blockquotes(text: str) -> list[str]:
    """> **Hinweis:** ... → [text, ...]"""
    hints = []
    for m in re.finditer(r"^>+\s*(.+)$", text, re.MULTILINE):
        h = clean_md(m.group(1)).strip()
        if h and len(h) > 10:
            hints.append(h)
    return hints


def split_h2_sections(body: str) -> list[dict]:
    """H2-Blöcke extrahieren: Modulinhalte, Praxistransfer, Quellen"""
    parts = re.split(r"^##\s+(.+)$", body, flags=re.MULTILINE)
    sections = []
    for i in range(1, len(parts)-1, 2):
        sections.append({"h2": parts[i].strip(), "body": parts[i+1].strip()})
    return sections


def split_h3_sections(body: str) -> list[dict]:
    """H3-Blöcke innerhalb eines H2 extrahieren."""
    parts = re.split(r"^###\s+(.+)$", body, flags=re.MULTILINE)
    sections = []
    for i in range(1, len(parts)-1, 2):
        sections.append({"h3": parts[i].strip(), "body": parts[i+1].strip()})
    return sections


def split_h4_sections(body: str) -> list[dict]:
    parts = re.split(r"^####\s+(.+)$", body, flags=re.MULTILINE)
    sections = []
    for i in range(1, len(parts)-1, 2):
        sections.append({"h4": parts[i].strip(), "body": parts[i+1].strip()})
    return sections


def extract_ablaufplan(trainer: str) -> list[tuple[str,str,str]] | None:
    """Ablaufplan aus Trainer-Content: [(Zeit, Phase, Inhalt), ...]"""
    rows = parse_md_table(trainer)
    if not rows or len(rows[0]) < 2: return None
    return [(r[0], r[1], r[2] if len(r)>2 else "") for r in rows[1:]]


def extract_numbered_questions(text: str) -> list[str]:
    questions = []
    for m in re.finditer(r"^\d+\.\s+(.+)$", text, re.MULTILINE):
        questions.append(m.group(1).strip())
    return questions


# ══════════════════════════════════════════════════════════════════════════
# FOLIEN-HILFSFUNKTIONEN
# ══════════════════════════════════════════════════════════════════════════

def blank_slide(prs):
    return prs.slides.add_slide(prs.slide_layouts[6])


def set_bg(slide, color: RGBColor):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = color


def rect(slide, l, t, w, h, color: RGBColor, line=False):
    s = slide.shapes.add_shape(1, Inches(l), Inches(t), Inches(w), Inches(h))
    s.fill.solid(); s.fill.fore_color.rgb = color
    if line: s.line.color.rgb = color
    else:    s.line.fill.background()
    return s


def tbox(slide, text, l, t, w, h, size=16, bold=False,
         color=DARK, align=PP_ALIGN.LEFT, wrap=True, italic=False) -> None:
    tx = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    tf = tx.text_frame; tf.word_wrap = wrap
    p  = tf.paragraphs[0]; p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size  = Pt(size); run.font.bold  = bold
    run.font.italic = italic
    run.font.color.rgb = color; run.font.name = "Arial"


def bullet_box(slide, items: list[str | tuple], l, t, w, h,
               size=16, color=DARK, dot_color=PRIMARY,
               term_color=PRIMARY) -> None:
    """items: str oder (term, desc)"""
    tx = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    tf = tx.text_frame; tf.word_wrap = True
    first = True
    for item in items:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.space_before = Pt(5)

        if isinstance(item, tuple):
            term, desc = item
            # Dot
            r = p.add_run(); r.text = "▪  "
            r.font.size = Pt(size-2); r.font.color.rgb = dot_color; r.font.name = "Arial"
            # Term (bold, primary)
            r = p.add_run(); r.text = f"{term}: "
            r.font.size = Pt(size); r.font.bold = True
            r.font.color.rgb = term_color; r.font.name = "Arial"
            # Desc
            r = p.add_run(); r.text = desc
            r.font.size = Pt(size); r.font.color.rgb = color; r.font.name = "Arial"
        else:
            r = p.add_run(); r.text = "▪  "
            r.font.size = Pt(size-2); r.font.color.rgb = dot_color; r.font.name = "Arial"
            r = p.add_run(); r.text = str(item)
            r.font.size = Pt(size); r.font.color.rgb = color; r.font.name = "Arial"


def add_table(slide, rows: list[list[str]], l, t, w, h) -> None:
    """Markdown-Tabelle als PPTX-Tabelle einfügen."""
    if not rows: return
    nr, nc = len(rows), max(len(r) for r in rows)
    col_w  = Inches(w / nc)
    row_h  = Inches(min(h / nr, 0.45))
    tbl    = slide.shapes.add_table(nr, nc, Inches(l), Inches(t),
                                    Inches(w), Inches(h)).table
    for ri, row in enumerate(rows):
        for ci in range(nc):
            cell = tbl.cell(ri, ci)
            text = row[ci] if ci < len(row) else ""
            text = clean_md(text)
            tf   = cell.text_frame
            tf.word_wrap = True
            p    = tf.paragraphs[0]
            run  = p.add_run()
            run.text = text
            run.font.name  = "Arial"
            run.font.size  = Pt(11)
            run.font.bold  = (ri == 0)
            run.font.color.rgb = WHITE if ri == 0 else DARK
            # Hintergrund
            tc = cell._tc
            tcPr = tc.get_or_add_tcPr()
            from pptx.oxml import parse_xml
            from lxml import etree
            fill_xml = (
                f'<a:solidFill xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
                f'<a:srgbClr val="{"003DA5" if ri == 0 else ("F4F6FA" if ri % 2 == 0 else "FFFFFF")}"/>'
                f'</a:solidFill>'
            )
            solidFill = etree.fromstring(fill_xml)
            tcPr.append(solidFill)


# ══════════════════════════════════════════════════════════════════════════
# FOLIENTYPEN
# ══════════════════════════════════════════════════════════════════════════

def standard_chrome(slide, label=""):
    """Linker Balken + optionaler Label-Text oben."""
    rect(slide, 0, 0, 0.08, 7.5, PRIMARY)
    if label:
        tbox(slide, label, 0.25, 0.2, 12.5, 0.35, size=9, color=GRAY)


def slide_title(prs, m):
    slide = blank_slide(prs)
    set_bg(slide, PRIMARY)
    rect(slide, 0, 0, 0.08, 7.5, ACCENT)
    # Breadcrumb
    tbox(slide,
         f"{m['id']}  ·  {m['kompetenzfeld']}  ·  Zielstufe: {m['stufe']}  ·  {m['dauer']}",
         0.4, 0.35, 12.5, 0.45, size=11, color=RGBColor(0xBB,0xCC,0xEE))
    rect(slide, 0.4, 0.88, 9, 0.025, RGBColor(0x33,0x5C,0xC0))
    # Titel
    tbox(slide, m["title"], 0.4, 1.1, 12.5, 2.8, size=42, bold=True, color=WHITE)
    if m["subtitle"]:
        tbox(slide, m["subtitle"], 0.4, 3.7, 11, 0.9, size=20,
             color=RGBColor(0xCC,0xD6,0xF0), italic=True)
    tbox(slide,
         f"Trainer-Präsentation  ·  {m['version']}  ·  Benedikt Zoller Coaching",
         0.4, 6.9, 12.5, 0.4, size=9, color=RGBColor(0x88,0x9A,0xCC))


def slide_lernziele(prs, m):
    slide = blank_slide(prs)
    set_bg(slide, LIGHT_BG)
    standard_chrome(slide)
    rect(slide, 0.25, 0.88, 12.7, 0.025, LINE)
    tbox(slide, "LERNZIELE", 0.4, 0.35, 5, 0.38, size=9, bold=True, color=PRIMARY)
    tbox(slide, "Was Sie nach diesem Modul können.", 0.4, 0.55, 11, 0.7,
         size=24, bold=True, color=DARK)
    bullet_box(slide, m["lernziele"], 0.4, 1.35, 12.5, 5.8, size=17)


def slide_divider(prs, title: str, sub: str = ""):
    slide = blank_slide(prs)
    set_bg(slide, DARK)
    rect(slide, 0, 0, 0.08, 7.5, ACCENT)
    tbox(slide, title, 0.4, 2.2, 12.5, 2.2, size=36, bold=True, color=WHITE)
    if sub:
        tbox(slide, sub, 0.4, 4.3, 11, 0.8, size=18, color=GRAY, italic=True)


def slide_content_bullets(prs, label: str, title: str,
                           items: list[str | tuple], footer="") -> None:
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    standard_chrome(slide, label)
    tbox(slide, title, 0.4, 0.3, 12.5, 0.85, size=22, bold=True, color=PRIMARY)
    rect(slide, 0.4, 1.1, 12.5, 0.03, LINE)
    bullet_box(slide, items, 0.4, 1.25, 12.5, 5.7, size=17)
    if footer:
        tbox(slide, footer, 0.4, 7.05, 12.5, 0.35, size=9, color=GRAY)


def slide_two_col(prs, label: str, title: str,
                  left_items: list, right_items: list, footer="") -> None:
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    standard_chrome(slide, label)
    tbox(slide, title, 0.4, 0.3, 12.5, 0.85, size=22, bold=True, color=PRIMARY)
    rect(slide, 0.4, 1.1, 12.5, 0.03, LINE)
    # Trennlinie Mitte
    rect(slide, 6.8, 1.3, 0.03, 5.8, LINE)
    bullet_box(slide, left_items,  0.4,  1.25, 6.2, 5.8, size=16)
    bullet_box(slide, right_items, 7.0,  1.25, 6.0, 5.8, size=16)
    if footer:
        tbox(slide, footer, 0.4, 7.05, 12.5, 0.35, size=9, color=GRAY)


def slide_table(prs, label: str, title: str, rows: list[list[str]]) -> None:
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    standard_chrome(slide, label)
    tbox(slide, title, 0.4, 0.3, 12.5, 0.85, size=22, bold=True, color=PRIMARY)
    rect(slide, 0.4, 1.1, 12.5, 0.03, LINE)
    # Tabellenhöhe dynamisch
    row_h  = min(0.52, 5.5 / len(rows))
    tbl_h  = row_h * len(rows)
    add_table(slide, rows, 0.4, 1.25, 12.5, tbl_h)


def slide_hint(prs, label: str, hint_text: str) -> None:
    """Trainer-Hinweis / Praxishinweis."""
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    standard_chrome(slide, label)
    rect(slide, 0.4, 0.9, 12.5, 5.8, HINT_BG)
    rect(slide, 0.4, 0.9, 0.08, 5.8, ACCENT)
    tbox(slide, "PRAXISHINWEIS", 0.65, 0.95, 5, 0.4, size=9, bold=True, color=ACCENT)
    tbox(slide, clean_md(hint_text), 0.65, 1.45, 12.0, 5.0,
         size=18, color=DARK, italic=True)


def slide_praxisfall(prs, label: str, title: str, portrait: str, situation: str) -> None:
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    standard_chrome(slide, label)
    # Oranger Header-Streifen
    rect(slide, 0.25, 0.25, 12.85, 0.75, ACCENT)
    tbox(slide, "PRAXISFALL", 0.4, 0.28, 4, 0.38, size=9, bold=True, color=WHITE)
    tbox(slide, title, 4.5, 0.28, 8.5, 0.42, size=16, bold=True, color=WHITE,
         align=PP_ALIGN.RIGHT)

    # Portrait-Box links
    rect(slide, 0.25, 1.1, 6.15, 5.6, LIGHT_BG)
    tbox(slide, "UNTERNEHMENSPORTRAIT", 0.45, 1.2, 5.6, 0.4, size=8, bold=True, color=GRAY)
    tbox(slide, clean_md(portrait), 0.45, 1.65, 5.7, 4.8, size=13, color=DARK)

    # Situation-Box rechts
    rect(slide, 6.55, 1.1, 6.55, 5.6, RGBColor(0xFF, 0xF8, 0xF0))
    rect(slide, 6.55, 1.1, 0.06, 5.6, ACCENT)
    tbox(slide, "SITUATION & AUFTRAG", 6.75, 1.2, 6.0, 0.4, size=8, bold=True, color=ACCENT)
    tbox(slide, clean_md(situation), 6.75, 1.65, 6.15, 4.8, size=14, color=DARK)


def slide_questions(prs, label: str, title: str, questions: list[str]) -> None:
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    standard_chrome(slide, label)
    tbox(slide, title, 0.4, 0.3, 12.5, 0.85, size=22, bold=True, color=PRIMARY)
    rect(slide, 0.4, 1.1, 12.5, 0.03, LINE)
    top = 1.3
    for i, q in enumerate(questions[:6], 1):
        # Nummernkreis
        rect(slide, 0.4, top, 0.5, 0.45, PRIMARY)
        tbox(slide, str(i), 0.4, top, 0.5, 0.45,
             size=14, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
        tbox(slide, q, 1.05, top, 11.7, 0.55, size=15, color=DARK)
        top += 0.8


def slide_ablaufplan(prs, m, rows: list[tuple]) -> None:
    slide = blank_slide(prs)
    set_bg(slide, WHITE)
    standard_chrome(slide)
    tbox(slide, "ABLAUFPLAN", 0.4, 0.22, 5, 0.38, size=9, bold=True, color=PRIMARY)
    tbox(slide, f"{m['title']} · {m['dauer']} · {m['format']}",
         0.4, 0.52, 11, 0.65, size=20, bold=True, color=DARK)
    rect(slide, 0.4, 1.15, 12.5, 0.03, LINE)
    top = 1.3
    step_h = min(0.72, 5.6 / max(len(rows), 1))
    for zeit, phase, inhalt in rows[:8]:
        rect(slide, 0.4, top, 1.4, step_h - 0.06, PRIMARY)
        tbox(slide, zeit, 0.4, top + 0.05, 1.4, step_h - 0.1,
             size=11, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
        rect(slide, 1.9, top, 2.5, step_h - 0.06, LIGHT_BG)
        tbox(slide, phase, 1.95, top + 0.05, 2.4, step_h - 0.1,
             size=11, bold=True, color=PRIMARY)
        tbox(slide, clean_md(inhalt), 4.55, top + 0.02, 8.8, step_h - 0.06,
             size=11, color=DARK)
        top += step_h


def slide_transfer(prs, m) -> None:
    slide = blank_slide(prs)
    set_bg(slide, PRIMARY)
    rect(slide, 0, 0, 0.08, 7.5, ACCENT)
    tbox(slide, "PRAXISTRANSFER & NÄCHSTE SCHRITTE", 0.4, 0.38, 8, 0.42,
         size=9, bold=True, color=RGBColor(0xCC,0xD6,0xF0))
    rect(slide, 0.4, 0.88, 9, 0.025, RGBColor(0x33,0x5C,0xC0))
    tbox(slide, "Was nehmen Sie mit?", 0.4, 1.05, 10, 1.0,
         size=30, bold=True, color=WHITE)
    items = [
        "Transferaufgabe: Wenden Sie das Gelernte in den nächsten 14 Tagen bei einem konkreten Kunden an.",
        "Selbstcheck nach 4 Wochen: Bewerten Sie Ihre Fortschritte ehrlich.",
    ]
    if m["folgemodule"]:
        items.append(f"Nächste Module: {', '.join(m['folgemodule'])}")
    bullet_box(slide, items, 0.4, 2.3, 12.5, 4.5,
               size=18, color=WHITE, dot_color=ACCENT, term_color=WHITE)
    tbox(slide,
         f"{m['id']} · {m['title']}  ·  {m['version']}  ·  Benedikt Zoller Coaching",
         0.4, 6.9, 12.5, 0.4, size=9, color=RGBColor(0x88,0x9A,0xCC))


# ══════════════════════════════════════════════════════════════════════════
# HAUPTLOGIK
# ══════════════════════════════════════════════════════════════════════════

def is_skip_section(title: str) -> bool:
    skip_kw = ["quellenverzeichnis", "literatur", "quellen", "feedbackbogen",
                "wissenstest", "evaluation", "musterlösung", "trainer-version",
                "self-check", "selbstcheck"]
    t = title.lower()
    return any(k in t for k in skip_kw)


def process_h4(prs, h4: str, body: str, label: str) -> None:
    """Eine H4-Sektion als 1–2 Folien."""
    if is_skip_section(h4): return

    # Tabelle?
    table_rows = parse_md_table(body)
    if table_rows and len(table_rows) >= 3:
        slide_table(prs, label, h4, table_rows)
        return

    # Bold-Definitionen?
    defs = extract_bold_definitions(body)
    if len(defs) >= 3:
        # Aufteilen bei > 5
        chunk = 5
        for i in range(0, len(defs), chunk):
            slide_content_bullets(prs, label, h4, defs[i:i+chunk])
        return

    # Blockquotes als Hinweis-Folie
    hints = extract_blockquotes(body)
    body_clean = re.sub(r"^>+.*$", "", body, flags=re.MULTILINE)

    # Normal-Bullets
    bullets = extract_bullets(body_clean, max_items=7)
    if bullets:
        # Zwei-Spalten wenn > 4
        if len(bullets) > 4:
            mid = (len(bullets) + 1) // 2
            slide_two_col(prs, label, h4, bullets[:mid], bullets[mid:])
        else:
            slide_content_bullets(prs, label, h4, bullets)

    for hint in hints[:1]:
        slide_hint(prs, label, hint)


def process_h3_praxisfall(prs, h3: str, body: str, label: str) -> None:
    """Praxisfall-Sektion: Portrait + Situation als Split-Folie, dann Fragen."""
    # Portrait = erster Absatz nach **Unternehmensportrait**
    portrait_m = re.search(r"\*\*Unternehmensportrait.*?\*\*\s*\n+(.*?)(?=\*\*Situation|---|\Z)",
                            body, re.DOTALL | re.IGNORECASE)
    situation_m = re.search(r"\*\*Situation.*?\*\*[:\s]*(.*?)(?=---|###|\Z)",
                             body, re.DOTALL | re.IGNORECASE)

    portrait  = portrait_m.group(1).strip()  if portrait_m  else ""
    situation = situation_m.group(1).strip() if situation_m else ""

    # Fallback: ersten Block als Portrait, zweiten als Situation
    if not portrait:
        paras = [p.strip() for p in re.split(r"\n{2,}", body) if p.strip() and not p.startswith("|")]
        portrait  = paras[0] if len(paras) > 0 else ""
        situation = paras[1] if len(paras) > 1 else ""

    if portrait or situation:
        slide_praxisfall(prs, label, h3, portrait, situation)

    # Restliche Tabellen/Aufgaben im Fall
    table_rows = parse_md_table(body)
    if table_rows and len(table_rows) >= 3:
        slide_table(prs, label, "Arbeitsaufgabe – " + h3, table_rows)


def process_h3_fragen(prs, h3: str, body: str, label: str) -> None:
    questions = extract_numbered_questions(body)
    if questions:
        slide_questions(prs, label, h3, questions)
    else:
        bullets = extract_bullets(body)
        if bullets:
            slide_content_bullets(prs, label, h3, bullets)


def process_h3(prs, h3: str, body: str, label: str) -> None:
    if is_skip_section(h3): return

    h3_lower = h3.lower()
    if "praxisfall" in h3_lower or "musterfall" in h3_lower or "fallstudie" in h3_lower:
        slide_divider(prs, h3, "Praxisfall & Fallanalyse")
        process_h3_praxisfall(prs, h3, body, label)
        return

    if "reflexionsfrage" in h3_lower or "lernfrage" in h3_lower:
        slide_divider(prs, h3)
        process_h3_fragen(prs, h3, body, label)
        return

    # Standard: H4 aufteilen oder direkt rendern
    h4_sections = split_h4_sections(body)
    if h4_sections:
        slide_divider(prs, h3)
        for sec in h4_sections:
            process_h4(prs, sec["h4"], sec["body"], label)
    else:
        # Kein H4 → direkt
        table_rows = parse_md_table(body)
        if table_rows and len(table_rows) >= 3:
            slide_divider(prs, h3)
            slide_table(prs, label, h3, table_rows)
            return
        defs = extract_bold_definitions(body)
        if len(defs) >= 2:
            slide_divider(prs, h3)
            slide_content_bullets(prs, label, h3, defs)
            return
        bullets = extract_bullets(body)
        if bullets:
            slide_divider(prs, h3)
            slide_content_bullets(prs, label, h3, bullets)


def generate(module_id: str) -> Path:
    m = parse_module(module_id)
    prs = Presentation()
    prs.slide_width  = SLIDE_W
    prs.slide_height = SLIDE_H

    # 1. Titel
    slide_title(prs, m)

    # 2. Ablaufplan aus Trainer-Content (wenn vorhanden)
    if m["trainer"]:
        rows = extract_ablaufplan(m["trainer"])
        if rows:
            slide_ablaufplan(prs, m, rows)

    # 3. Lernziele
    slide_lernziele(prs, m)

    # 4. Inhalte aus Body (H2 → H3 → H4)
    h2_sections = split_h2_sections(m["body"])
    for h2 in h2_sections:
        title = h2["h2"]
        body  = h2["body"]

        if is_skip_section(title): continue
        if "praxistransfer" in title.lower(): continue  # Abschluss separat

        h3_sections = split_h3_sections(body)
        for sec in h3_sections:
            process_h3(prs, sec["h3"], sec["body"], f"{m['id']} · {title}")

    # 5. Transfer-Abschluss
    slide_transfer(prs, m)

    out = OUTPUT_DIR / f"{module_id.upper()}.pptx"
    prs.save(out)
    print(f"✓  {out}  ({len(prs.slides)} Folien)")
    return out


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Verwendung: python3 generate_praesentation.py M01 | all")
        sys.exit(1)

    arg = sys.argv[1].upper()
    if arg == "ALL":
        ids = sorted(p.stem for p in MODULES_DIR.glob("M*.md"))
        for mid in ids:
            try:   generate(mid)
            except Exception as e: print(f"✗  {mid}: {e}")
    else:
        generate(arg)
