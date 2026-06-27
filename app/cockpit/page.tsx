import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllModules, getTeamleiterLeitfadenPdfUrl } from "@/lib/modules";
import {
  getTeamProgress,
  getTeamQuizAverages,
  getModuleCompletionStats,
  getQuizStats,
} from "@/lib/db";

export const dynamic = "force-dynamic";

const COCKPIT_ROLES = ["teamleiter", "trainer", "admin"];

function formatDate(iso: string | null): string {
  if (!iso) return "–";
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function CockpitPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? "";
  if (!session || !COCKPIT_ROLES.includes(role)) {
    redirect("/login?callbackUrl=/cockpit");
  }

  const alleModule = getAllModules();
  const moduleCount = alleModule.length;
  const stufen: Record<string, number> = {};
  for (const m of alleModule) stufen[m.stufe] = (stufen[m.stufe] ?? 0) + 1;

  const [team, quizAvgs, completions, quizStats] = await Promise.all([
    getTeamProgress(),
    getTeamQuizAverages(),
    getModuleCompletionStats(),
    getQuizStats(),
  ]);
  const quizByUser = new Map(quizAvgs.map((q) => [q.user_id, q]));
  const completionByModule = new Map(completions.map((c) => [c.module_id, c.completed_count]));
  const quizByModule = new Map(quizStats.map((q) => [q.module_id, q]));

  const teamSize = team.length;
  const avgCompleted = teamSize
    ? (team.reduce((s, t) => s + t.completed_count, 0) / teamSize).toFixed(1)
    : "–";
  const quizParticipants = quizAvgs.length;

  return (
    <div className="min-h-screen bg-bg-2">
      {/* Header */}
      <div className="bg-primary border-b border-ink">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 mb-1">
              Teamleiter-Cockpit · Kirkpatrick Level 2/3
            </div>
            <h1 className="font-serif text-2xl font-normal text-white tracking-[-0.02em]">
              Lernfortschritt im Team
            </h1>
          </div>
          <Link href="/module" className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors">
            Alle Module →
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* Kickoff-Leitfaden (Onboarding) */}
        <section className="bg-white border border-line p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-1">
              Bevor es losgeht
            </div>
            <h2 className="font-serif text-lg text-ink mb-1">
              Kickoff-Leitfaden: Ihr Team mitnehmen
            </h2>
            <p className="text-sm text-ink-2 max-w-2xl leading-relaxed">
              Wie Sie das Programm einführen – WHY-Ansprache in drei Schichten, Einwand-Spickzettel
              und die typischen Stolpersteine. Damit aus „gebucht" auch „gewollt" wird.
            </p>
          </div>
          <a
            href="/api/downloads/teamleiter-material/Kickoff-WHY-Leitfaden.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] bg-primary text-white px-5 py-3 hover:bg-primary/90 transition shrink-0"
          >
            Leitfaden öffnen ↓
          </a>
        </section>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white border border-line p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2">Teilnehmer</div>
            <div className="font-serif text-3xl text-ink">{teamSize}</div>
          </div>
          <div className="bg-white border border-line p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2">Ø abgeschlossene Module</div>
            <div className="font-serif text-3xl text-ink">{avgCompleted}<span className="text-base text-ink-3"> / {moduleCount}</span></div>
          </div>
          <div className="bg-white border border-line p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2">Mit Wissenstest</div>
            <div className="font-serif text-3xl text-ink">{quizParticipants}<span className="text-base text-ink-3"> Tln.</span></div>
          </div>
          <div className="bg-white border border-line p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-2">Module im Programm</div>
            <div className="font-serif text-3xl text-ink">{moduleCount}</div>
          </div>
        </div>

        {/* Teilnehmer-Tabelle */}
        <section className="bg-white border border-line">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 font-semibold">
              Teilnehmer · Fortschritt & Wissenstests
            </h2>
            <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-3">
              Quiz-Wert = Ø der besten Versuche
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  {["Name", "Fortschritt", "", "Quiz Ø", "Letzte Aktivität"].map((h, i) => (
                    <th key={i} className="text-left font-mono text-[9px] uppercase tracking-[0.08em] text-ink-3 px-5 py-2.5 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {team.map((t) => {
                  const q = quizByUser.get(t.user_id);
                  const pct = moduleCount ? Math.round((t.completed_count / moduleCount) * 100) : 0;
                  return (
                    <tr key={t.user_id} className="border-b border-line last:border-0 hover:bg-bg-2 transition">
                      <td className="px-5 py-3 font-serif text-ink">{t.user_name}</td>
                      <td className="px-5 py-3 font-mono text-[11px] text-ink-2 whitespace-nowrap">
                        {t.completed_count} / {moduleCount}
                      </td>
                      <td className="py-3 pr-5 w-[28%] min-w-[120px]">
                        <div className="h-1.5 bg-bg-2 border border-line">
                          <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-[11px] text-ink-2 whitespace-nowrap">
                        {q?.avg_best_score != null ? `${q.avg_best_score} %` : "–"}
                        {q ? <span className="text-ink-3"> ({q.quiz_count} Tests)</span> : null}
                      </td>
                      <td className="px-5 py-3 font-mono text-[11px] text-ink-3 whitespace-nowrap">
                        {formatDate(t.last_activity)}
                      </td>
                    </tr>
                  );
                })}
                {team.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center font-serif text-ink-3">
                      Noch keine Teilnehmer angelegt.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Modul-Tabelle */}
        <section className="bg-white border border-line">
          <div className="px-5 py-4 border-b border-line">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 font-semibold">
              Module · Abschlüsse & Testergebnisse
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  {["Modul", "Stufe", "Abgeschlossen", "Quiz Ø", "Bestehensquote", "Transfergespräch"].map((h) => (
                    <th key={h} className="text-left font-mono text-[9px] uppercase tracking-[0.08em] text-ink-3 px-5 py-2.5 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alleModule.map((m) => {
                  const done = completionByModule.get(m.id) ?? 0;
                  const qs = quizByModule.get(m.id);
                  const leitfadenUrl = getTeamleiterLeitfadenPdfUrl(m.id);
                  return (
                    <tr key={m.id} className="border-b border-line last:border-0 hover:bg-bg-2 transition">
                      <td className="px-5 py-3">
                        <Link href={`/module/${m.id}`} className="font-serif text-ink hover:text-primary transition">
                          <span className="font-mono text-[10px] text-ink-3 mr-2">{m.id}</span>
                          {m.title}
                        </Link>
                      </td>
                      <td className="px-5 py-3 font-mono text-[10px] text-ink-3 whitespace-nowrap">{m.stufe}</td>
                      <td className="px-5 py-3 font-mono text-[11px] text-ink-2 whitespace-nowrap">
                        {done} / {teamSize}
                      </td>
                      <td className="px-5 py-3 font-mono text-[11px] text-ink-2 whitespace-nowrap">
                        {qs?.avg_score != null ? `${qs.avg_score} %` : "–"}
                      </td>
                      <td className="px-5 py-3 font-mono text-[11px] text-ink-2 whitespace-nowrap">
                        {qs?.pass_rate != null ? `${qs.pass_rate} %` : "–"}
                      </td>
                      <td className="px-5 py-3">
                        {leitfadenUrl ? (
                          <a href={leitfadenUrl} target="_blank" rel="noreferrer"
                             className="font-mono text-[10px] uppercase tracking-[0.06em] text-primary hover:underline whitespace-nowrap">
                            Leitfaden ↓
                          </a>
                        ) : (
                          <span className="font-mono text-[10px] text-ink-3">–</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-3">
          Datengrundlage: Modulabschlüsse (Selbstmarkierung) und Wissenstests (Kirkpatrick L2).
          Verhaltensbeurteilung (L3) über Beobachtungsbogen und Transfergespräch – Leitfäden je Modul rechts.
        </p>
      </div>
    </div>
  );
}
