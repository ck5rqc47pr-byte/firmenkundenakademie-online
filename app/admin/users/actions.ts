"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { createUser, updateUser, deleteUser, type UserRole } from "@/lib/db";

export async function actionCreateUser(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const login = (formData.get("login") as string).trim().toLowerCase();
  const password = (formData.get("password") as string);
  const role = formData.get("role") as UserRole;

  if (!name || !login || !password || !role) throw new Error("Alle Felder erforderlich");

  const passwordHash = await bcrypt.hash(password, 10);
  await createUser(name, login, passwordHash, role);
  revalidatePath("/admin/users");
}

export async function actionUpdateRole(formData: FormData) {
  const id = formData.get("id") as string;
  const role = formData.get("role") as UserRole;
  await updateUser(id, { role });
  revalidatePath("/admin/users");
}

export async function actionResetPassword(formData: FormData) {
  const id = formData.get("id") as string;
  const password = (formData.get("password") as string);
  if (!password || password.length < 8) throw new Error("Passwort mind. 8 Zeichen");
  const passwordHash = await bcrypt.hash(password, 10);
  await updateUser(id, { passwordHash });
  revalidatePath("/admin/users");
}

export async function actionDeleteUser(formData: FormData) {
  const id = formData.get("id") as string;
  await deleteUser(id);
  revalidatePath("/admin/users");
}
