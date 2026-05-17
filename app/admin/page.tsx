import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllModules, getParticipantHandoutPdfUrl } from "@/lib/modules";

export const dynamic = "force-dynamic";

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

const STUFE_BADGE: Record<string, string> = {
  Berater: "bg-blue-50 text-blue-700",
  Sparringspartner: "bg-violet-50 text-violet-700",
  Stratege: "bg-amber-50 text-amber-700",
};

function Check({ ok, label }: { ok: boolean; label?: string }) {
  return ok ? (
    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.05em] text-emerald-700">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
      {label ?? "Ja"}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.05em] text-ink-3">
      <span className="w-1.5 h-1.5 rounded-full bg-ink-3 inline-block" />
      {label ?? "–"}
    </span>
  );
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? "";

  if (!session || role !== "admin") {
    redirect("/login?callbackUrl=/admin");
  }

  const allModules = getAllModules();
  const total = allModules.length;

  // Statistiken
  const vollstaendig = allModules.filter(
    (m) => m.content_trainer?.trim() && m.content_theorie?.trim()
  ).length;
  const kernFertig = allModules.filter((m) => m.content?.trim()).length;
  const praxisDone = allModules.filter((m) => m.praxis_review).length;
  const wissDone = allModules.filter((m) => m.wiss_review).length;
  const mitPdf = allModules.filter((m) => getParticipantHandoutPdfUrl(m.id)).length;
  const freigegeben = allModules.filter((m) => m.status === "freigegeben").length;

  // Gruppierung nach Kompetenzfeld
  const grouped = FIELD_ORDER.reduce<Record<string, typeof allModules>>(
    (acc, slug) => {
      const modules = allModules.filter((m) => m.kompetenzfeld_slug === slug);
      if (modules.length > 0) acc[slug] = modules;
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-bg-2">
      {/* Header */}
      <div className="bg-primary border-b border-ink">
        <div className="max-w-[1400px] mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 mb-1">
              Admin-Konsole
            </div>
            <h1 className="font-serif text-2xl font-normal text-white tracking-[-0.02em]">
              Modulübersicht
            </h1>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/users"
              className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors"
            >
              Nutzer →
            </Link>
            <Link
              href="/admin/feedback"
              className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors"
            >
              Feedback →
            </Link>
            <Link
              href="/trainer"
              className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors"
            >
              Trainer-Ansicht →
            </Link>
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors"
            >
              Akademie →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-10">
        {/* KPI-Kacheln */}
        <div className="grid grid-cols-6 gap-4 mb-10">
          {[
            { label: "Module gesamt", value: total, sub: "21 geplant" },
            { label: "Vollständig", value: vollstaendig, sub: "Sec 1–7", highlight: vollstaendig === total },
            { label: "KERN fertig", value: kernFertig, sub: "Sec 1,4,5,7" },
            { label: "Praxis-Review", value: praxisDone, sub: `von ${total}` },
            { label: "Wiss.-Review", value: wissDone, sub: `von ${total}` },
            { label: "PDF bereit", value: mitPdf, sub: "Workbook" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className={`bg-white border border-line rounded p-4 ${kpi.highlight ? "border-emerald-300" : ""}`}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2">
                {kpi.label}
              </div>
              <div className={`font-serif text-3xl font-normal ${kpi.highlight ? "text-emerald-600" : "text-ink"}`}>
                {kpi.value}
              </div>
              <div className="font-mono text-[10px] text-ink-3 mt-1">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Fortschrittsbalken */}
        <div className="bg-white border border-line rounded p-5 mb-10">
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: "Vollständigkeit", done: vollstaendig, total },
              { label: "Praxis-Review", done: praxisDone, total },
              { label: "Wiss.-Review", done: wissDone, total },
              { label: "PDF", done: mitPdf, total },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-2">
                    {bar.label}
                  </span>
                  <span className="font-mono text-[10px] text-ink-3">
                    {bar.done}/{bar.total}
                  </span>
                </div>
                <div className="h-1.5 bg-line rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(bar.done / bar.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabelle nach Kompetenzfeld */}
        {Object.entries(grouped).map(([slug, modules]) => (
          <section key={slug} className="mb-10">
            {/* Feldkopf */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 font-semibold">
                {FIELD_LABELS[slug] ?? slug}
              </h2>
              <span className="font-mono text-[10px] text-ink-3">
                {modules.filter((m) => m.content_trainer?.trim()).length}/{modules.length} vollständig
              </span>
            </div>

            {/* Tabelle */}
            <div className="bg-white border border-line rounded overflow-hidden">
              {/* Kopfzeile */}
              <div className="grid grid-cols-[60px_200px_100px_80px_80px_80px_80px_60px_60px] bg-primary text-white text-[10px] font-mono uppercase tracking-[0.08em]">
                {["ID", "Titel", "Version", "Stufe", "KERN", "Vollst.", "P-Review", "W-Review", "PDF"].map(
                  (h) => (
                    <div key={h} className="px-3 py-2.5">
                      {h}
                    </div>
                  )
                )}
              </div>

              {/* Zeilen */}
              {modules.map((m, i) => {
                const hasKern = Boolean(m.content?.trim());
                const hasErgaenzung = Boolean(m.content_trainer?.trim() && m.content_theorie?.trim());
                const vollstaendig = hasKern && hasErgaenzung;
                const pdfUrl = getParticipantHandoutPdfUrl(m.id);
                const even = i % 2 === 0;

                return (
                  <div
                    key={m.id}
                    className={`grid grid-cols-[60px_200px_100px_80px_80px_80px_80px_60px_60px] border-t border-line items-center text-sm ${even ? "bg-white" : "bg-bg-2"}`}
                  >
                    {/* ID */}
                    <div className="px-3 py-3">
                      <Link
                        href={`/module/${m.id}`}
                        className="font-mono text-[11px] font-semibold text-primary hover:underline"
                      >
                        {m.id}
                      </Link>
                    </div>

                    {/* Titel */}
                    <div className="px-3 py-3">
                      <div className="text-[12px] font-medium text-ink leading-snug line-clamp-2">
                        {m.title}
                      </div>
                    </div>

                    {/* Version */}
                    <div className="px-3 py-3">
                      <span className="font-mono text-[10px] text-ink-2">{m.version}</span>
                    </div>

                    {/* Stufe */}
                    <div className="px-3 py-3">
                      <span
                        className={`font-mono text-[9px] uppercase tracking-[0.05em] px-1.5 py-0.5 rounded ${STUFE_BADGE[m.stufe] ?? ""}`}
                      >
                        {m.stufe === "Sparringspartner" ? "Sparring" : m.stufe}
                      </span>
                    </div>

                    {/* KERN */}
                    <div className="px-3 py-3">
                      <Check ok={hasKern} label={hasKern ? "Bereit" : "–"} />
                    </div>

                    {/* Vollständig (KERN + ERGÄNZUNG) */}
                    <div className="px-3 py-3">
                      <Check ok={vollstaendig} label={vollstaendig ? "Ja" : hasKern ? "KERN" : "–"} />
                    </div>

                    {/* Praxis-Review */}
                    <div className="px-3 py-3">
                      <Check ok={m.praxis_review} />
                    </div>

                    {/* Wiss.-Review */}
                    <div className="px-3 py-3">
                      <Check ok={m.wiss_review} />
                    </div>

                    {/* PDF */}
                    <div className="px-3 py-3">
                      {pdfUrl ? (
                        <a
                          href={pdfUrl}
                          className="font-mono text-[10px] text-primary hover:underline"
                          target="_blank"
                        >
                          PDF
                        </a>
                      ) : (
                        <span className="font-mono text-[10px] text-ink-3">–</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Legende */}
        <div className="bg-white border border-line rounded p-5 mt-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-3">
            Legende
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-[11px] text-ink-2">
            <div><strong className="text-ink">KERN</strong> – Sec 1, 4, 5, 7 (Modulsteckbrief, Workbook, Praxistransfer, Quellen)</div>
            <div><strong className="text-ink">Vollst.</strong> – KERN + ERGÄNZUNG: Sec 2 (Wissenschaft), Sec 3+6 (Trainer + Evaluation)</div>
            <div><strong className="text-ink">P-Review</strong> – Praxis-Review durch Armin (FK-Berater, 25 J. Erfahrung)</div>
            <div><strong className="text-ink">W-Review</strong> – Wissenschaftliches Review durch Prof. Brandt</div>
          </div>
        </div>
      </div>
    </div>
  );
}
