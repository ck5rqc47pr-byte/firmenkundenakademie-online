import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getQuizStats } from "@/lib/db";
import { getAllModules } from "@/lib/modules";
import { getQuizForModule } from "@/lib/quizzes";

export const dynamic = "force-dynamic";

function ScoreBar({ value }: { value: number | null }) {
  if (!value) return <span className="font-mono text-[10px] text-ink-3">–</span>;
  const color = value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-line rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="font-mono text-[11px] text-ink tabular-nums">{value}%</span>
    </div>
  );
}

export default async function QuizAdminPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? "";
  if (!session || role !== "admin") redirect("/login?callbackUrl=/admin/quiz");

  const stats = await getQuizStats();
  const allModules = getAllModules();
  const statsMap = new Map(stats.map((s) => [s.module_id, s]));

  const totalAttempts = stats.reduce((sum, s) => sum + s.count, 0);
  const modulesWithQuiz = allModules.filter((m) => getQuizForModule(m.id).length > 0).length;
  const avgScore = stats.length
    ? (stats.reduce((sum, s) => sum + (s.avg_score ?? 0), 0) / stats.length).toFixed(0)
    : "–";

  return (
    <div className="min-h-screen bg-bg-2">
      <div className="bg-primary border-b border-ink">
        <div className="max-w-[1200px] mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 mb-1">
              Admin-Konsole · Kirkpatrick Level 2
            </div>
            <h1 className="font-serif text-2xl font-normal text-white tracking-[-0.02em]">
              Wissenstests
            </h1>
          </div>
          <Link href="/admin" className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors">
            ← Modulübersicht
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 py-10 space-y-10">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Abgaben gesamt", value: totalAttempts },
            { label: "Module mit Quiz", value: `${modulesWithQuiz}/21` },
            { label: "Ø Score", value: avgScore ? `${avgScore}%` : "–" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white border border-line rounded p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2">{kpi.label}</div>
              <div className="font-serif text-3xl font-normal text-ink">{kpi.value}</div>
            </div>
          ))}
        </div>

        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 font-semibold mb-4">
            Ergebnisse nach Modul
          </h2>
          <div className="bg-white border border-line rounded overflow-hidden">
            <div className="grid grid-cols-[80px_1fr_60px_60px_140px_140px] bg-primary text-white font-mono text-[10px] uppercase tracking-[0.08em]">
              {["ID", "Titel", "Fragen", "Abgaben", "Ø Score", "Bestehensquote"].map((h) => (
                <div key={h} className="px-3 py-2.5">{h}</div>
              ))}
            </div>
            {allModules.map((m, i) => {
              const s = statsMap.get(m.id);
              const qCount = getQuizForModule(m.id).length;
              return (
                <div
                  key={m.id}
                  className={`grid grid-cols-[80px_1fr_60px_60px_140px_140px] border-t border-line items-center ${i % 2 === 0 ? "bg-white" : "bg-bg-2"}`}
                >
                  <div className="px-3 py-3">
                    <Link href={`/module/${m.id}`} className="font-mono text-[11px] font-semibold text-primary hover:underline">
                      {m.id}
                    </Link>
                  </div>
                  <div className="px-3 py-3 text-[12px] text-ink leading-snug">{m.title}</div>
                  <div className="px-3 py-3 font-mono text-[11px] text-ink-3">{qCount || "–"}</div>
                  <div className="px-3 py-3 font-mono text-[11px] text-ink-3">{s?.count ?? 0}</div>
                  <div className="px-3 py-3"><ScoreBar value={s?.avg_score ?? null} /></div>
                  <div className="px-3 py-3 font-mono text-[11px] text-ink-3">
                    {s?.pass_rate != null ? `${s.pass_rate}%` : "–"}
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
