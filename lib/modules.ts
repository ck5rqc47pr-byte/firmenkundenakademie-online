import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  kompetenzfeld: string;
  kompetenzfeld_slug: string;
  stufe: "Berater" | "Sparringspartner" | "Stratege";
  bloom: string;
  dauer: string;
  format: string;
  status: "freigegeben" | "draft" | "coming-soon";
  version: string;
  voraussetzungen: string[];
  folgemodule: string[];
  youtube_id: string;
  praxis_review: boolean;    // Praxis-Review durch Armin abgeschlossen
  wiss_review: boolean;      // Wissenschaftliches Review durch Prof. Brandt abgeschlossen
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
const TRAINER_HANDBOOKS_DIR = path.join(
  process.cwd(),
  "public",
  "downloads",
  "trainerhandbuch",
);
const BEOBACHTUNGSBOGEN_DIR = path.join(
  process.cwd(),
  "public",
  "downloads",
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

export function getKompetenzfelder() {
  return getAllModules().reduce<
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
  const absolutePath = path.join(PARTICIPANT_HANDOUTS_DIR, filename);

  if (!fs.existsSync(absolutePath)) {
    return null;
  }

  return `/downloads/teilnehmerunterlagen/${filename}`;
}

export function getBeobachtungsbogenPdfUrl(moduleId: string): string | null {
  const normalizedId = moduleId.toUpperCase();
  const filename = `${normalizedId}.pdf`;
  const absolutePath = path.join(BEOBACHTUNGSBOGEN_DIR, filename);
  if (!fs.existsSync(absolutePath)) return null;
  return `/downloads/beobachtungsbogen/${filename}`;
}

export function getTrainerHandbuchPdfUrl(moduleId: string): string | null {
  const normalizedId = moduleId.toUpperCase();
  const filename = `${normalizedId}.pdf`;
  const absolutePath = path.join(TRAINER_HANDBOOKS_DIR, filename);

  if (!fs.existsSync(absolutePath)) {
    return null;
  }

  return `/downloads/trainerhandbuch/${filename}`;
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

  return "Stratege";
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

function parseModule(filename: string): Module {
  const filePath = path.join(MODULES_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content: rawContent } = matter(raw);
  const normalizedData = data as Record<string, unknown>;
  const fallbackBloomLevel = getHighestBloomLevel(data.bloom);

  // Trainer- und Theorie-Blöcke aus dem Markdown-Body extrahieren
  const { main: afterTrainer, section: content_trainer } = extractMarkedSection(rawContent, "TRAINER");
  const { main: content, section: content_theorie } = extractMarkedSection(afterTrainer, "THEORIE");

  return {
    ...(data as Omit<Module, "content" | "slug">),
    id: String(data.id),
    title: String(data.title ?? data.id),
    subtitle: String(data.subtitle ?? ""),
    kompetenzfeld: normalizeKompetenzfeld(normalizedData),
    kompetenzfeld_slug: normalizeKompetenzfeldSlug(normalizedData),
    stufe: normalizeStufe(data.stufe),
    bloom: String(data.bloom ?? ""),
    dauer: String(data.dauer ?? ""),
    format: String(data.format ?? ""),
    status: normalizeStatus(data.status),
    version: String(data.version ?? ""),
    voraussetzungen: normalizeList(data.voraussetzungen),
    folgemodule: normalizeList(data.folgemodule),
    youtube_id: String(data.youtube_id ?? ""),
    praxis_review: Boolean(data.praxis_review),
    wiss_review: Boolean(data.wiss_review),
    lernziele: normalizeLernziele(data.lernziele, fallbackBloomLevel),
    slug: String(data.id),
    content,
    content_theorie,
    content_trainer,
  };
}
