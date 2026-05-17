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

// ── Feedback ───────────────────────────────────────────────────────────────

export interface FeedbackEntry {
  id: string;
  user_id: string;
  module_id: string;
  rating_inhalt: number | null;
  rating_tempo: number | null;
  rating_praxis: number | null;
  rating_material: number | null;
  rating_gesamt: number | null;
  kommentar: string | null;
  submitted_at: string;
}

export async function getFeedbackForUser(userId: string, moduleId: string): Promise<FeedbackEntry | null> {
  const rows = await sql`
    SELECT * FROM feedback WHERE user_id = ${userId} AND module_id = ${moduleId} LIMIT 1
  `;
  return (rows[0] as FeedbackEntry) ?? null;
}

export async function upsertFeedback(
  userId: string,
  moduleId: string,
  ratings: { inhalt: number; tempo: number; praxis: number; material: number; gesamt: number },
  kommentar: string
): Promise<void> {
  await sql`
    INSERT INTO feedback (user_id, module_id, rating_inhalt, rating_tempo, rating_praxis, rating_material, rating_gesamt, kommentar)
    VALUES (${userId}, ${moduleId}, ${ratings.inhalt}, ${ratings.tempo}, ${ratings.praxis}, ${ratings.material}, ${ratings.gesamt}, ${kommentar})
    ON CONFLICT (user_id, module_id) DO UPDATE SET
      rating_inhalt = EXCLUDED.rating_inhalt,
      rating_tempo = EXCLUDED.rating_tempo,
      rating_praxis = EXCLUDED.rating_praxis,
      rating_material = EXCLUDED.rating_material,
      rating_gesamt = EXCLUDED.rating_gesamt,
      kommentar = EXCLUDED.kommentar,
      submitted_at = now()
  `;
}

export interface FeedbackStats {
  module_id: string;
  count: number;
  avg_inhalt: number | null;
  avg_tempo: number | null;
  avg_praxis: number | null;
  avg_material: number | null;
  avg_gesamt: number | null;
}

export async function getFeedbackStats(): Promise<FeedbackStats[]> {
  const rows = await sql`
    SELECT
      module_id,
      COUNT(*)::int AS count,
      ROUND(AVG(rating_inhalt)::numeric, 1) AS avg_inhalt,
      ROUND(AVG(rating_tempo)::numeric, 1) AS avg_tempo,
      ROUND(AVG(rating_praxis)::numeric, 1) AS avg_praxis,
      ROUND(AVG(rating_material)::numeric, 1) AS avg_material,
      ROUND(AVG(rating_gesamt)::numeric, 1) AS avg_gesamt
    FROM feedback
    GROUP BY module_id
    ORDER BY module_id
  `;
  return rows as FeedbackStats[];
}
