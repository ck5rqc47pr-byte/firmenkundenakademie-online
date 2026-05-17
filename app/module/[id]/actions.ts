"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { markModuleCompleted, unmarkModuleCompleted } from "@/lib/db";

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
