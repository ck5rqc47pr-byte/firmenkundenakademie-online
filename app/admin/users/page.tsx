import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getAllUsers, type UserRole } from "@/lib/db";
import { actionCreateUser, actionUpdateRole, actionResetPassword } from "./actions";
import { DeleteUserButton } from "./DeleteUserButton";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<UserRole, string> = {
  admin:       "Admin",
  trainer:     "Trainer",
  teamleiter:  "Teamleiter",
  teilnehmer:  "Teilnehmer",
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin:      "bg-red-50 text-red-700 border-red-200",
  trainer:    "bg-amber-50 text-amber-700 border-amber-200",
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
        <div className="max-w-[1000px] mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 mb-1">
              Admin-Konsole
            </div>
            <h1 className="font-serif text-2xl font-normal text-white tracking-[-0.02em]">
              Nutzerverwaltung
            </h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin" className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors">
              ← Modulübersicht
            </Link>
            <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors">
              Akademie →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* Nutzerliste */}
        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 font-semibold mb-4">
            Aktive Nutzer ({users.length})
          </h2>
          <div className="bg-white border border-line overflow-hidden">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[minmax(120px,1fr)_120px_90px_150px_150px] min-w-[640px] bg-primary text-white font-mono text-[10px] uppercase tracking-[0.08em]">
                {["Name / Login", "Rolle", "Erstellt", "Rolle ändern", "Aktionen"].map((h) => (
                  <div key={h} className="px-4 py-3">{h}</div>
                ))}
              </div>
              {users.map((u, i) => (
                <div
                  key={u.id}
                  className={`grid grid-cols-[minmax(120px,1fr)_120px_90px_150px_150px] min-w-[640px] border-t border-line items-center ${i % 2 === 0 ? "bg-white" : "bg-bg-2"}`}
                >
                  <div className="px-4 py-3">
                    <div className="text-sm font-medium text-ink">{u.name}</div>
                    <div className="font-mono text-[10px] text-ink-3 mt-0.5">{u.login}</div>
                  </div>
                  <div className="px-4 py-3">
                    <span className={`font-mono text-[10px] uppercase tracking-[0.05em] px-2 py-0.5 border ${ROLE_COLORS[u.role]}`}>
                      {ROLE_LABELS[u.role]}
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="font-mono text-[10px] text-ink-3">
                      {new Date(u.created_at).toLocaleDateString("de-DE")}
                    </span>
                  </div>
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
                  <div className="px-4 py-3 flex gap-2">
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
                    <DeleteUserButton id={u.id} name={u.name} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Neuen Nutzer anlegen */}
        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 font-semibold mb-4">
            Neuen Nutzer anlegen
          </h2>
          <div className="bg-white border border-line p-5 sm:p-6">
            <form action={actionCreateUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">Name</label>
                <input
                  type="text" name="name" required placeholder="Max Mustermann"
                  className="border border-line px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">Benutzername (Login)</label>
                <input
                  type="text" name="login" required placeholder="mmustermann"
                  className="border border-line px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-primary font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">Passwort (mind. 8 Zeichen)</label>
                <input
                  type="text" name="password" required minLength={8} placeholder="Campus2026!"
                  className="border border-line px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-primary font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">Rolle</label>
                <select name="role" className="border border-line px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-primary">
                  <option value="teilnehmer">Teilnehmer</option>
                  <option value="teamleiter">Teamleiter</option>
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="font-mono text-[11px] uppercase tracking-[0.08em] px-6 py-3 bg-primary text-white hover:opacity-90 transition">
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
