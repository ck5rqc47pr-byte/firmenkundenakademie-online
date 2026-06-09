import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Agent = {
  id: string;
  name: string;
  rolle: string;
  beschreibung: string;
  zustaendig: string[];
  nicht_fuer: string;
  model: "haiku" | "sonnet" | "opus";
  farbe: string;
  textfarbe: string;
  initial: string;
  datei: string;
};

const AGENTS: Agent[] = [
  {
    id: "roland",
    name: "Roland",
    rolle: "Content Creator",
    beschreibung:
      "Bankfachtrainer mit 15+ Jahren Erfahrung im Firmenkundengeschäft. Erstellt Trainerhandbücher, Teilnehmerunterlagen und Praxisfälle auf wissenschaftlichem Niveau. Vertraut mit MaRisk, KWG, CRR/CRD und Atruvia-Prozessen.",
    zustaendig: ["Modulerstellung", "Trainerhandbücher", "Praxisfälle", "Lernzielformulierung", "Fallstudien"],
    nicht_fuer: "Literaturrecherche → Dr. Schreiber · Qualitätsprüfung → Prof. Dr. Brandt · Formatierung → Praktikant 1",
    model: "haiku",
    farbe: "#D9C089",
    textfarbe: "#15192B",
    initial: "R",
    datei: "content-creator.md",
  },
  {
    id: "prof-brandt",
    name: "Prof. Dr. Brandt",
    rolle: "Wissenschaftlicher Reviewer",
    beschreibung:
      "Senior-Prüfer mit Doppelexpertise in Bankwirtschaft und Hochschuldidaktik. Prüft Inhalte auf fachliche Korrektheit, wissenschaftliche Standards, Bloom-Konformität und Dreyfus-Einordnung.",
    zustaendig: ["Fachliche Korrektheit", "Wissenschaftliche Standards", "Quellenprüfung", "Bloom-Taxonomie", "Dreyfus-Einordnung"],
    nicht_fuer: "Content-Erstellung → Roland · Praxisreview → Armin · Formatierung → Praktikant 1",
    model: "haiku",
    farbe: "#3D5494",
    textfarbe: "#F8F8FA",
    initial: "B",
    datei: "quality-reviewer.md",
  },
  {
    id: "armin",
    name: "Armin",
    rolle: "Praxis-Reviewer",
    beschreibung:
      "FK-Berater mit 25 Jahren Erfahrung bei einer VR-Bank in Süddeutschland. Prüft Alltagstauglichkeit, Verständlichkeit und Realismus der Praxisfälle aus Beratersicht.",
    zustaendig: ["Alltagstauglichkeit", "Verständlichkeit", "Praxisrelevanz", "Vollständigkeit aus Praxissicht"],
    nicht_fuer: "Wissenschaftliche Standards, Quellenarbeit, Bloom/Dreyfus → Prof. Dr. Brandt",
    model: "haiku",
    farbe: "#EDEDF3",
    textfarbe: "#15192B",
    initial: "A",
    datei: "praxis-reviewer.md",
  },
  {
    id: "dr-schreiber",
    name: "Dr. Schreiber",
    rolle: "Scientific Writer",
    beschreibung:
      "Wissenschaftlicher Autor mit Expertise in Bankbetriebslehre, Kompetenzforschung und Erwachsenenbildung. Erstellt Rahmenkonzepte, Literaturreviews und theoretische Einordnungen auf Hochschulniveau.",
    zustaendig: ["Rahmenkonzept", "Literaturrecherche", "Theoretische Einordnung", "Primärquellenextraktion"],
    nicht_fuer: "Praxisfälle, Trainerhandbücher → Roland · Formatierung → Praktikant 1",
    model: "haiku",
    farbe: "#1F2C56",
    textfarbe: "#F8F8FA",
    initial: "S",
    datei: "scientific-writer.md",
  },
  {
    id: "felix",
    name: "Felix",
    rolle: "Visual Communicator",
    beschreibung:
      "Informationsdesigner des FKB Campus. Erstellt modulspezifische SVG-Schaubilder und Standard-Grafiken (Dreyfus, Bloom, Kirkpatrick, Lernpfad) konsequent im FKB-Campus-CI — valides XML, kein border-radius, no shadows.",
    zustaendig: ["SVG-Schaubilder", "Standard-Grafiken", "T-Konten", "Prozessdiagramme", "Kennzahlen-Karten", "Strategiematrizen"],
    nicht_fuer: "Modulinhalte → Roland · DOCX/PPTX → Praktikant 1 · Wissenschaftliche Texte → Dr. Schreiber",
    model: "sonnet",
    farbe: "#D9C089",
    textfarbe: "#15192B",
    initial: "F",
    datei: "grafik-ersteller.md",
  },
  {
    id: "praktikant-1",
    name: "Praktikant 1",
    rolle: "Formatter & Dokumentenerstellung",
    beschreibung:
      "Wandelt geprüfte und freigegebene Inhalte in finale Dokumente um: DOCX-Handbücher, PPTX-Präsentationen, XLSX-Arbeitsmaterialien. Immer im VR-Banken Corporate Design mit Arial, CI-Blau und CI-Orange.",
    zustaendig: ["DOCX-Handbücher", "PPTX-Präsentationen", "XLSX-Arbeitsmaterialien", "VR-CI Formatierung"],
    nicht_fuer: "Inhaltserstellung oder -prüfung → Roland / Prof. Dr. Brandt",
    model: "haiku",
    farbe: "#8898C4",
    textfarbe: "#F8F8FA",
    initial: "P",
    datei: "formatter.md",
  },
];

const MODEL_BADGE: Record<string, string> = {
  haiku:  "bg-ink/8 text-ink-3",
  sonnet: "bg-accent/20 text-ink-2",
  opus:   "bg-primary/10 text-primary",
};

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? "";
  if (!session || role !== "admin") redirect("/login?callbackUrl=/admin/team");

  return (
    <div className="min-h-screen bg-bg-2">
      {/* Header */}
      <div className="bg-primary border-b border-ink">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 mb-1">
              Admin-Konsole
            </div>
            <h1 className="font-serif text-2xl font-normal text-white tracking-[-0.02em]">
              Team & Agenten
            </h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin" className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors">
              ← Modulübersicht
            </Link>
            <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors">
              Akademie →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-line p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2">Agenten gesamt</div>
            <div className="font-serif text-3xl text-ink">{AGENTS.length}</div>
          </div>
          <div className="bg-white border border-line p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2">Sonnet</div>
            <div className="font-serif text-3xl text-ink">{AGENTS.filter((a) => a.model === "sonnet").length}</div>
          </div>
          <div className="bg-white border border-line p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2">Haiku</div>
            <div className="font-serif text-3xl text-ink-3">{AGENTS.filter((a) => a.model === "haiku").length}</div>
          </div>
        </div>

        {/* Intro */}
        <div className="bg-white border border-line px-5 py-4">
          <p className="font-serif text-sm text-ink-2 leading-relaxed">
            Das FKB-Campus-Team besteht aus spezialisierten KI-Agenten, die arbeitsteilig an der Erstellung, Prüfung
            und Aufbereitung der Akademieinhalte mitwirken. Jeder Agent hat eine klar abgegrenzte Zuständigkeit
            und eigene Qualitätsstandards — definiert in <code className="font-mono text-[11px] bg-bg-2 px-1">.claude/agents/</code>.
          </p>
        </div>

        {/* Agent-Karten */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AGENTS.map((agent) => (
            <div key={agent.id} className="bg-white border border-line flex flex-col">
              {/* Farbbalken oben */}
              <div className="h-1" style={{ backgroundColor: agent.farbe }} />

              <div className="p-5 flex flex-col gap-4 flex-1">
                {/* Avatar + Name */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: agent.farbe }}
                  >
                    <span
                      className="font-serif text-lg font-normal"
                      style={{ color: agent.textfarbe }}
                    >
                      {agent.initial}
                    </span>
                  </div>
                  <div>
                    <div className="font-serif text-lg font-normal text-ink leading-tight">{agent.name}</div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-3 mt-0.5">
                      {agent.rolle}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <span className={`font-mono text-[8px] uppercase tracking-[0.06em] px-2 py-0.5 ${MODEL_BADGE[agent.model]}`}>
                      {agent.model}
                    </span>
                  </div>
                </div>

                {/* Beschreibung */}
                <p className="font-serif text-[13px] text-ink-2 leading-snug">{agent.beschreibung}</p>

                {/* Zuständig für */}
                <div>
                  <div className="font-mono text-[8px] uppercase tracking-[0.08em] text-ink-3 mb-1.5">Zuständig für</div>
                  <div className="flex flex-wrap gap-1">
                    {agent.zustaendig.map((z) => (
                      <span key={z} className="font-mono text-[8px] uppercase tracking-[0.04em] px-1.5 py-0.5 bg-bg-2 text-ink-3 border border-line">
                        {z}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nicht für */}
                <div className="mt-auto pt-3 border-t border-line">
                  <div className="font-mono text-[8px] uppercase tracking-[0.08em] text-ink-3 mb-1">Nicht einsetzen für</div>
                  <p className="font-mono text-[9px] text-ink-3 leading-snug">{agent.nicht_fuer}</p>
                </div>
              </div>

              {/* Footer: Dateiname */}
              <div className="px-5 py-2 border-t border-line bg-bg-2">
                <code className="font-mono text-[9px] text-ink-3">.claude/agents/{agent.datei}</code>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow-Übersicht */}
        <section className="bg-white border border-line p-5">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 font-semibold mb-4">
            Standard-Workflow · Neue Module
          </h2>
          <div className="flex flex-wrap gap-2 items-center">
            {[
              { name: "Dr. Schreiber", sub: "Literatur & Theorie" },
              { sep: "→" },
              { name: "Roland", sub: "Modulinhalte" },
              { sep: "→" },
              { name: "Prof. Dr. Brandt", sub: "Wiss. Review" },
              { sep: "→" },
              { name: "Armin", sub: "Praxis-Review" },
              { sep: "→" },
              { name: "Roland", sub: "Überarbeitung" },
              { sep: "→" },
              { name: "Felix", sub: "Schaubilder" },
              { sep: "→" },
              { name: "Praktikant 1", sub: "Finale Dokumente" },
            ].map((item, i) =>
              "sep" in item ? (
                <span key={i} className="font-mono text-[10px] text-ink-3">{item.sep}</span>
              ) : (
                <div key={i} className="bg-bg-2 border border-line px-3 py-1.5 text-center">
                  <div className="font-mono text-[9px] text-ink-2 font-semibold">{item.name}</div>
                  <div className="font-mono text-[8px] text-ink-3">{item.sub}</div>
                </div>
              )
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
