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
  bank: string | null;
  created_at: string;
}

// Mandantentrennung: idempotent eine bank-Spalte (Tenant-/Gruppen-Label)
// sicherstellen. Wie ensureSuggestionsTable einmal pro relevanter Seite aufrufen.
export async function ensureUsersBankColumn(): Promise<void> {
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS bank text`;
}

export async function findUserByLogin(login: string): Promise<DbUser | null> {
  // Selbstheilende Migration: stellt sicher, dass die bank-Spalte existiert,
  // bevor sie selektiert wird (idempotent, kein Migrations-Framework vorhanden).
  await ensureUsersBankColumn();
  const rows = await sql`
    SELECT id, name, login, password_hash, role, bank, created_at
    FROM users
    WHERE login = ${login}
    LIMIT 1
  `;
  return (rows[0] as DbUser) ?? null;
}

export async function getAllUsers(): Promise<DbUser[]> {
  const rows = await sql`
    SELECT id, name, login, role, bank, created_at
    FROM users
    ORDER BY created_at ASC
  `;
  return rows as DbUser[];
}

/** Distinkte, gesetzte Bank-/Gruppen-Labels – für Autovervollständigung im Admin. */
export async function getDistinctBanks(): Promise<string[]> {
  const rows = await sql`
    SELECT DISTINCT bank FROM users
    WHERE bank IS NOT NULL AND bank <> ''
    ORDER BY bank
  `;
  return (rows as { bank: string }[]).map((r) => r.bank);
}

export async function createUser(
  name: string,
  login: string,
  passwordHash: string,
  role: UserRole,
  bank: string | null = null
): Promise<DbUser> {
  const rows = await sql`
    INSERT INTO users (name, login, password_hash, role, bank)
    VALUES (${name}, ${login}, ${passwordHash}, ${role}, ${bank})
    RETURNING id, name, login, role, bank, created_at
  `;
  return rows[0] as DbUser;
}

export async function updateUser(
  id: string,
  fields: { name?: string; role?: UserRole; passwordHash?: string; bank?: string | null }
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
  if (fields.bank !== undefined) {
    await sql`UPDATE users SET bank = ${fields.bank} WHERE id = ${id}`;
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

// ── Quiz Results ───────────────────────────────────────────────────────────

export interface QuizResult {
  id: string;
  user_id: string;
  module_id: string;
  score: number;
  answers: Record<string, number>;
  taken_at: string;
}

export async function getLatestQuizResult(userId: string, moduleId: string): Promise<QuizResult | null> {
  const rows = await sql`
    SELECT * FROM quiz_results
    WHERE user_id = ${userId} AND module_id = ${moduleId}
    ORDER BY taken_at DESC LIMIT 1
  `;
  return (rows[0] as QuizResult) ?? null;
}

export async function saveQuizResult(
  userId: string,
  moduleId: string,
  score: number,
  answers: Record<string, number>
): Promise<void> {
  await sql`
    INSERT INTO quiz_results (user_id, module_id, score, answers)
    VALUES (${userId}, ${moduleId}, ${score}, ${JSON.stringify(answers)})
  `;
}

export interface QuizStats {
  module_id: string;
  count: number;
  avg_score: number | null;
  pass_rate: number | null;
}

export async function getQuizStats(bank: string | null = null): Promise<QuizStats[]> {
  const rows = await sql`
    SELECT
      qr.module_id,
      COUNT(*)::int AS count,
      ROUND(AVG(qr.score)::numeric, 1) AS avg_score,
      ROUND(100.0 * SUM(CASE WHEN qr.score >= 60 THEN 1 ELSE 0 END) / COUNT(*), 0) AS pass_rate
    FROM quiz_results qr
    JOIN users u ON u.id = qr.user_id
    WHERE (${bank}::text IS NULL OR u.bank = ${bank})
    GROUP BY qr.module_id
    ORDER BY qr.module_id
  `;
  return rows as QuizStats[];
}

// ── Team-Cockpit (Teamleiter-Sicht, Kirkpatrick L2/L3) ─────────────────────
// Mandantentrennung: alle Cockpit-Queries akzeptieren einen optionalen
// bank-Filter. bank = null bedeutet "kein Filter" (nur für Admin gedacht);
// für teamleiter/trainer reicht das Cockpit immer ein konkretes Label durch,
// sodass NULL-Banken (nicht zugeordnete Teilnehmer) nie mit ausgegeben werden.

export interface TeamMemberProgress {
  user_id: string;
  user_name: string;
  completed_count: number;
  last_activity: string | null;
}

export async function getTeamProgress(bank: string | null = null): Promise<TeamMemberProgress[]> {
  const rows = await sql`
    SELECT u.id AS user_id, u.name AS user_name,
           COUNT(p.module_id)::int AS completed_count,
           MAX(p.completed_at) AS last_activity
    FROM users u
    LEFT JOIN progress p ON p.user_id = u.id
    WHERE u.role = 'teilnehmer'
      AND (${bank}::text IS NULL OR u.bank = ${bank})
    GROUP BY u.id, u.name
    ORDER BY u.name
  `;
  return rows as TeamMemberProgress[];
}

export interface TeamQuizAvg {
  user_id: string;
  quiz_count: number;
  avg_best_score: number | null;
}

export async function getTeamQuizAverages(bank: string | null = null): Promise<TeamQuizAvg[]> {
  // Bester Versuch je Modul, davon der Durchschnitt je Nutzer
  const rows = await sql`
    SELECT user_id,
           COUNT(*)::int AS quiz_count,
           ROUND(AVG(best_score)::numeric, 0) AS avg_best_score
    FROM (
      SELECT qr.user_id, qr.module_id, MAX(qr.score) AS best_score
      FROM quiz_results qr
      JOIN users u ON u.id = qr.user_id
      WHERE u.role = 'teilnehmer'
        AND (${bank}::text IS NULL OR u.bank = ${bank})
      GROUP BY qr.user_id, qr.module_id
    ) best
    GROUP BY user_id
  `;
  return rows as TeamQuizAvg[];
}

export interface ModuleCompletionStat {
  module_id: string;
  completed_count: number;
}

export async function getModuleCompletionStats(bank: string | null = null): Promise<ModuleCompletionStat[]> {
  const rows = await sql`
    SELECT p.module_id, COUNT(DISTINCT p.user_id)::int AS completed_count
    FROM progress p
    JOIN users u ON u.id = p.user_id AND u.role = 'teilnehmer'
    WHERE (${bank}::text IS NULL OR u.bank = ${bank})
    GROUP BY p.module_id
    ORDER BY p.module_id
  `;
  return rows as ModuleCompletionStat[];
}

// ── Suggestions (Verbesserungsvorschläge) ─────────────────────────────────

export type SuggestionType = "inhalt" | "fehler" | "beispiel" | "sonstiges";
export type SuggestionStatus = "offen" | "in_bearbeitung" | "umgesetzt" | "abgelehnt";

export interface Suggestion {
  id: string;
  user_id: string;
  user_name: string | null;
  module_id: string;
  type: SuggestionType;
  message: string;
  status: SuggestionStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

export async function ensureSuggestionsTable(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS suggestions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id text NOT NULL,
      user_name text,
      module_id text NOT NULL,
      type text NOT NULL DEFAULT 'sonstiges',
      message text NOT NULL,
      status text NOT NULL DEFAULT 'offen',
      admin_note text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

export async function createSuggestion(
  userId: string,
  userName: string | null,
  moduleId: string,
  type: SuggestionType,
  message: string
): Promise<void> {
  await sql`
    INSERT INTO suggestions (user_id, user_name, module_id, type, message)
    VALUES (${userId}, ${userName}, ${moduleId}, ${type}, ${message})
  `;
}

export async function getAllSuggestions(): Promise<Suggestion[]> {
  const rows = await sql`
    SELECT * FROM suggestions ORDER BY created_at DESC
  `;
  return rows as Suggestion[];
}

export async function updateSuggestionStatus(
  id: string,
  status: SuggestionStatus,
  adminNote?: string
): Promise<void> {
  await sql`
    UPDATE suggestions
    SET status = ${status},
        admin_note = ${adminNote ?? null},
        updated_at = now()
    WHERE id = ${id}
  `;
}

export async function getSuggestionCounts(): Promise<{ offen: number; gesamt: number }> {
  const rows = await sql`
    SELECT
      COUNT(*)::int AS gesamt,
      COUNT(*) FILTER (WHERE status = 'offen')::int AS offen
    FROM suggestions
  `;
  return (rows[0] as { offen: number; gesamt: number }) ?? { offen: 0, gesamt: 0 };
}

// ── Competence Assessment ──────────────────────────────────────────────────

export interface CompetenceEntry {
  field_slug: string;
  self_score: number;
  updated_at: string;
}

export async function getAssessmentForUser(userId: string): Promise<CompetenceEntry[]> {
  const rows = await sql`
    SELECT field_slug, self_score, updated_at
    FROM competence_assessment
    WHERE user_id = ${userId}
  `;
  return rows as CompetenceEntry[];
}

export async function upsertAssessment(
  userId: string,
  scores: Record<string, number>
): Promise<void> {
  for (const [field_slug, self_score] of Object.entries(scores)) {
    await sql`
      INSERT INTO competence_assessment (user_id, field_slug, self_score)
      VALUES (${userId}, ${field_slug}, ${self_score})
      ON CONFLICT (user_id, field_slug) DO UPDATE SET
        self_score = EXCLUDED.self_score,
        updated_at = now()
    `;
  }
}

export async function getFeedbackStats(): Promise<FeedbackStats[]> {
  // Wichtig: numeric/ROUND kommt über @neondatabase/serverless sonst als String
  // zurück (Präzisionsschutz). Cast auf float8 → echte JS-Zahl (sonst bricht
  // z. B. value.toFixed(1) im Admin-Frontend mit einer Server-Exception).
  const rows = await sql`
    SELECT
      module_id,
      COUNT(*)::int AS count,
      ROUND(AVG(rating_inhalt)::numeric, 1)::float8 AS avg_inhalt,
      ROUND(AVG(rating_tempo)::numeric, 1)::float8 AS avg_tempo,
      ROUND(AVG(rating_praxis)::numeric, 1)::float8 AS avg_praxis,
      ROUND(AVG(rating_material)::numeric, 1)::float8 AS avg_material,
      ROUND(AVG(rating_gesamt)::numeric, 1)::float8 AS avg_gesamt
    FROM feedback
    GROUP BY module_id
    ORDER BY module_id
  `;
  return rows as FeedbackStats[];
}
