"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { upsertAssessment } from "@/lib/db";
import { redirect } from "next/navigation";
import { getAssessmentFields } from "./fields";

export async function actionSaveAssessment(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as { id?: string }).id!;

  const track = String(formData.get("track") ?? "berater");
  const fields = getAssessmentFields(track);

  const scores: Record<string, number> = {};
  for (const field of fields) {
    const val = formData.get(field.slug);
    const num = Number(val);
    if (num >= 1 && num <= 3) scores[field.slug] = num;
  }

  await upsertAssessment(userId, scores);
  redirect(track === "assistenz" ? "/kompass?track=assistenz" : "/kompass");
}
