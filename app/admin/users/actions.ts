"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { createUser, updateUser, deleteUser, type UserRole } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// Erlaubte Track-Werte (Phase 18); leer/ungültig → null = kein Filter (alle Tracks).
const TRACK_SLUGS = ["berater", "assistenz", "teamleiter"];
function normalizeTrack(raw: unknown): string | null {
  const v = ((raw as string) ?? "").trim();
  return TRACK_SLUGS.includes(v) ? v : null;
}

export async function actionCreateUser(formData: FormData) {
  await requireAdmin();
  const name = (formData.get("name") as string).trim();
  const login = (formData.get("login") as string).trim().toLowerCase();
  const password = (formData.get("password") as string);
  const role = formData.get("role") as UserRole;
  const bank = ((formData.get("bank") as string) ?? "").trim() || null;
  const track = normalizeTrack(formData.get("track"));

  if (!name || !login || !password || !role) throw new Error("Alle Felder erforderlich");

  const passwordHash = await bcrypt.hash(password, 10);
  await createUser(name, login, passwordHash, role, bank, track);
  revalidatePath("/admin/users");
}

export async function actionUpdateRole(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const role = formData.get("role") as UserRole;
  await updateUser(id, { role });
  revalidatePath("/admin/users");
}

export async function actionUpdateBank(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const bank = ((formData.get("bank") as string) ?? "").trim() || null;
  await updateUser(id, { bank });
  revalidatePath("/admin/users");
}

export async function actionUpdateTrack(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const track = normalizeTrack(formData.get("track"));
  await updateUser(id, { track });
  revalidatePath("/admin/users");
}

export async function actionResetPassword(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const password = (formData.get("password") as string);
  if (!password || password.length < 8) throw new Error("Passwort mind. 8 Zeichen");
  const passwordHash = await bcrypt.hash(password, 10);
  await updateUser(id, { passwordHash });
  revalidatePath("/admin/users");
}

export async function actionDeleteUser(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  await deleteUser(id);
  revalidatePath("/admin/users");
}
