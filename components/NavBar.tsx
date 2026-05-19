"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const NAV_START = [
  { href: "/", label: "Campus" },
];

const NAV_END = [
  { href: "/kompetenzmodell", label: "Kompetenzmodell" },
  { href: "/module", label: "Programm" },
  { href: "/quellen", label: "Quellen" },
];

const LERNREISE_NAV = { href: "/kompass", label: "Kompass" };
const TRAINER_NAV = { href: "/trainer", label: "Trainer" };
const ADMIN_NAV = { href: "/admin", label: "Admin" };

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  trainer: "Trainer",
  teilnehmer: "Teilnehmer",
};

export function NavBar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role ?? "";

  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-bg">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5 lg:px-14">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-sans text-sm font-semibold tracking-tight text-ink"
          onClick={() => setOpen(false)}
        >
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden>
            <rect x="2" y="2" width="18" height="3" fill="currentColor"/>
            <rect x="2" y="7" width="12" height="3" fill="currentColor" opacity="0.5"/>
            <rect x="2" y="12" width="18" height="3" fill="currentColor"/>
            <rect x="2" y="17" width="8" height="3" fill="currentColor" opacity="0.5"/>
          </svg>
          FKB <span className="font-normal text-ink-2 ml-1">Campus</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_START.map(item => (
            <Link key={item.href} href={item.href}
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 transition hover:text-ink">
              {item.label}
            </Link>
          ))}
          {session && (
            <Link
              href={LERNREISE_NAV.href}
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 transition hover:text-ink"
            >
              {LERNREISE_NAV.label}
            </Link>
          )}
          {NAV_END.map(item => (
            <Link key={item.href} href={item.href}
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 transition hover:text-ink">
              {item.label}
            </Link>
          ))}
          {(role === "trainer" || role === "admin") && (
            <Link
              href={TRAINER_NAV.href}
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent transition hover:text-accent/80"
            >
              {TRAINER_NAV.label}
            </Link>
          )}
          {role === "admin" && (
            <Link
              href={ADMIN_NAV.href}
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent transition hover:text-accent/80"
            >
              {ADMIN_NAV.label}
            </Link>
          )}
        </nav>

        {/* Session info + Logout (Desktop) */}
        {session && (
          <div className="hidden md:flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
              {session.user?.name ?? session.user?.email}
              {role && (
                <span className="ml-1.5 text-accent">· {ROLE_LABEL[role] ?? role}</span>
              )}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 hover:text-ink transition"
            >
              Abmelden
            </button>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          className="md:hidden font-mono text-xl text-ink leading-none px-1"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setOpen(o => !o)}
        >
          {open ? "✕" : "≡"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-ink bg-bg">
          <nav className="mx-auto max-w-content px-6 py-4 flex flex-col gap-5">
            {NAV_START.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 hover:text-ink transition"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {session && (
              <Link
                href={LERNREISE_NAV.href}
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 hover:text-ink transition"
                onClick={() => setOpen(false)}
              >
                {LERNREISE_NAV.label}
              </Link>
            )}
            {NAV_END.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 hover:text-ink transition"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {(role === "trainer" || role === "admin") && (
              <Link
                href={TRAINER_NAV.href}
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent hover:text-accent/80 transition"
                onClick={() => setOpen(false)}
              >
                {TRAINER_NAV.label}
              </Link>
            )}
            {role === "admin" && (
              <Link
                href={ADMIN_NAV.href}
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent hover:text-accent/80 transition"
                onClick={() => setOpen(false)}
              >
                {ADMIN_NAV.label}
              </Link>
            )}
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-left font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 hover:text-ink transition"
              >
                Abmelden ({session.user?.name ?? session.user?.email})
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
