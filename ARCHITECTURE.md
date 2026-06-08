# Firmenkundenakademie – Online-Akademie

> Diese Datei ist die zentrale Steuerungsdatei für Codex.
> Lies sie vollständig, bevor du mit der Arbeit beginnst.

## Projektauftrag

Baue eine öffentlich zugängliche Online-Lernplattform für die
„Firmenkundenakademie" von FKB Campus. Die Plattform
richtet sich an Firmenkundenberater von Volksbanken/Raiffeisenbanken
und vermarktet wissenschaftlich fundierte Weiterbildungsmodule.

Die Modulinhalte liegen als Markdown-Dateien in `content/modules/`
(eine Datei pro Modul). Die Plattform liest diese Dateien als einzige
Content-Source. Ein neues Modul erscheint automatisch auf der
Plattform, sobald eine neue `.md`-Datei in diesem Ordner liegt –
kein Code-Eingriff nötig.

---

## Tech Stack (verbindlich)

| Entscheidung | Wahl |
|---|---|
| Framework | Next.js 14 (App Router) |
| Sprache | TypeScript |
| Styling | Tailwind CSS |
| Markdown | gray-matter (Frontmatter) + next-mdx-remote (Rendering) |
| Deployment | Vercel |
| Videos | YouTube-iFrame-Embed; leer = Platzhalter-Komponente |
| Datenbank | Keine – rein dateibasiert |

---

## Corporate Design

```
Primärfarbe:   #003DA5  (Blau   – Überschriften H1/H2, Buttons, Header)
Akzentfarbe:   #E05B00  (Orange – H3, Badges, Hover-States)
Schriftart:    Inter (Google Fonts) als Web-Äquivalent zu Arial
Hintergrund:   #F8F9FB  (sehr helles Grau)
Text:          #1A1A2E  (fast Schwarz)
```

Designprinzip: Professionell, klar, akademisch. Kein verspieltes
oder überlaufenes Layout. Viel Weißraum.

---

## Modul-Datenstruktur

Jede Datei in `content/modules/` hat YAML-Frontmatter + Markdown-Body:

```yaml
---
id: "M06"
title: "KMU-Kompetenz Grundlagen"
subtitle: "Branchenwissen für den Firmenkundenberater"
kompetenzfeld: "K-02 Branchenwissen"
kompetenzfeld_slug: "branchenwissen"
stufe: "Berater"             # Berater | Sparringspartner | Stratege
bloom: "1–3"
dauer: "90–120 Min."
format: "Blended Learning"
status: "freigegeben"        # freigegeben | draft | coming-soon
version: "v0.2"
voraussetzungen: ["M01"]
folgemodule: ["M07", "M08"]
youtube_id: ""               # leer = Platzhalter anzeigen
lernziele:
  - text: "KMU nach IfM- und EU-Definition einordnen"
    bloom_stufe: 1
  - text: "Volkswirtschaftliche Bedeutung von KMU erläutern"
    bloom_stufe: 2
  - text: "Finanzierungsmuster und Risikofelder beschreiben"
    bloom_stufe: 2
  - text: "KMU-Kunden mit 5-Fragen-Schema einordnen"
    bloom_stufe: 3
---

Hier beginnt der Markdown-Body mit dem vollständigen Modulinhalt.
```

---

## TypeScript-Interface (verbindlich)

```typescript
interface Module {
  id: string;                          // "M06"
  title: string;
  subtitle: string;
  kompetenzfeld: string;               // "K-02 Branchenwissen"
  kompetenzfeld_slug: string;          // "branchenwissen"
  stufe: "Berater" | "Sparringspartner" | "Stratege";
  bloom: string;
  dauer: string;
  format: string;
  status: "freigegeben" | "draft" | "coming-soon";
  version: string;
  voraussetzungen: string[];
  folgemodule: string[];
  youtube_id: string;
  lernziele: { text: string; bloom_stufe: 1|2|3|4|5|6 }[];
  content: string;                     // gerendertes HTML
  slug: string;                        // URL-Segment (= id)
}
```

---

## Ordnerstruktur (vollständig anlegen)

```
/
├── AGENTS.md                          ← diese Datei (nicht ändern)
├── app/
│   ├── layout.tsx                     ← Root Layout: Nav + Footer
│   ├── page.tsx                       ← Startseite
│   ├── module/
│   │   ├── page.tsx                   ← Modulübersicht mit Filter
│   │   └── [id]/
│   │       └── page.tsx               ← Einzelne Modulseite
│   └── kompetenzfeld/
│       └── [slug]/
│           └── page.tsx               ← Alle Module eines Feldes
├── components/
│   ├── ModuleCard.tsx
│   ├── ModuleHeader.tsx
│   ├── MetaBox.tsx
│   ├── VideoEmbed.tsx
│   ├── BloomBadge.tsx
│   ├── StufenBadge.tsx
│   ├── FilterBar.tsx
│   ├── LernpfadVisualisierung.tsx
│   ├── MarkdownRenderer.tsx
│   └── NavBar.tsx
├── lib/
│   ├── modules.ts                     ← getAllModules(), getModuleById()
│   └── markdown.ts                    ← Markdown → HTML
├── content/
│   └── modules/                       ← ← ← EINZIGE CONTENT-QUELLE
│       ├── M01.md
│       ├── M06.md
│       ├── M08.md
│       └── ...                        ← neue .md = neues Modul
├── public/
│   └── downloads/                     ← PDF-Platzhalter
├── scripts/
│   └── sync-modules.sh                ← zieht neue Module aus Akademie-Projekt
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## Seitenstruktur

### Startseite `/`
- Hero: Headline, Subline „21 Module · 5 Kompetenzfelder · Akademie-Niveau",
  CTA-Button „Alle Module ansehen" in Primärfarbe
- 3 Kompetenzfeld-Kacheln (Finanzanalyse / Branchenwissen /
  Gesprächsführung) mit Modulanzahl und Kurztext
- Abschnitt „Wie die Akademie funktioniert" (3 Schritte: Modul wählen
  → Video + Unterlagen → Transfer in die Praxis)
- Footer: © FKB Campus | Impressum | Datenschutz

### Modulübersicht `/module`
- Filterleiste: Kompetenzfeld (Dropdown), Stufe (Tabs:
  Alle / Berater / Sparringspartner / Stratege), Status
- Modul-Grid (3 Spalten Desktop, 1 Spalte Mobile)
- ModuleCard zeigt: Nummer-Badge, Titel, Kompetenzfeld, Stufe,
  Dauer, Status-Chip

  Status-Chips:
  - `freigegeben`  → grün   „Verfügbar"
  - `draft`        → grau   „In Vorbereitung"
  - `coming-soon`  → orange „Demnächst"

### Modulseite `/module/[id]`

Aufbau von oben nach unten:

**a) Header-Banner** (#003DA5, weiße Schrift)
- Breadcrumb: Akademie > Kompetenzfeld > Titel
- Modultitel (H1, groß), StufenBadge, Dauer-Badge

**b) Meta-Box** (zweispaltig, sticky auf Desktop)
- Links: Lernziele als Liste mit BloomBadge je Ziel
  - Stufe 1 = hellblau, 2 = blau, 3 = #E05B00 (orange),
    4 = dunkelorange, 5/6 = dunkelrot
- Rechts: Format, Voraussetzungen (verlinkte Chips), Folgemodule
  (verlinkte Chips), Version, Status

**c) Video-Bereich** (volle Breite)
- `youtube_id` gesetzt  → responsives YouTube-iFrame (16:9)
- `youtube_id` leer     → Platzhalter-Box (#003DA5, Play-Icon,
  Text „Video in Produktion – bald verfügbar")

**d) Modulinhalt** (gerendertes Markdown)
- H2 in #003DA5, H3 in #E05B00
- Tabellen: Header-Zeile #003DA5 + weiße Schrift, Zebrastreifen
- Callout-Boxen: `> Praxistipp:` → oranger linker Rand (#E05B00)
- Inline-Quellen `[Q-XXX]` → Superscript, Tooltip mit Volltitel
- Formeln in Code-Blöcken → grauer Hintergrund, Monospace

**e) Download-Bereich**
- „Teilnehmerunterlagen (PDF)" – Platzhalter-Button
- „Selbstcheck-Bogen (PDF)" – Platzhalter-Button

**f) Modul-Navigation**
- ← Voriges Modul (verlinkt) | Nächstes Modul → (verlinkt)
- „Zurück zur Modulübersicht"

### Kompetenzfeld-Seiten `/kompetenzfeld/[slug]`
- Alle Module dieses Feldes als Cards
- Lernpfad-Visualisierung: Berater → Sparringspartner → Stratege
  (horizontal, verbunden mit Pfeilen)

---

## Kernfunktion: Neues Modul hinzufügen (KEIN Code-Eingriff)

```bash
# 1. Sync-Skript ausführen (zieht neue Module aus dem Akademie-Projekt)
./scripts/sync-modules.sh

# 2. Frontmatter in content/modules/MXX.md prüfen / ergänzen

# 3. Git commit + push → Vercel deployed automatisch
git add content/modules/MXX.md
git commit -m "feat: Modul MXX hinzugefügt"
git push
```

Das ist der vollständige Workflow. Kein Next.js-Code muss geändert
werden.

---

## lib/modules.ts – Pflichtimplementierung

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const MODULES_DIR = path.join(process.cwd(), 'content', 'modules')

export function getAllModules(): Module[] {
  const files = fs.readdirSync(MODULES_DIR).filter(f => f.endsWith('.md'))
  return files
    .map(file => parseModule(file))
    .sort((a, b) => a.id.localeCompare(b.id))
}

export function getModuleById(id: string): Module | null {
  const file = `${id.toUpperCase()}.md`
  const filePath = path.join(MODULES_DIR, file)
  if (!fs.existsSync(filePath)) return null
  return parseModule(file)
}

export function getModulesByKompetenzfeld(slug: string): Module[] {
  return getAllModules().filter(m => m.kompetenzfeld_slug === slug)
}

function parseModule(filename: string): Module {
  const filePath = path.join(MODULES_DIR, filename)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    ...data,
    slug: data.id,
    content,  // raw markdown; wird in der Page zu HTML gerendert
  } as Module
}
```

---

## Implementierungsreihenfolge (Schritt für Schritt)

1. Next.js 14 + TypeScript + Tailwind initialisieren
2. `tailwind.config.ts` mit CI-Farben konfigurieren:
   ```js
   colors: { primary: '#003DA5', accent: '#E05B00' }
   ```
3. `lib/modules.ts` implementieren
4. Alle Komponenten als leere Shells anlegen (Typen korrekt)
5. Startseite `/` mit Hero und Kompetenzfeld-Kacheln
6. Modulübersicht `/module` mit FilterBar und ModuleCard-Grid
7. Modulseite `/module/[id]` mit allen 6 Abschnitten (a–f)
8. VideoEmbed mit Platzhalter-Logik
9. Kompetenzfeld-Seite mit Lernpfad-Visualisierung
10. Vercel-Deployment testen
11. README.md mit „Neues Modul hinzufügen"-Anleitung

---

## Was in Phase 1 NICHT gebaut wird

- Kein Login / keine Authentifizierung
- Keine Datenbank
- Kein Fortschritts-Tracking
- Kein Zahlungssystem
- Kein CMS-Backend
- Keine Kommentarfunktion

---

## Qualitätskriterien (Definition of Done)

- [ ] Lighthouse Score ≥ 90 (Performance, Accessibility)
- [ ] Vollständig responsiv (Mobile-first)
- [ ] Neues Modul erscheint durch `.md`-Datei ohne Code-Änderung
- [ ] YouTube-ID leer → Platzhalter; gesetzt → funktionierender Embed
- [ ] Alle Links zwischen Modulen funktionieren
- [ ] Vercel-Deployment fehlerfrei
