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

  const vollstaendig = allModules.filter((m) => m.ergaenzung).length;
  const kernFertig   = allModules.filter((m) => m.content?.trim()).length;
  const praxisDone   = allModules.filter((m) => m.praxis_review).length;
  const wissDone     = allModules.filter((m) => m.wiss_review).length;
  const simDone      = allModules.filter((m) => m.sim_review).length;
  const mitPdf       = allModules.filter((m) => getParticipantHandoutPdfUrl(m.id)).length;

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
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-primary border-b border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 mb-1">
              Admin-Konsole
            </div>
            <h1 className="font-serif text-2xl font-normal text-white tracking-[-0.02em]">
              Modulübersicht
            </h1>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            {[
              { href: "/admin/users",       label: "Nutzer",         accent: false },
              { href: "/admin/feedback",    label: "Feedback",       accent: false },
              { href: "/admin/quiz",        label: "Wissenstests",   accent: false },
              { href: "/admin/abbildungen", label: "Abbildungen",    accent: true  },
              { href: "/admin/suggestions", label: "Vorschläge",     accent: false },
              { href: "/admin/team",        label: "Team",           accent: false },
              { href: "/trainer",           label: "Trainer-Ansicht",accent: false },
              { href: "/",                  label: "Akademie",       accent: false },
            ].map(({ href, label, accent }) => (
              <Link
                key={href}
                href={href}
                className={`font-mono text-[10px] uppercase tracking-[0.08em] transition-colors ${
                  accent ? "text-accent hover:text-accent/80" : "text-white/60 hover:text-white"
                }`}
              >
                {label} →
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">

        {/* ── KPI-Kacheln ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-8">
          {[
            { label: "Module gesamt", value: total,        sub: "22 geplant" },
            { label: "Vollständig",   value: vollstaendig, sub: "Sec 1–7",      highlight: vollstaendig === total },
            { label: "KERN fertig",   value: kernFertig,   sub: "Sec 1,4,5,7" },
            { label: "Praxis-Review", value: praxisDone,   sub: `von ${total}` },
            { label: "Wiss.-Review",  value: wissDone,     sub: `von ${total}` },
            { label: "Sim.-Review",   value: simDone,      sub: `von ${total}` },
            { label: "PDF bereit",    value: mitPdf,       sub: "Workbook" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className={`bg-white border border-line p-4 ${kpi.highlight ? "border-emerald-300" : ""}`}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2 leading-snug">
                {kpi.label}
              </div>
              <div className={`font-serif text-3xl font-normal ${kpi.highlight ? "text-emerald-600" : "text-ink"}`}>
                {kpi.value}
              </div>
              <div className="font-mono text-[10px] text-ink-3 mt-1">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Fortschrittsbalken ──────────────────────────────────────── */}
        <div className="bg-white border border-line p-5 mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { label: "Vollständigkeit", done: vollstaendig, total },
              { label: "Praxis-Review",   done: praxisDone,   total },
              { label: "Wiss.-Review",    done: wissDone,     total },
              { label: "Sim.-Review",     done: simDone,      total },
              { label: "PDF",             done: mitPdf,       total },
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
                <div className="h-1.5 bg-line overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(bar.done / bar.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabellen nach Kompetenzfeld ──────────────────────────────── */}
        {Object.entries(grouped).map(([slug, modules]) => (
          <section key={slug} className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 font-semibold">
                {FIELD_LABELS[slug] ?? slug}
              </h2>
              <span className="font-mono text-[10px] text-ink-3">
                {modules.filter((m) => m.ergaenzung).length}/{modules.length} vollständig
              </span>
            </div>

            <div className="bg-white border border-line overflow-hidden">
              {/* Scrollbarer Tabellencontainer */}
              <div className="overflow-x-auto">
                {/* Kopfzeile */}
                <div className="grid grid-cols-[60px_minmax(140px,1fr)_80px_80px_70px_70px_70px_70px_70px_56px] min-w-[700px] bg-primary text-white text-[10px] font-mono uppercase tracking-[0.08em]">
                  {["ID", "Titel", "Version", "Stufe", "KERN", "Vollst.", "P-Rev.", "W-Rev.", "Sim.", "PDF"].map((h) => (
                    <div key={h} className="px-3 py-2.5">{h}</div>
                  ))}
                </div>

                {/* Zeilen */}
                {modules.map((m, i) => {
                  const hasKern    = Boolean(m.content?.trim());
                  const vollst     = m.ergaenzung;
                  const pdfUrl     = getParticipantHandoutPdfUrl(m.id);
                  const even       = i % 2 === 0;

                  return (
                    <div
                      key={m.id}
                      className={`grid grid-cols-[60px_minmax(140px,1fr)_80px_80px_70px_70px_70px_70px_70px_56px] min-w-[700px] border-t border-line items-center ${even ? "bg-white" : "bg-bg-2"}`}
                    >
                      <div className="px-3 py-3">
                        <Link href={`/module/${m.id}`} className="font-mono text-[11px] font-semibold text-primary hover:underline">
                          {m.id}
                        </Link>
                      </div>
                      <div className="px-3 py-3">
                        <div className="text-[12px] font-medium text-ink leading-snug line-clamp-2">{m.title}</div>
                      </div>
                      <div className="px-3 py-3">
                        <span className="font-mono text-[10px] text-ink-2">{m.version}</span>
                      </div>
                      <div className="px-3 py-3">
                        <span className={`font-mono text-[9px] uppercase tracking-[0.05em] px-1.5 py-0.5 ${STUFE_BADGE[m.stufe] ?? ""}`}>
                          {m.stufe === "Sparringspartner" ? "Sparring" : m.stufe}
                        </span>
                      </div>
                      <div className="px-3 py-3">
                        <Check ok={hasKern} label={hasKern ? "✓" : "–"} />
                      </div>
                      <div className="px-3 py-3">
                        <Check ok={vollst} label={vollst ? "✓" : hasKern ? "KERN" : "–"} />
                      </div>
                      <div className="px-3 py-3">
                        <Check ok={m.praxis_review} />
                      </div>
                      <div className="px-3 py-3">
                        <Check ok={m.wiss_review} />
                      </div>
                      <div className="px-3 py-3">
                        <Check ok={m.sim_review} />
                      </div>
                      <div className="px-3 py-3">
                        {pdfUrl ? (
                          <a href={pdfUrl} className="font-mono text-[10px] text-primary hover:underline" target="_blank">PDF</a>
                        ) : (
                          <span className="font-mono text-[10px] text-ink-3">–</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ))}

        {/* ── Legende ─────────────────────────────────────────────────── */}
        <div className="bg-white border border-line p-5 mt-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-3">Legende</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 text-[11px] text-ink-2">
            <div><strong className="text-ink">KERN</strong> – Sec 1, 4, 5, 7 (Steckbrief, Workbook, Praxistransfer, Quellen)</div>
            <div><strong className="text-ink">Vollst.</strong> – KERN + ERGÄNZUNG: Sec 2 (Wissenschaft), Sec 3+6 (Trainer + Evaluation)</div>
            <div><strong className="text-ink">P-Rev.</strong> – Praxis-Review durch Armin (FK-Berater, 25 J. Erfahrung)</div>
            <div><strong className="text-ink">W-Rev.</strong> – Wissenschaftliches Review durch Prof. Brandt</div>
            <div><strong className="text-ink">Sim.</strong> – Workshop-Simulation mit Teilnehmer-Personas; Feedback ausgewertet</div>
          </div>
        </div>
      </div>
    </div>
  );
}
