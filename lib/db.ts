import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
export default sql;

export type UserRole = "admin" | "trainer" | "teamleiter" | "teilnehmer";

export interface DbUser {
  id: string;
  name: string;
  login: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
}

export async function findUserByLogin(login: string): Promise<DbUser | null> {
  const rows = await sql`
    SELECT id, name, login, password_hash, role, created_at
    FROM users
    WHERE login = ${login}
    LIMIT 1
  `;
  return (rows[0] as DbUser) ?? null;
}

export async function getAllUsers(): Promise<DbUser[]> {
  const rows = await sql`
    SELECT id, name, login, role, created_at
    FROM users
    ORDER BY created_at ASC
  `;
  return rows as DbUser[];
}

export async function createUser(
  name: string,
  login: string,
  passwordHash: string,
  role: UserRole
): Promise<DbUser> {
  const rows = await sql`
    INSERT INTO users (name, login, password_hash, role)
    VALUES (${name}, ${login}, ${passwordHash}, ${role})
    RETURNING id, name, login, role, created_at
  `;
  return rows[0] as DbUser;
}

export async function updateUser(
  id: string,
  fields: { name?: string; role?: UserRole; passwordHash?: string }
): Promise<void> {
  if (fields.name !== undefined) {
    await sql`UPDATE users SET name = ${fields.name} WHERE id = ${id}`;
  }
  if (fields.role !== undefined) {
    await sql`UPDATE users SET role = ${fields.role} WHERE id = ${id}`;
  }
  if (fields.passwordHash !== undefined) {
    await sql`UPDATE users SET password_hash = ${fields.passwordHash} WHERE id = ${id}`;
  }
}

export async function deleteUser(id: string): Promise<void> {
  await sql`DELETE FROM users WHERE id = ${id}`;
}

// ── Progress ───────────────────────────────────────────────────────────────

export interface ProgressEntry {
  module_id: string;
  completed_at: string;
}

export async function getProgressForUser(userId: string): Promise<ProgressEntry[]> {
  const rows = await sql`
    SELECT module_id, completed_at FROM progress
    WHERE user_id = ${userId}
    ORDER BY completed_at DESC
  `;
  return rows as ProgressEntry[];
}

export async function markModuleCompleted(userId: string, moduleId: string): Promise<void> {
  await sql`
    INSERT INTO progress (user_id, module_id)
    VALUES (${userId}, ${moduleId})
    ON CONFLICT (user_id, module_id) DO NOTHING
  `;
}

export async function unmarkModuleCompleted(userId: string, moduleId: string): Promise<void> {
  await sql`
    DELETE FROM progress WHERE user_id = ${userId} AND module_id = ${moduleId}
  `;
}
