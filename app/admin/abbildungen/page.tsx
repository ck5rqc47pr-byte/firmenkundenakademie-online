import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ABBILDUNGEN = [
  {
    id: "dreyfus-treppe",
    titel: "Dreyfus-Kompetenztreppe",
    beschreibung: "Drei Kompetenzstufen des FKB Campus nach Dreyfus & Dreyfus (1980): Berater (Stufe 2), Sparringspartner (Stufe 3), Stratege (Stufe 4).",
    datei: "/grafiken/dreyfus-treppe.svg",
    quelle: "Dreyfus & Dreyfus (1980)",
    verwendung: ["Modulsteckbrief", "Kompetenzmodell", "Startseite"],
    status: "fertig",
  },
  {
    id: "bloom-pyramide",
    titel: "Bloom-Taxonomie-Pyramide",
    beschreibung: "Revidierte Bloom-Taxonomie nach Anderson & Krathwohl (2001): 6 kognitive Stufen von Erinnern bis Erschaffen.",
    datei: "/grafiken/bloom-pyramide.svg",
    quelle: "Anderson & Krathwohl (2001)",
    verwendung: ["Lernziele", "Modulsteckbrief"],
    status: "fertig",
  },
  {
    id: "kirkpatrick",
    titel: "Kirkpatrick-Evaluationsmodell",
    beschreibung: "Vier Evaluationsebenen nach Kirkpatrick (1994): Reaktion, Lernen, Verhalten, Ergebnis — von einfach messbar bis höchster Wirkungstiefe.",
    datei: "/grafiken/kirkpatrick-modell.svg",
    quelle: "Kirkpatrick (1994)",
    verwendung: ["Evaluation", "Feedbackbogen", "Admin-Konsole"],
    status: "fertig",
  },
  {
    id: "lernpfad",
    titel: "Lernpfad-Übersicht",
    beschreibung: "Die drei Etappen des FKB Campus als Entwicklungspfad — Beraterhandwerk, Sparringspartner, Strategischer Partner.",
    datei: null,
    quelle: "FKB Campus",
    verwendung: ["Startseite", "Kompass"],
    status: "geplant",
  },
  {
    id: "prozess-modul",
    titel: "Modulspezifische Prozessgrafiken",
    beschreibung: "Je ein modulspezifisches Schaubild pro Modul (z. B. Bilanzstruktur für M01, Bewertungsverfahren für M22).",
    datei: null,
    quelle: "Je Modul individuell",
    verwendung: ["Teilnehmerunterlagen", "PPTX"],
    status: "geplant",
  },
];

const STATUS_STYLE: Record<string, string> = {
  fertig:   "bg-emerald-50 text-emerald-700",
  geplant:  "bg-bg-2 text-ink-3",
  entwurf:  "bg-amber-50 text-amber-700",
};

export default async function AbbildungenPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? "";

  if (!session || role !== "admin") {
    redirect("/login?callbackUrl=/admin/abbildungen");
  }

  const fertig  = ABBILDUNGEN.filter((a) => a.status === "fertig").length;
  const gesamt  = ABBILDUNGEN.length;

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
            <Link href="/admin/users" className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors">
              Nutzer →
            </Link>
            <Link href="/admin/feedback" className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors">
              Feedback →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">

        {/* Status-Bar */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white border border-line p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2">Abbildungen gesamt</div>
            <div className="font-serif text-3xl text-ink">{gesamt}</div>
          </div>
          <div className="bg-white border border-line p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2">Fertig</div>
            <div className="font-serif text-3xl text-emerald-600">{fertig}</div>
          </div>
          <div className="bg-white border border-line p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2">Geplant</div>
            <div className="font-serif text-3xl text-ink-3">{gesamt - fertig}</div>
          </div>
        </div>

        {/* Abbildungs-Liste */}
        <div className="space-y-6">
          {ABBILDUNGEN.map((a) => (
            <div key={a.id} className="bg-white border border-line">
              {/* Meta-Kopf */}
              <div className="px-4 sm:px-6 py-4 border-b border-line flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">{a.id}</span>
                    <span className={`font-mono text-[9px] uppercase tracking-[0.06em] px-2 py-0.5 ${STATUS_STYLE[a.status]}`}>
                      {a.status}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl font-normal text-ink">{a.titel}</h2>
                  <p className="font-serif text-[14px] text-ink-2 mt-1 leading-snug">{a.beschreibung}</p>
                </div>
                <div className="sm:shrink-0 sm:text-right">
                  <div className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-3 mb-1">Quelle</div>
                  <div className="font-mono text-[11px] text-ink-2">{a.quelle}</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-3 mt-3 mb-1">Verwendet in</div>
                  <div className="flex gap-1 sm:justify-end flex-wrap">
                    {a.verwendung.map((v) => (
                      <span key={v} className="font-mono text-[9px] uppercase tracking-[0.04em] px-2 py-0.5 bg-bg-2 text-ink-3 border border-line">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vorschau */}
              {a.datei ? (
                <div className="p-4 sm:p-6 bg-bg-2">
                  <img
                    src={a.datei}
                    alt={a.titel}
                    className="w-full max-w-3xl mx-auto block"
                    style={{ height: "auto" }}
                  />
                  <div className="mt-3 flex justify-center">
                    <a
                      href={a.datei}
                      download
                      className="font-mono text-[10px] uppercase tracking-[0.08em] text-primary hover:underline"
                    >
                      SVG herunterladen →
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-6 bg-bg-2 flex items-center justify-center" style={{ minHeight: 100 }}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                    Noch nicht erstellt
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
