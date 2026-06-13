"use client";

import { QuizWidget } from "@/components/QuizWidget";
import type { QuizQuestion } from "@/lib/quizzes";
import { actionSubmitQuiz } from "./actions";

type Props = {
  moduleId: string;
  questions: QuizQuestion[];
  previousScore: number | null;
};

export function QuizSection({ moduleId, questions, previousScore }: Props) {
  if (questions.length === 0) return null;

  return (
    <details className="group border border-line" open={previousScore == null}>
      <summary className="cursor-pointer list-none px-5 py-3.5 font-serif text-base text-ink flex items-center justify-between hover:bg-bg-2 transition">
        <span>
          Wissenstest · {questions.length} Fragen
          {previousScore != null && (
            <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.06em] text-emerald-600">
              zuletzt {previousScore} %
            </span>
          )}
        </span>
        <span className="font-mono text-[10px] text-ink-3 group-open:rotate-90 transition-transform">→</span>
      </summary>
      <div className="px-5 pb-5 border-t border-line pt-4">
        <QuizWidget
          moduleId={moduleId}
          questions={questions}
          previousScore={previousScore}
          onSubmit={async (answers, score) => {
            await actionSubmitQuiz(moduleId, answers, score);
          }}
        />
      </div>
    </details>
  );
}
