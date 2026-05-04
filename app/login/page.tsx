"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      login,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Benutzername oder Passwort falsch.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-accent">
            Firmenkundenakademie
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-primary">
            Campus Login
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            Bitte melde dich mit deinen Zugangsdaten an.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.1em] text-ink-2 mb-1.5">
              Benutzername
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              autoComplete="username"
              className="w-full border border-ink px-4 py-2.5 text-sm bg-white text-ink focus:outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.1em] text-ink-2 mb-1.5">
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-ink px-4 py-2.5 text-sm bg-white text-ink focus:outline-none focus:border-primary transition"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-mono text-[11px] uppercase tracking-[0.1em] py-3 hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? "Anmelden…" : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
