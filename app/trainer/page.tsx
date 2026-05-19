import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllModules, getParticipantHandoutPdfUrl, getTrainerHandbuchPdfUrl, getPresentationPptxUrl } from "@/lib/modules";

export const dynamic = "force-dynamic";

const STUFE_ORDER = { Berater: 1, Sparringspartner: 2, Stratege: 3 } as const;

const FIELD_LABELS: Record<string, string> = {
  finanzanalyse: "Finanzanalyse",
  branchenwissen: "Branchenwissen",
  gespraechsfuehrung: "Gesprächsführung",
  vertrieb: "Vertrieb",
  digital: "Digital",
  fuehrung: "Führung",
};

const FIELD_ORDER = [
  "finanzanalyse",
  "branchenwissen",
  "gespraechsfuehrung",
  "vertrieb",
  "digital",
  "fuehrung",
];

export default async function TrainerPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? "";

  if (!session || (role !== "trainer" && role !== "admin")) {
    redirect("/login?callbackUrl=/trainer");
  }

  const allModules = getAllModules();

  // Statistiken
  const total = allModules.length;
  const withTrainer = allModules.filter((m) => m.content_trainer?.trim()).length;
  const withoutTrainer = total - withTrainer;
  const withPdf  = allModules.filter((m) => getParticipantHandoutPdfUrl(m.id)).length;
  const withThb  = allModules.filter((m) => getTrainerHandbuchPdfUrl(m.id)).length;
  const withPptx = allModules.filter((m) => getPresentationPptxUrl(m.id)).length;

  // Gruppierung nach Kompetenzfeld
  const grouped = FIELD_ORDER.reduce<Record<string, typeof allModules>>(
    (acc, slug) => {
      const modules = allModules
        .filter((m) => m.kompetenzfeld_slug === slug)
        .sort((a, b) => STUFE_ORDER[a.stufe] - STUFE_ORDER[b.stufe]);
      if (modules.length > 0) acc[slug] = modules;
      return acc;
    },
    {},
  );

  return (
    <div>
      {/* Page Header */}
      <section className="border-b border-ink bg-primary">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-3">
            {role === "admin" ? "Admin" : "Trainer"} · Geschützter Bereich
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-normal leading-tight tracking-[-0.03em] text-white">
            Trainer-Dashboard
          </h1>
          <p className="mt-4 text-sm text-white/70 max-w-lg leading-relaxed">
            Übersicht aller Module mit Verfügbarkeit von Trainerhandbuch, Evaluation und
            Workbook.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-ink bg-bg-2">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-8 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {(
            [
              [String(total), "Module gesamt"],
              [String(withTrainer), "Trainerhandbuch bereit"],
              [String(withPdf), "TN-Unterlagen (PDF)"],
              [String(withPptx), "Präsentationen (PPTX)"],
            ] as [string, string][]
          ).map(([val, label]) => (
            <div key={label}>
              <div className="font-serif text-3xl font-normal leading-none tracking-[-0.02em] text-primary">
                {val}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3 mt-1.5">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Module je Kompetenzfeld */}
      <div className="mx-auto max-w-content px-6 lg:px-14 py-16 space-y-20">
        {Object.entries(grouped).map(([slug, modules]) => {
          const doneCount = modules.filter((m) => m.content_trainer?.trim()).length;

          return (
            <section key={slug}>
              {/* Feld-Header */}
              <div className="flex items-end justify-between border-b border-ink pb-4 mb-8">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-1">
                    Kompetenzfeld
                  </div>
                  <h2 className="font-serif text-2xl font-normal tracking-[-0.02em] text-ink">
                    {FIELD_LABELS[slug] ?? slug}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">
                    Trainerhandbuch
                  </div>
                  <div className="font-mono text-sm text-ink mt-0.5">
                    {doneCount}/{modules.length}
                  </div>
                </div>
              </div>

              {/* Modul-Tabelle */}
              <div className="border border-ink overflow-hidden">
                {/* Tabellenkopf */}
                <div className="grid grid-cols-[80px_1fr_120px_100px_80px_80px_90px_80px] bg-primary text-white">
                  {["Modul", "Titel", "Stufe", "Handbuch", "THB", "TNU", "PPTX", ""].map((h) => (
                    <div
                      key={h}
                      className="font-mono text-[10px] uppercase tracking-[0.08em] px-4 py-3"
                    >
                      {h}
                    </div>
                  ))}
                </div>

                {/* Zeilen */}
                {modules.map((m, i) => {
                  const hasTrainer = Boolean(m.content_trainer?.trim());
                  const pdfUrl  = getParticipantHandoutPdfUrl(m.id);
                  const thbUrl  = getTrainerHandbuchPdfUrl(m.id);
                  const pptxUrl = getPresentationPptxUrl(m.id);
                  const even = i % 2 === 0;

                  return (
                    <div
                      key={m.id}
                      className={`grid grid-cols-[80px_1fr_120px_100px_80px_80px_90px_80px] border-t border-line items-center ${even ? "bg-white" : "bg-bg-2"}`}
                    >
                      {/* ID */}
                      <div className="px-4 py-3.5">
                        <span className="font-mono text-[11px] font-semibold text-primary">
                          {m.id}
                        </span>
                      </div>

                      {/* Titel */}
                      <div className="px-4 py-3.5">
                        <div className="text-sm font-medium text-ink leading-snug">{m.title}</div>
                        <div className="font-mono text-[10px] text-ink-3 mt-0.5">{m.version}</div>
                      </div>

                      {/* Stufe */}
                      <div className="px-4 py-3.5">
                        <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-2">
                          {m.stufe}
                        </span>
                      </div>

                      {/* Handbuch-Status */}
                      <div className="px-4 py-3.5">
                        {hasTrainer ? (
                          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            Bereit
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-ink-3 inline-block" />
                            Ausstehend
                          </span>
                        )}
                      </div>

                      {/* THB – Trainerhandbuch PDF */}
                      <div className="px-4 py-3.5">
                        {thbUrl ? (
                          <a
                            href={thbUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-[10px] uppercase tracking-[0.06em] text-primary hover:underline"
                          >
                            PDF ↓
                          </a>
                        ) : (
                          <span className="font-mono text-[10px] text-ink-3">–</span>
                        )}
                      </div>

                      {/* Workbook PDF */}
                      <div className="px-4 py-3.5">
                        {pdfUrl ? (
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-[10px] uppercase tracking-[0.06em] text-primary hover:underline"
                          >
                            PDF ↓
                          </a>
                        ) : (
                          <span className="font-mono text-[10px] text-ink-3">–</span>
                        )}
                      </div>

                      {/* PPTX */}
                      <div className="px-4 py-3.5">
                        {pptxUrl ? (
                          <a
                            href={pptxUrl}
                            download
                            className="font-mono text-[10px] uppercase tracking-[0.06em] text-accent hover:underline"
                          >
                            PPTX ↓
                          </a>
                        ) : (
                          <span className="font-mono text-[10px] text-ink-3">–</span>
                        )}
                      </div>

                      {/* Link */}
                      <div className="px-4 py-3.5">
                        <Link
                          href={`/module/${m.id}`}
                          className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-2 hover:text-primary transition"
                        >
                          Öffnen →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Trainer-Hinweis */}
      <section className="border-t border-ink bg-bg-2">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-3">
            Hinweis
          </div>
          <p className="text-sm text-ink-2 leading-relaxed max-w-2xl">
            Trainerhandbuch (Sec 3) und Evaluation (Sec 6) sind auf den Modulseiten sichtbar,
            sobald Sie als Trainer oder Admin angemeldet sind. Teilnehmer sehen nur die
            Lernmaterialien (Sec 4, 5, 7) und die wissenschaftliche Einordnung (Sec 2).
          </p>
          <div className="mt-6 flex gap-4">
            <Link
              href="/module"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] border border-ink text-ink px-5 py-2.5 hover:bg-bg transition"
            >
              Alle Module
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
