import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { MetaBox } from "@/components/MetaBox";
import { ModuleHeader } from "@/components/ModuleHeader";
import { VideoEmbed } from "@/components/VideoEmbed";
import {
  getAdjacentModules,
  getModuleById,
  getParticipantHandoutPdfUrl,
  getTrainerHandbuchPdfUrl,
  getBeobachtungsbogenPdfUrl,
} from "@/lib/modules";
import { getProgressForUser, getFeedbackForUser, getLatestQuizResult } from "@/lib/db";
import { getQuizForModule } from "@/lib/quizzes";
import { actionMarkCompleted, actionUnmarkCompleted, actionSubmitFeedback } from "./actions";
import { QuizSection } from "./QuizSection";
import { SuggestionForm } from "@/components/SuggestionForm";

export const dynamic = "force-dynamic";

export default async function ModuleDetailPage({ params }: { params: { id: string } }) {
  const module = getModuleById(params.id);
  if (!module) notFound();

  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? "teilnehmer";
  const userId = (session?.user as { id?: string })?.id ?? null;
  const isTrainerOrAdmin = role === "trainer" || role === "admin";
  const canSeeBeobachtungsbogen = role === "teamleiter" || role === "trainer" || role === "admin";

  const progress = userId ? await getProgressForUser(userId) : [];
  const isCompleted = progress.some((p) => p.module_id === module.id);
  const existingFeedback = userId && isCompleted ? await getFeedbackForUser(userId, module.id) : null;
  const quizQuestions = getQuizForModule(module.id);
  const latestQuizResult = userId && isCompleted && quizQuestions.length > 0
    ? await getLatestQuizResult(userId, module.id)
    : null;

  const adjacent = getAdjacentModules(module.id);
  const pdfUrl = getParticipantHandoutPdfUrl(module.id);
  const trainerPdfUrl = getTrainerHandbuchPdfUrl(module.id);
  const beobachtungsbogenUrl = getBeobachtungsbogenPdfUrl(module.id);

  // Content in Abschnitte aufteilen (sync_akademie.py trennt mit SECTION_BREAK)
  const [sec4Content = "", sec5Content = "", sec7Content = ""] =
    module.content.split("\n\n<!-- SECTION_BREAK -->\n\n");

  return (
    <div>
      <ModuleHeader module={module} isTrainerOrAdmin={isTrainerOrAdmin} />
      <div className="mx-auto max-w-content px-6 lg:px-14">
        <div className="grid gap-16 py-12 lg:grid-cols-[260px_1fr] lg:py-20 min-w-0">
          <MetaBox
            module={module}
            pdfUrl={pdfUrl}
            trainerPdfUrl={trainerPdfUrl}
            beobachtungsbogenUrl={canSeeBeobachtungsbogen ? beobachtungsbogenUrl : null}
            hasTheorie={!!module.content_theorie}
            isTrainerOrAdmin={isTrainerOrAdmin}
            className="order-2 min-w-0 lg:order-1 lg:sticky lg:top-28 lg:self-start"
          />
          <div className="order-1 min-w-0 space-y-12 lg:order-2">
            {/* Mobile Chapter-Nav – nur auf kleinen Screens, Desktop hat MetaBox-Sidebar */}
            <nav className="lg:hidden flex flex-wrap gap-3 pt-2">
              {module.content_theorie && (
                <a href="#einordnung" className="font-mono text-[10px] uppercase tracking-[0.06em] border border-line text-ink-2 px-3 py-2 hover:border-primary hover:text-primary transition">
                  Einordnung
                </a>
              )}
              <a href="#inhalte" className="font-mono text-[10px] uppercase tracking-[0.06em] border border-line text-ink-2 px-3 py-2 hover:border-primary hover:text-primary transition">
                Inhalte
              </a>
              <a href="#transfer" className="font-mono text-[10px] uppercase tracking-[0.06em] border border-line text-ink-2 px-3 py-2 hover:border-primary hover:text-primary transition">
                Praxistransfer
              </a>
              <a href="#quellen" className="font-mono text-[10px] uppercase tracking-[0.06em] border border-line text-ink-2 px-3 py-2 hover:border-primary hover:text-primary transition">
                Quellen
              </a>
            </nav>
            <VideoEmbed youtubeId={module.youtube_id} title={module.title} />

            {/* Wissenschaftliche Einordnung */}
            {module.content_theorie && (
              <div id="einordnung" className="min-w-0 overflow-hidden scroll-mt-28">
                <MarkdownRenderer content={module.content_theorie} />
              </div>
            )}

            {/* Sec 4: Modulinhalte */}
            <div id="inhalte" className="min-w-0 overflow-hidden scroll-mt-28">
              <MarkdownRenderer content={sec4Content} />
            </div>

            {/* Sec 5: Praxistransfer */}
            {sec5Content && (
              <div id="transfer" className="min-w-0 overflow-hidden scroll-mt-28">
                <MarkdownRenderer content={sec5Content} />
              </div>
            )}

            {/* Sec 7: Quellen */}
            {sec7Content && (
              <div id="quellen" className="min-w-0 overflow-hidden scroll-mt-28">
                <MarkdownRenderer content={sec7Content} />
              </div>
            )}

            {/* Trainerbereich – nur für Trainer und Admin */}
            {isTrainerOrAdmin && module.content_trainer && (
              <div id="trainerbereich" className="min-w-0 overflow-hidden border-t-2 border-accent pt-10 scroll-mt-28">
                <div className="mb-6 inline-flex items-center gap-2 bg-accent/10 px-3 py-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent font-semibold">
                    Trainerbereich · Nur für {role === "admin" ? "Admin" : "Trainer"} sichtbar
                  </span>
                </div>
                <MarkdownRenderer content={module.content_trainer} />
              </div>
            )}

          </div>
        </div>
        {/* Modul abschließen */}
        {userId && (
          <div className="border-t border-line pt-8 pb-2 flex items-center gap-4">
            {isCompleted ? (
              <>
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Modul abgeschlossen
                </span>
                <form action={actionUnmarkCompleted.bind(null, module.id)}>
                  <button type="submit" className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3 hover:text-ink transition underline">
                    Zurücksetzen
                  </button>
                </form>
              </>
            ) : (
              <form action={actionMarkCompleted.bind(null, module.id)}>
                <button
                  type="submit"
                  className="font-mono text-[11px] uppercase tracking-[0.08em] px-5 py-2.5 bg-primary text-white hover:opacity-90 transition"
                >
                  Modul abschließen ✓
                </button>
              </form>
            )}
          </div>
        )}

        {/* Rückmeldebogen – erscheint nach Abschluss */}
        {userId && isCompleted && (
          <div className="border border-line rounded p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2 font-semibold">
                Rückmeldebogen · Kirkpatrick L1
              </h3>
              {existingFeedback && (
                <span className="font-mono text-[10px] text-emerald-600 uppercase tracking-[0.06em]">
                  ✓ Abgegeben
                </span>
              )}
            </div>
            <form action={actionSubmitFeedback.bind(null, module.id)} className="space-y-5">
              {([
                ["rating_inhalt",   "Fachlicher Inhalt"],
                ["rating_tempo",    "Lerntempo & Struktur"],
                ["rating_praxis",   "Praxisbezug"],
                ["rating_material", "Lernmaterialien"],
                ["rating_gesamt",   "Gesamteindruck"],
              ] as [string, string][]).map(([name, label]) => {
                const current = existingFeedback?.[name as keyof typeof existingFeedback] as number | null;
                return (
                  <div key={name} className="flex items-center gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3 w-40 shrink-0">
                      {label}
                    </span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <label key={v} className="flex flex-col items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name={name}
                            value={v}
                            defaultChecked={current === v}
                            required
                            className="accent-primary"
                          />
                          <span className="font-mono text-[10px] text-ink-3">{v}</span>
                        </label>
                      ))}
                    </div>
                    <span className="font-mono text-[9px] text-ink-3 hidden sm:block">
                      1 = schlecht · 5 = sehr gut
                    </span>
                  </div>
                );
              })}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">
                  Kommentar (optional)
                </label>
                <textarea
                  name="kommentar"
                  rows={3}
                  defaultValue={existingFeedback?.kommentar ?? ""}
                  placeholder="Was hat besonders gut funktioniert? Was könnte besser sein?"
                  className="border border-line px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <button
                type="submit"
                className="font-mono text-[11px] uppercase tracking-[0.08em] px-5 py-2.5 bg-primary text-white hover:opacity-90 transition"
              >
                {existingFeedback ? "Rückmeldung aktualisieren" : "Rückmeldung abschicken →"}
              </button>
            </form>
          </div>
        )}

        {/* Verbesserungsvorschläge */}
        {userId && (
          <div className="mt-6">
            <SuggestionForm moduleId={module.id} />
          </div>
        )}

        {/* Wissenstest */}
        {userId && isCompleted && quizQuestions.length > 0 && (
          <QuizSection
            moduleId={module.id}
            questions={quizQuestions}
            previousScore={latestQuizResult?.score ?? null}
          />
        )}

        <nav className="border-t border-ink py-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-1">
            {adjacent.previous ? (
              <Link
                href={`/module/${adjacent.previous.id}`}
                className="group flex flex-col gap-0.5 hover:text-ink transition"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                  ← {adjacent.previous.id}
                </span>
                <span className="font-serif text-base text-ink-2 group-hover:text-ink transition leading-snug">
                  {adjacent.previous.title}
                </span>
              </Link>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">← Voriges</span>
            )}
          </div>
          <Link
            href="/module"
            className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 hover:text-ink transition md:self-center"
          >
            Alle Module
          </Link>
          <div className="flex flex-col gap-0.5 md:text-right">
            {adjacent.next ? (
              <Link
                href={`/module/${adjacent.next.id}`}
                className="group flex flex-col gap-0.5 hover:text-ink transition md:items-end"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                  {adjacent.next.id} →
                </span>
                <span className="font-serif text-base text-ink-2 group-hover:text-ink transition leading-snug">
                  {adjacent.next.title}
                </span>
              </Link>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 md:self-end">Nächstes →</span>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
