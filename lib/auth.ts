import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByLogin, type UserRole } from "./db";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "Benutzername", type: "text" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) return null;

        const user = await findUserByLogin(credentials.login);
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.login, role: user.role, bank: user.bank };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: UserRole }).role;
        token.uid = user.id;
        token.bank = (user as { bank?: string | null }).bank ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: UserRole; id?: string }).role = token.role as UserRole;
        (session.user as { id?: string }).id = token.uid as string;
        (session.user as { bank?: string | null }).bank = (token.bank as string | null) ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

/** Liefert die aktuelle Rolle aus der Session (oder "" wenn nicht eingeloggt). */
export async function getSessionRole(): Promise<string> {
  const session = await getServerSession(authOptions);
  return (session?.user as { role?: string } | undefined)?.role ?? "";
}

/**
 * Wirft einen Fehler, wenn der aktuelle Nutzer kein Admin ist.
 * In Server Actions verwenden, um privilegierte Mutationen abzusichern.
 */
export async function requireAdmin(): Promise<void> {
  const role = await getSessionRole();
  if (role !== "admin") {
    throw new Error("Nicht autorisiert: Adminrechte erforderlich.");
  }
}
