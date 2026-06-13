import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllModules } from "@/lib/modules";

export const dynamic = "force-dynamic";

// ── Standard-Grafiken (modulübergreifend) ───────────────────────────────────
const STANDARD_GRAFIKEN = [
  {
    id: "dreyfus-treppe",
    titel: "Dreyfus-Kompetenztreppe",
    beschreibung: "Drei Kompetenzstufen des FKB Campus nach Dreyfus & Dreyfus (1980): Berater, Sparringspartner, Strategischer Partner.",
    datei: "/grafiken/dreyfus-treppe.svg",
    quelle: "Dreyfus & Dreyfus (1980)",
    verwendung: ["Modulsteckbrief", "Startseite"],
  },
  {
    id: "bloom-pyramide",
    titel: "Bloom-Taxonomie-Pyramide",
    beschreibung: "Revidierte Bloom-Taxonomie nach Anderson & Krathwohl (2001): 6 kognitive Stufen von Erinnern bis Erschaffen.",
    datei: "/grafiken/bloom-pyramide.svg",
    quelle: "Anderson & Krathwohl (2001)",
    verwendung: ["Lernziele", "Modulsteckbrief"],
  },
  {
    id: "kirkpatrick",
    titel: "Kirkpatrick-Evaluationsmodell",
    beschreibung: "Vier Evaluationsebenen nach Kirkpatrick (1994): Reaktion, Lernen, Verhalten, Ergebnis.",
    datei: "/grafiken/kirkpatrick-modell.svg",
    quelle: "Kirkpatrick (1994)",
    verwendung: ["Evaluation", "Feedbackbogen"],
  },
  {
    id: "lernpfad",
    titel: "Lernpfad-Übersicht",
    beschreibung: "Die drei Etappen des FKB Campus: Beraterhandwerk, Sparringspartner, Strategischer Partner.",
    datei: "/grafiken/lernpfad-uebersicht.svg",
    quelle: "FKB Campus",
    verwendung: ["Startseite", "Kompass"],
  },
];

// ── Modulspezifische Grafiken ───────────────────────────────────────────────
// Für jedes Modul: Array der bereits erstellten Grafiken.
// Wird Modul für Modul befüllt (Felix, grafik-ersteller).
const GRAFIKEN_MAP: Record<string, Array<{ bezeichnung: string; datei: string }>> = {
  M01: [
    { bezeichnung: "Bilanzstruktur T-Konto",  datei: "/grafiken/M01-bilanzstruktur.svg"  },
    { bezeichnung: "Kennzahlen-Karte",         datei: "/grafiken/M01-kennzahlen.svg"      },
    { bezeichnung: "Analyseprozess 4 Schritte",datei: "/grafiken/M01-analyseprozess.svg" },
    { bezeichnung: "Handlungsempfehlung (Wenn-Dann)", datei: "/grafiken/M01-handlungsempfehlung.svg" },
  ],
  M02: [
    { bezeichnung: "Gesprächsphasen 5-Phasen-Rahmen", datei: "/grafiken/M02-gespraechsphasen.svg" },
    { bezeichnung: "Vier-Ohren-Modell", datei: "/grafiken/M02-vier-ohren.svg" },
  ],
  M03: [
    { bezeichnung: "Drei Gesprächsebenen", datei: "/grafiken/M03-finanzdialog-ebenen.svg" },
    { bezeichnung: "Werttreiberbaum", datei: "/grafiken/M03-werttreiberbaum.svg" },
  ],
  M04: [
    { bezeichnung: "Frühwarn-Ampelkarte", datei: "/grafiken/M04-fruehwarnampel.svg" },
    { bezeichnung: "Handlungsempfehlung (Wenn-Dann)", datei: "/grafiken/M04-handlungsempfehlung.svg" },
  ],
  M05: [
    { bezeichnung: "Five-Forces-Modell", datei: "/grafiken/frameworks/five-forces.svg" },
    { bezeichnung: "Branchenlebenszyklus", datei: "/grafiken/M05-branchenlebenszyklus.svg" },
    { bezeichnung: "Handlungsempfehlung (Wenn-Dann)", datei: "/grafiken/M05-handlungsempfehlung.svg" },
  ],
  M06: [
    { bezeichnung: "Zwei KMU-Definitionen", datei: "/grafiken/M06-kmu-definition.svg" },
    { bezeichnung: "Fünf-Fragen-Schema", datei: "/grafiken/M06-fuenf-fragen.svg" },
  ],
  M07: [
    { bezeichnung: "Praxiswert-Ermittlung (IDW S5)", datei: "/grafiken/M07-goodwill.svg" },
    { bezeichnung: "Handlungsempfehlung (Wenn-Dann)", datei: "/grafiken/M07-handlungsempfehlung.svg" },
  ],
  M08: [
    { bezeichnung: "Drei Immobilien-Typologien", datei: "/grafiken/M08-immobilientypologien.svg" },
    { bezeichnung: "Handlungsempfehlung (Wenn-Dann)", datei: "/grafiken/M08-handlungsempfehlung.svg" },
  ],
  M09: [
    { bezeichnung: "PESTEL-Analyse", datei: "/grafiken/frameworks/pestel.svg" },
  ],
  M10: [
    { bezeichnung: "SPIN-Fragetrichter", datei: "/grafiken/M10-spin.svg" },
  ],
  M11: [
    { bezeichnung: "Eisberg-Modell latente Bedarfe", datei: "/grafiken/M11-eisberg.svg" },
  ],
  M12: [
    { bezeichnung: "Nachfolge-Phasenmodell", datei: "/grafiken/M12-nachfolge-phasen.svg" },
    { bezeichnung: "Veränderungskurve (Kübler-Ross)", datei: "/grafiken/M12-kuebler-ross.svg" },
  ],
  M13: [
    { bezeichnung: "Verbundpartner-Matrix", datei: "/grafiken/M13-verbundpartner.svg" },
  ],
  M14: [
    { bezeichnung: "Deckungsbeitrags-Wasserfall", datei: "/grafiken/M14-deckungsbeitrag.svg" },
    { bezeichnung: "Handlungsempfehlung (Wenn-Dann)", datei: "/grafiken/M14-handlungsempfehlung.svg" },
  ],
  M15: [
    { bezeichnung: "Strategie-Landkarte", datei: "/grafiken/M15-strategie-landkarte.svg" },
  ],
  M16: [
    { bezeichnung: "Nettomargenbeitrag (NMZ)", datei: "/grafiken/M16-nmz.svg" },
  ],
  M17: [
    { bezeichnung: "agree21 Kernbereiche", datei: "/grafiken/M17-agree-kernbereiche.svg" },
  ],
  M18: [
    { bezeichnung: "Drei Trigger-Typen", datei: "/grafiken/M18-trigger-typen.svg" },
  ],
  M19: [
    { bezeichnung: "SECI-Modell Wissensspirale", datei: "/grafiken/frameworks/seci.svg" },
    { bezeichnung: "Kolb-Lernzyklus", datei: "/grafiken/frameworks/kolb-zyklus.svg" },
  ],
  M20: [
    { bezeichnung: "Netzwerk-Dimensionen", datei: "/grafiken/M20-netzwerk-dimensionen.svg" },
  ],
  M21: [
    { bezeichnung: "8-Felder-Framework", datei: "/grafiken/M21-achtfelder.svg" },
    { bezeichnung: "Zwei Denksysteme (Kahneman)", datei: "/grafiken/M21-system12.svg" },
    { bezeichnung: "Handlungsempfehlung (Wenn-Dann)", datei: "/grafiken/M21-handlungsempfehlung.svg" },
  ],
  M22: [
    { bezeichnung: "Wettbewerbsstrategie-Matrix", datei: "/grafiken/frameworks/wettbewerbsmatrix.svg" },
    { bezeichnung: "Drei Analyse-Ebenen", datei: "/grafiken/M22-drei-ebenen.svg" },
    { bezeichnung: "Handlungsempfehlung (Wenn-Dann)", datei: "/grafiken/M22-handlungsempfehlung.svg" },
  ],
  M23: [
    { bezeichnung: "Modellarchitektur (agree → Modell)", datei: "/grafiken/M23-modellarchitektur.svg" },
    { bezeichnung: "Handlungsempfehlung (Wenn-Dann)", datei: "/grafiken/M23-handlungsempfehlung.svg" },
  ],
};

const STATUS_STYLE: Record<string, string> = {
  fertig:  "bg-emerald-50 text-emerald-700",
  geplant: "bg-bg-2 text-ink-3",
};

export default async function AbbildungenPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? "";
  if (!session || role !== "admin") redirect("/login?callbackUrl=/admin/abbildungen");

  const allModules = getAllModules();

  // Statistiken
  const modulGrafikenGesamt = Object.values(GRAFIKEN_MAP).reduce((s, g) => s + g.length, 0);
  const moduleMitGrafiken   = Object.keys(GRAFIKEN_MAP).length;
  const moduleOhneGrafiken  = allModules.length - moduleMitGrafiken;

  return (
    <div className="min-h-screen bg-bg-2">
      {/* Header */}
      <div className="bg-primary border-b border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 mb-1">
              Admin-Konsole
            </div>
            <h1 className="font-serif text-2xl font-normal text-white tracking-[-0.02em]">
              Abbildungen
            </h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin" className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors">
              ← Modulübersicht
            </Link>
            <Link href="/admin/team" className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors">
              Team →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 space-y-12">

        {/* ── KPIs ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-line p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2 leading-snug">Standard-Grafiken</div>
            <div className="font-serif text-3xl text-ink">{STANDARD_GRAFIKEN.length}</div>
            <div className="font-mono text-[9px] text-ink-3 mt-1">alle fertig</div>
          </div>
          <div className="bg-white border border-line p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2 leading-snug">Modul-Grafiken</div>
            <div className="font-serif text-3xl text-ink">{modulGrafikenGesamt}</div>
            <div className="font-mono text-[9px] text-ink-3 mt-1">{moduleMitGrafiken} Module abgedeckt</div>
          </div>
          <div className="bg-white border border-line p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2 leading-snug">Module offen</div>
            <div className="font-serif text-3xl text-amber-600">{moduleOhneGrafiken}</div>
            <div className="font-mono text-[9px] text-ink-3 mt-1">von {allModules.length} Modulen</div>
          </div>
          <div className="bg-white border border-line p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2 leading-snug">Gesamt SVGs</div>
            <div className="font-serif text-3xl text-ink">{STANDARD_GRAFIKEN.length + modulGrafikenGesamt}</div>
            <div className="font-mono text-[9px] text-ink-3 mt-1">inkl. Standard</div>
          </div>
        </div>

        {/* ── Standard-Grafiken ─────────────────────────────────────────── */}
        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 font-semibold mb-4 pb-2 border-b border-line">
            Standard-Grafiken · Modulübergreifend
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STANDARD_GRAFIKEN.map((a) => (
              <div key={a.id} className="bg-white border border-line">
                <div className="px-4 py-3 border-b border-line flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-base font-normal text-ink">{a.titel}</h3>
                    <p className="font-serif text-[12px] text-ink-3 mt-0.5 leading-snug">{a.beschreibung}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className="font-mono text-[8px] uppercase tracking-[0.06em] px-2 py-0.5 bg-emerald-50 text-emerald-700">fertig</span>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {a.verwendung.map((v) => (
                        <span key={v} className="font-mono text-[8px] uppercase tracking-[0.04em] px-1.5 py-0.5 bg-bg-2 text-ink-3 border border-line">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-bg-2">
                  <img src={a.datei} alt={a.titel} className="w-full block" style={{ height: "auto" }} />
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-mono text-[9px] text-ink-3">{a.quelle}</span>
                    <a href={a.datei} download className="font-mono text-[9px] uppercase tracking-[0.06em] text-primary hover:underline">
                      SVG →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Modulspezifische Schaubilder ──────────────────────────────── */}
        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 font-semibold mb-4 pb-2 border-b border-line">
            Modulspezifische Schaubilder · Status
          </h2>

          {/* Statustabelle aller Module */}
          <div className="bg-white border border-line overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[60px_minmax(140px,1fr)_80px_1fr] min-w-[500px] bg-primary text-white font-mono text-[10px] uppercase tracking-[0.08em]">
                {["ID", "Titel", "Grafiken", "Schaubilder"].map((h) => (
                  <div key={h} className="px-3 py-2.5">{h}</div>
                ))}
              </div>
              {allModules.map((m, i) => {
                const grafiken = GRAFIKEN_MAP[m.id] ?? [];
                const even = i % 2 === 0;
                return (
                  <div
                    key={m.id}
                    className={`grid grid-cols-[60px_minmax(140px,1fr)_80px_1fr] min-w-[500px] border-t border-line items-center ${even ? "bg-white" : "bg-bg-2"}`}
                  >
                    <div className="px-3 py-2.5">
                      <Link href={`/module/${m.id}`} className="font-mono text-[11px] font-semibold text-primary hover:underline">
                        {m.id}
                      </Link>
                    </div>
                    <div className="px-3 py-2.5 text-[12px] text-ink leading-snug">{m.title}</div>
                    <div className="px-3 py-2.5">
                      {grafiken.length > 0 ? (
                        <span className="font-mono text-[10px] font-semibold text-emerald-600">{grafiken.length}</span>
                      ) : (
                        <span className="font-mono text-[10px] text-ink-3">–</span>
                      )}
                    </div>
                    <div className="px-3 py-2.5 flex flex-wrap gap-1">
                      {grafiken.length > 0 ? grafiken.map((g) => (
                        <a
                          key={g.datei}
                          href={g.datei}
                          target="_blank"
                          className="font-mono text-[8px] uppercase tracking-[0.04em] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:underline"
                        >
                          {g.bezeichnung}
                        </a>
                      )) : (
                        <span className="font-mono text-[9px] text-ink-3">Noch nicht erstellt</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailvorschauen für Module mit Grafiken */}
          <div className="space-y-8">
            {allModules
              .filter((m) => (GRAFIKEN_MAP[m.id]?.length ?? 0) > 0)
              .map((m) => {
                const grafiken = GRAFIKEN_MAP[m.id];
                return (
                  <div key={m.id} className="bg-white border border-line">
                    {/* Modul-Header */}
                    <div className="px-4 sm:px-6 py-3 border-b border-line flex items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em] bg-primary text-white px-2 py-0.5">
                        {m.id}
                      </span>
                      <h3 className="font-serif text-lg font-normal text-ink">{m.title}</h3>
                      <span className="ml-auto font-mono text-[9px] text-ink-3">{grafiken.length} Schaubilder</span>
                    </div>

                    {/* Grafik-Vorschauen */}
                    <div className={`grid gap-px bg-line ${grafiken.length === 1 ? "grid-cols-1" : grafiken.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                      {grafiken.map((g) => (
                        <div key={g.datei} className="bg-bg-2 p-4">
                          <img
                            src={g.datei}
                            alt={g.bezeichnung}
                            className="w-full block"
                            style={{ height: "auto" }}
                          />
                          <div className="mt-2 flex justify-between items-center">
                            <span className="font-mono text-[9px] text-ink-3">{g.bezeichnung}</span>
                            <a href={g.datei} download className="font-mono text-[9px] uppercase tracking-[0.06em] text-primary hover:underline">
                              SVG →
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

      </div>
    </div>
  );
}
