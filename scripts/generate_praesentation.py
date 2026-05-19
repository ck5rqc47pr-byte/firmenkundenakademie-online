#!/usr/bin/env python3
"""
generate_praesentation.py  –  Trainer-Präsentation als PPTX
Verwendung: python3 scripts/generate_praesentation.py M01
Ausgabe:    public/downloads/praesentation/M01.pptx
"""

import sys
import os
import re
import textwrap
from pathlib import Path

try:
    from pptx import Presentation
    from pptx.util import Inches, Pt, Emu
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN
    from pptx.util import Inches, Pt
    import yaml
except ImportError as e:
    print(f"Fehlende Abhängigkeit: {e}")
    print("Bitte installieren: pip3 install python-pptx pyyaml")
    sys.exit(1)

# ── CI-Farben ──────────────────────────────────────────────────────────────
PRIMARY   = RGBColor(0x00, 0x3D, 0xA5)   # #003DA5 VR-Blau
ACCENT    = RGBColor(0xE0, 0x5B, 0x00)   # #E05B00 Orange
WHITE     = RGBColor(0xFF, 0xFF, 0xFF)
DARK      = RGBColor(0x1A, 0x1A, 0x1A)
GRAY      = RGBColor(0x6B, 0x72, 0x80)
LIGHT_BG  = RGBColor(0xF5, 0xF7, 0xFA)
LINE      = RGBColor(0xE5, 0xE7, 0xEB)

# ── Foliengröße: Widescreen 16:9 ──────────────────────────────────────────
SLIDE_W = Inches(13.33)
SLIDE_H = Inches(7.5)

# ── Pfade ──────────────────────────────────────────────────────────────────
SCRIPT_DIR   = Path(__file__).parent
AKADEMIE_DIR = SCRIPT_DIR.parent
MODULES_DIR  = AKADEMIE_DIR / "content" / "modules"
OUTPUT_DIR   = AKADEMIE_DIR / "public" / "downloads" / "praesentation"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def parse_module(module_id: str) -> dict:
    path = MODULES_DIR / f"{module_id.upper()}.md"
    if not path.exists():
        print(f"Modul nicht gefunden: {path}")
        sys.exit(1)
    text = path.read_text(encoding="utf-8")

    # Frontmatter extrahieren
    fm_match = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if not fm_match:
        print("Kein Frontmatter gefunden.")
        sys.exit(1)
    fm = yaml.safe_load(fm_match.group(1))
    body = text[fm_match.end():]

    # Trainer-Sektion extrahieren (CONTENT_TRAINER_START … END)
    trainer_match = re.search(
        r"<!-- CONTENT_TRAINER_START -->(.*?)<!-- CONTENT_TRAINER_END -->",
        body, re.DOTALL
    )
    trainer_content = trainer_match.group(1).strip() if trainer_match else ""
    if trainer_match:
        body = body[:trainer_match.start()] + body[trainer_match.end():]

    # Theorie-Sektion extrahieren
    theorie_match = re.search(
        r"<!-- CONTENT_THEORIE_START -->(.*?)<!-- CONTENT_THEORIE_END -->",
        body, re.DOTALL
    )
    if theorie_match:
        body = body[:theorie_match.start()] + body[theorie_match.end():]

    # Kommentare und Stand-Zeile entfernen
    body = re.sub(r"<!--.*?-->", "", body, flags=re.DOTALL)
    body = re.sub(r"^>.*?Stand:.*$", "", body, flags=re.MULTILINE)
    body = re.sub(r"<!-- SECTION_BREAK -->", "", body)

    return {
        "id":            str(fm.get("id", module_id)),
        "title":         str(fm.get("title", "")),
        "subtitle":      str(fm.get("subtitle", "")),
        "kompetenzfeld": str(fm.get("kompetenzfeld", "")),
        "stufe":         str(fm.get("stufe", "")),
        "dauer":         str(fm.get("dauer", "")),
        "format":        str(fm.get("format", "")),
        "version":       str(fm.get("version", "")),
        "lernziele":     fm.get("lernziele", []),
        "body":          body.strip(),
        "trainer":       trainer_content,
    }


def clean_md(text: str) -> str:
    """Markdown-Formatierung für Fließtext entfernen."""
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"\*(.+?)\*",     r"\1", text)
    text = re.sub(r"`(.+?)`",       r"\1", text)
    text = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", text)
    text = re.sub(r"^#+\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"^>+\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"\|.*", "", text)           # Tabellen entfernen
    text = re.sub(r"^[-|]+$", "", text, flags=re.MULTILINE)
    text = re.sub(r"^---+$", "", text, flags=re.MULTILINE)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_bullets(text: str, max_items: int = 7) -> list[str]:
    """Bullet-Punkte oder erste Sätze aus einem Textblock extrahieren."""
    bullets = []
    for line in text.splitlines():
        line = line.strip()
        if re.match(r"^[-*•]\s+", line):
            bullet = re.sub(r"^[-*•]\s+", "", line)
            bullet = clean_md(bullet)
            if bullet:
                bullets.append(bullet)
    if not bullets:
        # Absätze als Bullets nehmen
        for para in text.split("\n\n"):
            para = clean_md(para).strip()
            if para and not para.startswith("|"):
                truncated = textwrap.shorten(para, width=120, placeholder="…")
                bullets.append(truncated)
    return bullets[:max_items]


def split_into_sections(body: str) -> list[dict]:
    """H3-Abschnitte (###) als Folien-Grundlage extrahieren."""
    sections = []
    parts = re.split(r"^###\s+(.+)$", body, flags=re.MULTILINE)
    # parts: [vor-erstem-###, titel1, inhalt1, titel2, inhalt2, ...]
    for i in range(1, len(parts) - 1, 2):
        title   = parts[i].strip()
        content = parts[i + 1].strip() if i + 1 < len(parts) else ""
        # H4-Unterabschnitte innerhalb einer Section
        sub_parts = re.split(r"^####\s+(.+)$", content, flags=re.MULTILINE)
        if len(sub_parts) > 1:
            for j in range(1, len(sub_parts) - 1, 2):
                sub_title   = sub_parts[j].strip()
                sub_content = sub_parts[j + 1].strip() if j + 1 < len(sub_parts) else ""
                sections.append({"title": sub_title, "content": sub_content, "level": 4})
        else:
            sections.append({"title": title, "content": content, "level": 3})
    return sections


# ── Folien-Helpers ─────────────────────────────────────────────────────────

def set_bg(slide, color: RGBColor):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_rect(slide, left, top, width, height, color: RGBColor):
    shape = slide.shapes.add_shape(
        1,  # MSO_SHAPE_TYPE.RECTANGLE
        Inches(left), Inches(top), Inches(width), Inches(height)
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    return shape


def add_text_box(slide, text: str, left, top, width, height,
                 font_size=18, bold=False, color=DARK,
                 align=PP_ALIGN.LEFT, font_name="Arial", wrap=True) -> None:
    txBox = slide.shapes.add_textbox(
        Inches(left), Inches(top), Inches(width), Inches(height)
    )
    tf = txBox.text_frame
    tf.word_wrap = wrap
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size     = Pt(font_size)
    run.font.bold     = bold
    run.font.color.rgb = color
    run.font.name     = font_name


def add_bullet_box(slide, bullets: list[str], left, top, width, height,
                   font_size=16, color=DARK, accent=PRIMARY) -> None:
    txBox = slide.shapes.add_textbox(
        Inches(left), Inches(top), Inches(width), Inches(height)
    )
    tf = txBox.text_frame
    tf.word_wrap = True
    first = True
    for bullet in bullets:
        if first:
            p = tf.paragraphs[0]
            first = False
        else:
            p = tf.add_paragraph()
        p.space_before = Pt(4)
        # Bullet-Symbol
        run_dot = p.add_run()
        run_dot.text = "▪  "
        run_dot.font.size      = Pt(font_size - 2)
        run_dot.font.color.rgb = accent
        run_dot.font.name      = "Arial"
        # Bullet-Text
        run = p.add_run()
        run.text           = bullet
        run.font.size      = Pt(font_size)
        run.font.color.rgb = color
        run.font.name      = "Arial"


# ── Folientypen ────────────────────────────────────────────────────────────

def slide_title(prs: Presentation, m: dict) -> None:
    """Titelfolie: dunkler Hintergrund, Modultitel groß."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # blank
    set_bg(slide, PRIMARY)

    # Oranger Akzentstreifen links
    add_rect(slide, 0, 0, 0.08, 7.5, ACCENT)

    # Breadcrumb
    add_text_box(slide,
        f"{m['id']}  ·  {m['kompetenzfeld']}  ·  {m['stufe']}  ·  {m['dauer']}",
        0.4, 0.4, 12.5, 0.5,
        font_size=11, color=RGBColor(0xFF, 0xFF, 0xFF),
    )
    add_rect(slide, 0.4, 0.95, 8, 0.03, RGBColor(0xFF, 0xFF, 0xFF))

    # Titel
    add_text_box(slide, m["title"],
        0.4, 1.2, 12.5, 2.5,
        font_size=40, bold=True, color=WHITE)

    # Untertitel
    if m["subtitle"]:
        add_text_box(slide, m["subtitle"],
            0.4, 3.5, 10, 1.0,
            font_size=20, color=RGBColor(0xCC, 0xD6, 0xF0))

    # Version + Ersteller
    add_text_box(slide,
        f"Trainer-Präsentation  ·  {m['version']}  ·  Benedikt Zoller Coaching",
        0.4, 6.8, 12.5, 0.5,
        font_size=10, color=RGBColor(0x99, 0xAA, 0xCC))


def slide_agenda(prs: Presentation, m: dict) -> None:
    """Agenda-Folie mit Lernzielen."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide, LIGHT_BG)
    add_rect(slide, 0, 0, 0.08, 7.5, PRIMARY)
    add_rect(slide, 0.4, 0.95, 8, 0.03, LINE)

    add_text_box(slide, "LERNZIELE", 0.4, 0.35, 4, 0.4,
        font_size=10, bold=True, color=PRIMARY)
    add_text_box(slide, "Was Sie nach diesem Modul können.", 0.4, 0.55, 10, 0.6,
        font_size=22, bold=True, color=DARK)

    lernziele = m.get("lernziele", [])
    bullets = []
    for lz in lernziele:
        if isinstance(lz, dict):
            bullets.append(lz.get("text", ""))
        else:
            bullets.append(str(lz))

    add_bullet_box(slide, bullets, 0.4, 1.3, 12.5, 5.8, font_size=16)


def slide_divider(prs: Presentation, title: str, subtitle: str = "") -> None:
    """Trennfolie zwischen Abschnitten."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide, DARK)
    add_rect(slide, 0, 0, 0.08, 7.5, ACCENT)

    add_text_box(slide, title,
        0.4, 2.5, 12.5, 2.0,
        font_size=36, bold=True, color=WHITE)
    if subtitle:
        add_text_box(slide, subtitle,
            0.4, 4.3, 10, 0.8,
            font_size=18, color=RGBColor(0xAA, 0xAA, 0xAA))


def slide_content(prs: Presentation, title: str, bullets: list[str],
                  slide_nr: int = 0) -> None:
    """Standard-Inhaltsfolie."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide, WHITE)
    add_rect(slide, 0, 0, 0.08, 7.5, PRIMARY)

    # Titel
    add_text_box(slide, title,
        0.4, 0.3, 12.5, 0.9,
        font_size=22, bold=True, color=PRIMARY)
    add_rect(slide, 0.4, 1.15, 12.5, 0.03, LINE)

    # Bullets
    add_bullet_box(slide, bullets, 0.4, 1.35, 12.5, 5.7, font_size=17)

    # Seitenzahl
    if slide_nr:
        add_text_box(slide, str(slide_nr),
            12.8, 7.1, 0.4, 0.3,
            font_size=10, color=GRAY, align=PP_ALIGN.RIGHT)


def slide_transfer(prs: Presentation, m: dict) -> None:
    """Abschlussfolie: Transfer & nächste Schritte."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide, PRIMARY)
    add_rect(slide, 0, 0, 0.08, 7.5, ACCENT)

    add_text_box(slide, "PRAXISTRANSFER", 0.4, 0.4, 6, 0.4,
        font_size=10, bold=True, color=RGBColor(0xCC, 0xD6, 0xF0))
    add_text_box(slide, "Was nehmen Sie mit?", 0.4, 0.7, 10, 1.0,
        font_size=28, bold=True, color=WHITE)
    add_rect(slide, 0.4, 1.6, 8, 0.03, RGBColor(0x33, 0x5C, 0xC0))

    # Folgemodule
    folgemodule = m.get("folgemodule", []) if isinstance(m.get("folgemodule"), list) else []
    items = [
        "Transferaufgabe: Wenden Sie das Gelernte in den nächsten 14 Tagen bei einem konkreten Kunden an.",
        "Selbstcheck nach 4 Wochen: Was hat sich verändert?",
    ]
    if folgemodule:
        items.append(f"Nächste Module: {', '.join(folgemodule)}")

    add_bullet_box(slide, items, 0.4, 1.8, 12.5, 4.5,
        font_size=18, color=WHITE, accent=ACCENT)

    add_text_box(slide,
        f"{m['id']} · {m['title']}  ·  {m['version']}  ·  Benedikt Zoller Coaching",
        0.4, 6.9, 12.5, 0.4,
        font_size=9, color=RGBColor(0x99, 0xAA, 0xCC))


# ── Hauptfunktion ──────────────────────────────────────────────────────────

def generate(module_id: str) -> Path:
    m = parse_module(module_id)
    sections = split_into_sections(m["body"])

    prs = Presentation()
    prs.slide_width  = SLIDE_W
    prs.slide_height = SLIDE_H

    # 1. Titelfolie
    slide_title(prs, m)

    # 2. Lernziele
    slide_agenda(prs, m)

    # 3. Inhaltsfolien aus Sektionen
    content_slides = 0
    prev_h3 = ""
    for sec in sections:
        title   = sec["title"]
        content = sec["content"]

        # Nummerierung / Trainer-Hinweise überspringen
        if any(kw in title.lower() for kw in ["musterlösung", "trainer-version", "trainer-hinweis", "trainer-tipp"]):
            continue
        # Bewertungsbögen / Quellen überspringen
        if any(kw in title.lower() for kw in ["quellenverzeichnis", "literatur", "feedbackbogen", "wissenstest"]):
            continue

        # Trennfolie bei neuem H3-Block
        if sec["level"] == 3 and title != prev_h3:
            slide_divider(prs, title)
            prev_h3 = title
            continue

        bullets = extract_bullets(content, max_items=6)
        if not bullets:
            clean = clean_md(content)
            if clean:
                bullets = [textwrap.shorten(clean, 300, placeholder="…")]

        if bullets:
            content_slides += 1
            slide_content(prs, title, bullets, slide_nr=content_slides)

    # 4. Transfer-Abschlussfolie
    slide_transfer(prs, m)

    # Speichern
    out_path = OUTPUT_DIR / f"{module_id.upper()}.pptx"
    prs.save(out_path)
    print(f"✓  {out_path}")
    return out_path


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Verwendung: python3 generate_praesentation.py M01")
        print("            python3 generate_praesentation.py all")
        sys.exit(1)

    arg = sys.argv[1].upper()
    if arg == "ALL":
        ids = sorted(p.stem for p in MODULES_DIR.glob("M*.md"))
        for mid in ids:
            try:
                generate(mid)
            except Exception as e:
                print(f"✗  {mid}: {e}")
    else:
        generate(arg)
