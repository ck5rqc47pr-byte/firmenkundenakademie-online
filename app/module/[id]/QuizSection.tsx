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
    <QuizWidget
      moduleId={moduleId}
      questions={questions}
      previousScore={previousScore}
      onSubmit={async (answers, score) => {
        await actionSubmitQuiz(moduleId, answers, score);
      }}
    />
  );
}
