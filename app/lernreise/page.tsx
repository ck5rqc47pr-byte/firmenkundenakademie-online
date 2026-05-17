import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProgressForUser } from "@/lib/db";
import { getAllModules } from "@/lib/modules";

export const dynamic = "force-dynamic";

const FIELD_COLORS: Record<string, string> = {
  finanzanalyse: "bg-blue-50 border-blue-200 text-blue-700",
  branchenwissen: "bg-emerald-50 border-emerald-200 text-emerald-700",
  gespraechsfuehrung: "bg-violet-50 border-violet-200 text-violet-700",
  vertrieb: "bg-amber-50 border-amber-200 text-amber-700",
  digital: "bg-cyan-50 border-cyan-200 text-cyan-700",
  fuehrung: "bg-rose-50 border-rose-200 text-rose-700",
};

export default async function LernreisePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/lernreise");

  const userId = (session.user as { id?: string }).id!;
  const userName = session.user?.name ?? "Teilnehmer";

  const allModules = getAllModules().filter((m) => m.status === "freigegeben");
  const progress = await getProgressForUser(userId);
  const completedIds = new Set(progress.map((p) => p.module_id));

  const completed = allModules.filter((m) => completedIds.has(m.id));
  const open = allModules.filter((m) => !completedIds.has(m.id));
  const pct = Math.round((completed.length / allModules.length) * 100);

  return (
    <div>
      {/* Header */}
      <section className="border-b border-ink mx-auto max-w-content px-6 lg:px-14 py-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 mb-6">
          Meine Lernreise · {userName}
        </div>
        <h1 className="font-serif text-5xl lg:text-7xl font-normal leading-[0.93] tracking-[-0.035em]">
          {completed.length} von {allModules.length}<br />
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Modulen abgeschlossen.</em>
        </h1>

        {/* Fortschrittsbalken */}
        <div className="mt-10 max-w-lg">
          <div className="flex justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">Fortschritt</span>
            <span className="font-mono text-[10px] text-ink-3">{pct}%</span>
          </div>
          <div className="h-2 bg-line rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-6 lg:px-14 py-12 space-y-16">

        {/* Offene Module */}
        {open.length > 0 && (
          <section>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 font-semibold mb-6">
              Noch offen ({open.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {open.map((m) => (
                <Link
                  key={m.id}
                  href={`/module/${m.id}`}
                  className="group border border-line p-5 hover:border-primary transition flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">{m.id}</span>
                    <span className={`font-mono text-[9px] uppercase tracking-[0.05em] px-2 py-0.5 border rounded ${FIELD_COLORS[m.kompetenzfeld_slug] ?? ""}`}>
                      {m.kompetenzfeld_slug}
                    </span>
                  </div>
                  <div className="font-serif text-base leading-snug text-ink group-hover:text-primary transition">
                    {m.title}
                  </div>
                  <div className="font-mono text-[10px] text-ink-3 mt-auto pt-2">
                    {m.dauer} · {m.stufe}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Abgeschlossene Module */}
        {completed.length > 0 && (
          <section>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 font-semibold mb-6">
              Abgeschlossen ({completed.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completed.map((m) => {
                const entry = progress.find((p) => p.module_id === m.id);
                return (
                  <Link
                    key={m.id}
                    href={`/module/${m.id}`}
                    className="group border border-emerald-200 bg-emerald-50/40 p-5 hover:border-emerald-400 transition flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-emerald-600">{m.id}</span>
                      <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        Abgeschlossen
                      </span>
                    </div>
                    <div className="font-serif text-base leading-snug text-ink group-hover:text-primary transition">
                      {m.title}
                    </div>
                    {entry && (
                      <div className="font-mono text-[10px] text-ink-3 mt-auto pt-2">
                        {new Date(entry.completed_at).toLocaleDateString("de-DE")}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {completed.length === 0 && open.length === 0 && (
          <p className="font-serif text-xl text-ink-2">Noch keine Module verfügbar.</p>
        )}

      </div>
    </div>
  );
}
