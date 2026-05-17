import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getAllUsers, type UserRole } from "@/lib/db";
import { actionCreateUser, actionUpdateRole, actionResetPassword, actionDeleteUser } from "./actions";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  trainer: "Trainer",
  teamleiter: "Teamleiter",
  teilnehmer: "Teilnehmer",
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-red-50 text-red-700 border-red-200",
  trainer: "bg-amber-50 text-amber-700 border-amber-200",
  teamleiter: "bg-violet-50 text-violet-700 border-violet-200",
  teilnehmer: "bg-blue-50 text-blue-700 border-blue-200",
};

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? "";
  if (!session || role !== "admin") redirect("/login?callbackUrl=/admin/users");

  const users = await getAllUsers();

  return (
    <div className="min-h-screen bg-bg-2">
      {/* Header */}
      <div className="bg-primary border-b border-ink">
        <div className="max-w-[1000px] mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 mb-1">
              Admin-Konsole
            </div>
            <h1 className="font-serif text-2xl font-normal text-white tracking-[-0.02em]">
              Nutzerverwaltung
            </h1>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors">
              ← Modulübersicht
            </Link>
            <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors">
              Akademie →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-8 py-10 space-y-10">

        {/* Nutzerliste */}
        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 font-semibold mb-4">
            Aktive Nutzer ({users.length})
          </h2>
          <div className="bg-white border border-line rounded overflow-hidden">
            {/* Kopfzeile */}
            <div className="grid grid-cols-[1fr_140px_120px_160px_160px] bg-primary text-white font-mono text-[10px] uppercase tracking-[0.08em]">
              {["Name / Login", "Rolle", "Erstellt", "Rolle ändern", "Aktionen"].map((h) => (
                <div key={h} className="px-4 py-3">{h}</div>
              ))}
            </div>

            {users.map((u, i) => (
              <div
                key={u.id}
                className={`grid grid-cols-[1fr_140px_120px_160px_160px] border-t border-line items-center ${i % 2 === 0 ? "bg-white" : "bg-bg-2"}`}
              >
                {/* Name / Login */}
                <div className="px-4 py-3">
                  <div className="text-sm font-medium text-ink">{u.name}</div>
                  <div className="font-mono text-[10px] text-ink-3 mt-0.5">{u.login}</div>
                </div>

                {/* Rolle */}
                <div className="px-4 py-3">
                  <span className={`font-mono text-[10px] uppercase tracking-[0.05em] px-2 py-0.5 border rounded ${ROLE_COLORS[u.role]}`}>
                    {ROLE_LABELS[u.role]}
                  </span>
                </div>

                {/* Erstellt */}
                <div className="px-4 py-3">
                  <span className="font-mono text-[10px] text-ink-3">
                    {new Date(u.created_at).toLocaleDateString("de-DE")}
                  </span>
                </div>

                {/* Rolle ändern */}
                <div className="px-4 py-3">
                  <form action={actionUpdateRole} className="flex gap-1.5">
                    <input type="hidden" name="id" value={u.id} />
                    <select
                      name="role"
                      defaultValue={u.role}
                      className="font-mono text-[10px] border border-line px-2 py-1 bg-white text-ink flex-1 min-w-0"
                    >
                      <option value="teilnehmer">Teilnehmer</option>
                      <option value="teamleiter">Teamleiter</option>
                      <option value="trainer">Trainer</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      type="submit"
                      className="font-mono text-[10px] uppercase tracking-[0.06em] px-2 py-1 bg-primary text-white hover:opacity-80 transition shrink-0"
                    >
                      OK
                    </button>
                  </form>
                </div>

                {/* Aktionen */}
                <div className="px-4 py-3 flex gap-2">
                  {/* Passwort zurücksetzen */}
                  <form action={actionResetPassword} className="flex gap-1">
                    <input type="hidden" name="id" value={u.id} />
                    <input
                      type="text"
                      name="password"
                      placeholder="Neues PW"
                      className="font-mono text-[10px] border border-line px-2 py-1 w-20 bg-white"
                    />
                    <button
                      type="submit"
                      className="font-mono text-[10px] uppercase tracking-[0.06em] px-2 py-1 border border-line text-ink-2 hover:border-primary hover:text-primary transition"
                    >
                      PW
                    </button>
                  </form>

                  {/* Löschen */}
                  <form action={actionDeleteUser}>
                    <input type="hidden" name="id" value={u.id} />
                    <button
                      type="submit"
                      className="font-mono text-[10px] uppercase tracking-[0.06em] px-2 py-1 border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                      onClick={(e) => {
                        if (!confirm(`${u.name} wirklich löschen?`)) e.preventDefault();
                      }}
                    >
                      ✕
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Neuen Nutzer anlegen */}
        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 font-semibold mb-4">
            Neuen Nutzer anlegen
          </h2>
          <div className="bg-white border border-line rounded p-6">
            <form action={actionCreateUser} className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Max Mustermann"
                  className="border border-line px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                  Benutzername (Login)
                </label>
                <input
                  type="text"
                  name="login"
                  required
                  placeholder="mmustermann"
                  className="border border-line px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                  Passwort (mind. 8 Zeichen)
                </label>
                <input
                  type="text"
                  name="password"
                  required
                  minLength={8}
                  placeholder="Campus2026!"
                  className="border border-line px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                  Rolle
                </label>
                <select
                  name="role"
                  className="border border-line px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-primary"
                >
                  <option value="teilnehmer">Teilnehmer</option>
                  <option value="teamleiter">Teamleiter</option>
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="col-span-2">
                <button
                  type="submit"
                  className="font-mono text-[11px] uppercase tracking-[0.08em] px-6 py-3 bg-primary text-white hover:opacity-90 transition"
                >
                  Nutzer anlegen →
                </button>
              </div>
            </form>
          </div>
        </section>

      </div>
    </div>
  );
}
