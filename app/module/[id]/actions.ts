"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { markModuleCompleted, unmarkModuleCompleted, upsertFeedback } from "@/lib/db";

export async function actionMarkCompleted(moduleId: string) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return;
  await markModuleCompleted(userId, moduleId);
  revalidatePath(`/module/${moduleId}`);
  revalidatePath("/lernreise");
}

export async function actionUnmarkCompleted(moduleId: string) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return;
  await unmarkModuleCompleted(userId, moduleId);
  revalidatePath(`/module/${moduleId}`);
  revalidatePath("/lernreise");
}

export async function actionSubmitFeedback(moduleId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return;

  const parse = (key: string) => parseInt(formData.get(key) as string, 10);
  await upsertFeedback(
    userId,
    moduleId,
    {
      inhalt: parse("rating_inhalt"),
      tempo: parse("rating_tempo"),
      praxis: parse("rating_praxis"),
      material: parse("rating_material"),
      gesamt: parse("rating_gesamt"),
    },
    (formData.get("kommentar") as string) ?? ""
  );
  revalidatePath(`/module/${moduleId}`);
}
