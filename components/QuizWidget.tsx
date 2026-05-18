"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/quizzes";

type Props = {
  moduleId: string;
  questions: QuizQuestion[];
  previousScore?: number | null;
  onSubmit: (answers: Record<string, number>, score: number) => Promise<void>;
};

export function QuizWidget({ moduleId, questions, previousScore, onSubmit }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; submitted: boolean } | null>(
    previousScore != null ? { score: previousScore, submitted: true } : null
  );
  const [loading, setLoading] = useState(false);
  const [showRetry, setShowRetry] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  async function handleSubmit() {
    if (!allAnswered || loading) return;
    setLoading(true);
    const correct = questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const score = Math.round((correct / questions.length) * 100);
    await onSubmit(answers, score);
    setResult({ score, submitted: true });
    setLoading(false);
    setShowRetry(false);
  }

  function handleRetry() {
    setAnswers({});
    setResult(null);
    setShowRetry(false);
  }

  const scoreColor =
    result && result.score >= 80
      ? "text-emerald-600"
      : result && result.score >= 60
      ? "text-amber-600"
      : "text-red-600";

  return (
    <div className="border border-line rounded p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2 font-semibold">
          Wissenstest · Kirkpatrick L2
        </h3>
        {result?.submitted && !showRetry && (
          <div className="flex items-center gap-3">
            <span className={`font-serif text-2xl font-normal ${scoreColor}`}>
              {result.score}%
            </span>
            <span className="font-mono text-[10px] text-ink-3">
              {result.score >= 80 ? "Bestanden ✓" : result.score >= 60 ? "Ausreichend" : "Nicht bestanden"}
            </span>
            <button
              onClick={() => setShowRetry(true)}
              className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3 hover:text-ink transition underline"
            >
              Wiederholen
            </button>
          </div>
        )}
      </div>

      {(!result?.submitted || showRetry) ? (
        <>
          <div className="space-y-6">
            {questions.map((q, qi) => (
              <div key={q.id} className="space-y-3">
                <p className="text-sm font-medium text-ink leading-snug">
                  <span className="font-mono text-[10px] text-ink-3 mr-2">{qi + 1}.</span>
                  {q.question}
                </p>
                <div className="space-y-2 pl-5">
                  {q.options.map((opt, oi) => (
                    <label
                      key={oi}
                      className={`flex items-start gap-3 cursor-pointer group p-2 rounded transition ${
                        answers[q.id] === oi ? "bg-primary/5 border border-primary/20" : "hover:bg-bg-2"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={oi}
                        checked={answers[q.id] === oi}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                        className="mt-0.5 accent-primary shrink-0"
                      />
                      <span className="text-sm text-ink-2 leading-snug group-hover:text-ink transition">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || loading}
              className="font-mono text-[11px] uppercase tracking-[0.08em] px-5 py-2.5 bg-primary text-white hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Wird ausgewertet…" : "Test abgeben →"}
            </button>
            {!allAnswered && (
              <span className="font-mono text-[10px] text-ink-3">
                {Object.keys(answers).length}/{questions.length} beantwortet
              </span>
            )}
            {showRetry && (
              <button
                onClick={() => setShowRetry(false)}
                className="font-mono text-[10px] text-ink-3 hover:text-ink transition"
              >
                Abbrechen
              </button>
            )}
          </div>
        </>
      ) : (
        /* Ergebnisanzeige */
        <div className="space-y-4">
          {questions.map((q, qi) => {
            const chosen = answers[q.id] ?? -1;
            const correct = q.correctIndex;
            const isRight = chosen === correct;
            return (
              <div key={q.id} className={`p-4 rounded border ${isRight ? "border-emerald-200 bg-emerald-50/40" : "border-red-200 bg-red-50/40"}`}>
                <p className="text-sm font-medium text-ink mb-2">
                  <span className="font-mono text-[10px] text-ink-3 mr-2">{qi + 1}.</span>
                  {q.question}
                </p>
                <p className={`text-sm ${isRight ? "text-emerald-700" : "text-red-600"}`}>
                  {isRight ? "✓" : "✗"} {q.options[chosen] ?? "–"}
                </p>
                {!isRight && (
                  <p className="text-sm text-emerald-700 mt-1">
                    Richtig: {q.options[correct]}
                  </p>
                )}
                {q.explanation && (
                  <p className="font-mono text-[10px] text-ink-3 mt-2 leading-relaxed">
                    {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
