"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { upsertAssessment } from "@/lib/db";
import { redirect } from "next/navigation";

export async function actionSaveAssessment(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as { id?: string }).id!;

  const FIELDS = [
    "finanzanalyse",
    "branchenwissen",
    "gespraechsfuehrung",
    "vertrieb",
    "digital",
    "fuehrung",
  ];

  const scores: Record<string, number> = {};
  for (const field of FIELDS) {
    const val = formData.get(field);
    const num = Number(val);
    if (num >= 1 && num <= 3) scores[field] = num;
  }

  await upsertAssessment(userId, scores);
  redirect("/kompass");
}
