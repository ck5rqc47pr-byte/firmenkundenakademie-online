import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Ablaufphase für „So läuft das Modul" – von sync_akademie.py aus dem
// Sec-3.1-Ablaufplan extrahiert (teilnehmertaugliche Spalten).
export interface AblaufPhase {
  zeit: string;
  phase: string;
  methode: string;
  dauer?: string;
}

// ── Track-Modell ───────────────────────────────────────────────────────────
// Zwei parallele Lernpfade: Berater-Track (K-01…K-06) und Vertriebsassistenz-
// Track (K-A01…K-A05). Diese Konstanten sind die *einzige* Quelle für Stufen-
// und Kompetenzfeld-Definitionen je Track – Kompass, Einschätzungsbogen,
// Modulübersicht, Admin und Trainer leiten ihre Listen daraus ab.
export type Zielrolle = "berater" | "assistenz";

export type BeraterStufe = "Berater" | "Sparringspartner" | "Strategischer Partner";
export type AssistenzStufe = "Sachbearbeitung" | "Eigenständige Assistenz" | "Co-Pilot";
export type Stufe = BeraterStufe | AssistenzStufe;

export interface KompetenzfeldDef {
  slug: string;
  label: string;
}

export interface TrackDef {
  id: Zielrolle;
  label: string;
  stufen: [Stufe, Stufe, Stufe];
  felder: KompetenzfeldDef[];
}

export const TRACKS: Record<Zielrolle, TrackDef> = {
  berater: {
    id: "berater",
    label: "Berater",
    stufen: ["Berater", "Sparringspartner", "Strategischer Partner"],
    felder: [
      { slug: "finanzanalyse", label: "Finanzanalyse" },
      { slug: "branchenwissen", label: "Branchenwissen" },
      { slug: "gespraechsfuehrung", label: "Gesprächsführung" },
      { slug: "vertrieb", label: "Vertrieb" },
      { slug: "digital", label: "Digital" },
      { slug: "fuehrung", label: "Führung" },
    ],
  },
  assistenz: {
    id: "assistenz",
    label: "Vertriebsassistenz",
    stufen: ["Sachbearbeitung", "Eigenständige Assistenz", "Co-Pilot"],
    felder: [
      { slug: "k-a00", label: "Orientierung & Grundlagen" },
      { slug: "k-a01", label: "Auftrags- & Kreditsachbearbeitung" },
      { slug: "k-a02", label: "Systeme & Prozesse" },
      { slug: "k-a03", label: "Kundenkommunikation Innendienst" },
      { slug: "k-a04", label: "Zusammenarbeit & Selbstorganisation" },
      { slug: "k-a05", label: "Vertriebsunterstützung" },
      { slug: "k-a06", label: "Neugeschäft & gesetzliche Sorgfaltspflichten" },
    ],
  },
};

const STUFE_TO_TRACK: Record<Stufe, Zielrolle> = {
  Berater: "berater",
  Sparringspartner: "berater",
  "Strategischer Partner": "berater",
  Sachbearbeitung: "assistenz",
  "Eigenständige Assistenz": "assistenz",
  "Co-Pilot": "assistenz",
};

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  kurzbeschreibung: string;       // kuratierter Überblickstext (Quelle: Modul-MD-Frontmatter)
  hero_grafik: string;            // zentrale Konzept-Grafik (erste Grafik in Sec 4)
  praxisfall_vignette: string;    // Fall-Vignette aus Sec 4 (Unternehmensportrait)
  workbook_inhalt: string[];      // Inhaltsliste des Workbooks (AB-/Abschnitts-Titel)
  ablauf: AblaufPhase[];          // Workshop-Ablauf (Zeit/Phase/Methode)
  kompetenzfeld: string;
  kompetenzfeld_slug: string;
  stufe: Stufe;
  zielrolle: Zielrolle;
  bloom: string;
  dauer: string;
  format: string;
  premium: boolean;          // Premium-Modul (Stufe Strategischer Partner, eigene Hervorhebung)
  status: "freigegeben" | "draft" | "coming-soon";
  version: string;
  voraussetzungen: string[];
  folgemodule: string[];
  youtube_id: string;
  praxis_review: boolean;    // Praxis-Review durch Armin abgeschlossen
  wiss_review: boolean;      // Wissenschaftliches Review durch Prof. Brandt abgeschlossen
  sim_review: boolean;       // Workshop-Simulation + Verbesserungsvorschläge ins Modul eingearbeitet
  ergaenzung: boolean;       // Sec 2 + 3 + 6 fertig (Wissenschaft, Trainerhandbuch, Evaluation)
  lernziele: { text: string; bloom_stufe: 1 | 2 | 3 | 4 | 5 | 6 }[];
  content: string;
  content_theorie: string;   // Sec 2 – Wissenschaftliche Einordnung (alle Rollen)
  content_trainer: string;   // Sec 3 + Sec 6 – nur Trainer / Admin
  slug: string;
}

const MODULES_DIR = path.join(process.cwd(), "content", "modules");
const PARTICIPANT_HANDOUTS_DIR = path.join(
  process.cwd(),
  "public",
  "downloads",
  "teilnehmerunterlagen",
);
// Workbooks liegen rollengeschützt (teilnehmer+); nur das Schaufenster-
// Exemplar (M01) bleibt in public/ und ist ohne Login abrufbar.
const PARTICIPANT_HANDOUTS_PROTECTED_DIR = path.join(
  process.cwd(),
  "protected-downloads",
  "teilnehmerunterlagen",
);
// Trainer-Material liegt außerhalb von public/ und wird nur über die
// rollengeschützte Route /api/downloads/... ausgeliefert (siehe B2).
const TRAINER_HANDBOOKS_DIR = path.join(
  process.cwd(),
  "protected-downloads",
  "trainerhandbuch",
);
const BEOBACHTUNGSBOGEN_DIR = path.join(
  process.cwd(),
  "protected-downloads",
  "beobachtungsbogen",
);

export function getAllModules(): Module[] {
  const files = fs.readdirSync(MODULES_DIR).filter((file) => file.endsWith(".md"));
  return files.map((file) => parseModule(file)).sort((a, b) => a.id.localeCompare(b.id));
}

export function getModuleById(id: string): Module | null {
  const file = `${id.toUpperCase()}.md`;
  const filePath = path.join(MODULES_DIR, file);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return parseModule(file);
}

export function getModulesByKompetenzfeld(slug: string): Module[] {
  return getAllModules().filter((module) => module.kompetenzfeld_slug === slug);
}

export function getModulesByZielrolle(zielrolle: Zielrolle): Module[] {
  return getAllModules().filter((module) => module.zielrolle === zielrolle);
}

export function getKompetenzfelder(zielrolle?: Zielrolle) {
  const source = zielrolle ? getModulesByZielrolle(zielrolle) : getAllModules();
  return source.reduce<
    { slug: string; name: string; count: number }[]
  >((fields, module) => {
    const existing = fields.find((field) => field.slug === module.kompetenzfeld_slug);
    if (existing) {
      existing.count += 1;
      return fields;
    }

    fields.push({
      slug: module.kompetenzfeld_slug,
      name: module.kompetenzfeld,
      count: 1,
    });

    return fields;
  }, []);
}

export function getAdjacentModules(id: string) {
  const modules = getAllModules();
  const index = modules.findIndex((module) => module.id === id);

  return {
    previous: index > 0 ? modules[index - 1] : null,
    next: index >= 0 && index < modules.length - 1 ? modules[index + 1] : null,
  };
}

export function getParticipantHandoutPdfUrl(moduleId: string): string | null {
  const normalizedId = moduleId.toUpperCase();
  const filename = `${normalizedId}.pdf`;

  // Öffentliches Schaufenster-Exemplar (M01) zuerst
  if (fs.existsSync(path.join(PARTICIPANT_HANDOUTS_DIR, filename))) {
    return `/downloads/teilnehmerunterlagen/${filename}`;
  }
  // Rollengeschützte Workbooks via API-Route
  if (fs.existsSync(path.join(PARTICIPANT_HANDOUTS_PROTECTED_DIR, filename))) {
    return `/api/downloads/teilnehmerunterlagen/${filename}`;
  }
  return null;
}

export function getArbeitsmaterialUrl(moduleId: string): string | null {
  const normalizedId = moduleId.toUpperCase();
  const filename = `${normalizedId}.xlsx`;
  const absolutePath = path.join(
    process.cwd(), "protected-downloads", "arbeitsmaterial", filename,
  );
  if (!fs.existsSync(absolutePath)) return null;
  return `/api/downloads/arbeitsmaterial/${filename}`;
}

export function getTeamleiterLeitfadenPdfUrl(moduleId: string): string | null {
  const normalizedId = moduleId.toUpperCase();
  const filename = `${normalizedId}.pdf`;
  const absolutePath = path.join(
    process.cwd(), "protected-downloads", "teamleiter-leitfaden", filename,
  );
  if (!fs.existsSync(absolutePath)) return null;
  return `/api/downloads/teamleiter-leitfaden/${filename}`;
}

export function getBeobachtungsbogenPdfUrl(moduleId: string): string | null {
  const normalizedId = moduleId.toUpperCase();
  const filename = `${normalizedId}.pdf`;
  const absolutePath = path.join(BEOBACHTUNGSBOGEN_DIR, filename);
  if (!fs.existsSync(absolutePath)) return null;
  return `/api/downloads/beobachtungsbogen/${filename}`;
}

export function getPresentationPptxUrl(moduleId: string): string | null {
  const normalizedId = moduleId.toUpperCase();
  const filename = `${normalizedId}.pptx`;
  const absolutePath = path.join(
    process.cwd(),
    "protected-downloads",
    "praesentation",
    filename
  );
  if (!fs.existsSync(absolutePath)) return null;
  return `/api/downloads/praesentation/${filename}`;
}

export function getTrainerHandbuchPdfUrl(moduleId: string): string | null {
  const normalizedId = moduleId.toUpperCase();
  const filename = `${normalizedId}.pdf`;
  const absolutePath = path.join(TRAINER_HANDBOOKS_DIR, filename);

  if (!fs.existsSync(absolutePath)) {
    return null;
  }

  return `/api/downloads/trainerhandbuch/${filename}`;
}

function normalizeStatus(value: unknown): Module["status"] {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  if (normalized === "freigegeben" || normalized === "kern") {
    return "freigegeben";
  }

  if (normalized === "coming-soon" || normalized === "coming soon" || normalized === "demnaechst") {
    return "coming-soon";
  }

  return "draft";
}

function normalizeStufe(value: unknown): Module["stufe"] {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  // Berater-Track
  if (normalized === "berater") {
    return "Berater";
  }
  if (
    normalized === "sparringspartner" ||
    normalized === "sparing" ||
    normalized === "sparring"
  ) {
    return "Sparringspartner";
  }

  // Vertriebsassistenz-Track
  if (normalized === "sachbearbeitung") {
    return "Sachbearbeitung";
  }
  if (normalized === "eigenständige assistenz" || normalized === "eigenstaendige assistenz") {
    return "Eigenständige Assistenz";
  }
  if (normalized === "co-pilot" || normalized === "co-pilotin" || normalized === "copilot") {
    return "Co-Pilot";
  }

  return "Strategischer Partner";
}

function normalizeZielrolle(value: unknown, stufe: Module["stufe"]): Zielrolle {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "assistenz" || normalized === "berater") {
    return normalized;
  }
  // Kein explizites Feld: aus der (bereits normalisierten) Stufe ableiten.
  return STUFE_TO_TRACK[stufe];
}

function normalizeKompetenzfeldSlug(data: Record<string, unknown>) {
  const directSlug = String(data.kompetenzfeld_slug ?? "").trim();
  if (directSlug) {
    return directSlug;
  }

  return String(data.kompetenzfeld ?? "")
    .toLowerCase()
    .replace(/^k-\d+\s+/, "")
    .replace(/&/g, "und")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "unzugeordnet";
}

function normalizeKompetenzfeld(data: Record<string, unknown>) {
  return String(data.kompetenzfeld ?? "").trim() || "Unzugeordnet";
}

function normalizeList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function normalizeLernziele(
  value: unknown,
  fallbackLevel: Module["lernziele"][number]["bloom_stufe"],
): Module["lernziele"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    if (typeof item === "string") {
      return {
        text: item,
        bloom_stufe: fallbackLevel,
      };
    }

    const ziel = item as { text?: unknown; bloom_stufe?: unknown };
    const bloomLevel = Number(ziel.bloom_stufe);

    return {
      text: String(ziel.text ?? ""),
      bloom_stufe: ([1, 2, 3, 4, 5, 6].includes(bloomLevel) ? bloomLevel : fallbackLevel) as
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6,
    };
  });
}

function getHighestBloomLevel(value: unknown): Module["lernziele"][number]["bloom_stufe"] {
  const matches = String(value ?? "").match(/[1-6]/g);
  const highest = matches ? Math.max(...matches.map(Number)) : 3;

  return highest as Module["lernziele"][number]["bloom_stufe"];
}

function extractMarkedSection(content: string, key: string): { main: string; section: string } {
  const start = `<!-- CONTENT_${key}_START -->`;
  const end = `<!-- CONTENT_${key}_END -->`;
  const startIdx = content.indexOf(start);
  const endIdx = content.indexOf(end);

  if (startIdx === -1 || endIdx === -1) {
    return { main: content, section: "" };
  }

  const section = content.slice(startIdx + start.length, endIdx).trim();
  const main = (content.slice(0, startIdx) + content.slice(endIdx + end.length)).trim();
  return { main, section };
}

function normalizeAblauf(value: unknown): AblaufPhase[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is Record<string, unknown> => typeof v === "object" && v !== null)
    .map((v) => ({
      zeit: String(v.zeit ?? ""),
      phase: String(v.phase ?? ""),
      methode: String(v.methode ?? ""),
      ...(v.dauer ? { dauer: String(v.dauer) } : {}),
    }))
    .filter((p) => p.phase || p.zeit);
}

function parseModule(filename: string): Module {
  const filePath = path.join(MODULES_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content: rawContent } = matter(raw);
  const normalizedData = data as Record<string, unknown>;
  const fallbackBloomLevel = getHighestBloomLevel(data.bloom);
  const stufe = normalizeStufe(data.stufe);

  // Trainer- und Theorie-Blöcke aus dem Markdown-Body extrahieren
  const { main: afterTrainer, section: content_trainer } = extractMarkedSection(rawContent, "TRAINER");
  const { main: content, section: content_theorie } = extractMarkedSection(afterTrainer, "THEORIE");

  return {
    ...(data as Omit<Module, "content" | "slug">),
    id: String(data.id),
    title: String(data.title ?? data.id),
    subtitle: String(data.subtitle ?? ""),
    kurzbeschreibung: String(data.kurzbeschreibung ?? ""),
    hero_grafik: String(data.hero_grafik ?? ""),
    praxisfall_vignette: String(data.praxisfall_vignette ?? ""),
    workbook_inhalt: normalizeList(data.workbook_inhalt),
    ablauf: normalizeAblauf(data.ablauf),
    kompetenzfeld: normalizeKompetenzfeld(normalizedData),
    kompetenzfeld_slug: normalizeKompetenzfeldSlug(normalizedData),
    stufe,
    zielrolle: normalizeZielrolle(data.zielrolle, stufe),
    bloom: String(data.bloom ?? ""),
    dauer: String(data.dauer ?? ""),
    format: String(data.format ?? ""),
    premium: Boolean(data.premium),
    status: normalizeStatus(data.status),
    version: String(data.version ?? ""),
    voraussetzungen: normalizeList(data.voraussetzungen),
    folgemodule: normalizeList(data.folgemodule),
    youtube_id: String(data.youtube_id ?? ""),
    praxis_review: Boolean(data.praxis_review),
    wiss_review: Boolean(data.wiss_review),
    sim_review: Boolean(data.sim_review),
    ergaenzung: Boolean(data.ergaenzung),
    lernziele: normalizeLernziele(data.lernziele, fallbackBloomLevel),
    slug: String(data.id),
    content,
    content_theorie,
    content_trainer,
  };
}
