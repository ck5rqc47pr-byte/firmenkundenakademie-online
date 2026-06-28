"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

// Öffentlich sichtbar (immer) – primäre Einstiegspunkte.
// Startseite (/) ist über das Logo erreichbar (kein „Für Banken"-Eintrag).
// Team liegt im Footer (Über-uns-Seite); Leitbild bleibt bewusst in der Top-Nav.
const NAV_PUBLIC = [
  { href: "/module",          label: "Campus" },
  { href: "/kompetenzmodell", label: "Kompetenzmodell" },
  { href: "/prinzipien",      label: "Prinzipien" },
  { href: "/leitbild",        label: "Leitbild" },
];

// Nur für eingeloggte Nutzer (Mitte). Zertifikate liegt im Nutzer-Menü rechts.
const NAV_AUTH = [
  { href: "/kompass", label: "Kompass" },
];

// Im Nutzer-Menü (rechts, am Namen) für eingeloggte Nutzer.
const USER_MENU = [
  { href: "/zertifikate", label: "Zertifikate" },
];

// Management-Bereiche, gebündelt im Dropdown „Verwaltung" (je nach Rolle gefiltert).
const MGMT_ALL = [
  { href: "/cockpit", label: "Cockpit", roles: ["teamleiter", "trainer", "admin"] },
  { href: "/trainer", label: "Trainer", roles: ["trainer", "admin"] },
  { href: "/admin",   label: "Admin",   roles: ["admin"] },
];

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  trainer: "Trainer",
  teilnehmer: "Teilnehmer",
  teamleiter: "Teamleiter",
};

const linkCls =
  "font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 transition hover:text-ink";
const accentCls =
  "font-mono text-[11px] uppercase tracking-[0.08em] text-accent transition hover:text-accent/80";

export function NavBar() {
  const [open, setOpen] = useState(false);          // Mobile-Menü
  const [verwaltungOpen, setVerwaltungOpen] = useState(false); // Desktop-Dropdown Verwaltung
  const [userOpen, setUserOpen] = useState(false);  // Desktop-Dropdown Nutzer
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role ?? "";

  const mgmtItems = MGMT_ALL.filter(item => item.roles.includes(role));
  const closeDesktop = () => { setVerwaltungOpen(false); setUserOpen(false); };

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
          {NAV_PUBLIC.map(item => (
            <Link key={item.href} href={item.href} className={linkCls}>
              {item.label}
            </Link>
          ))}
          {session && NAV_AUTH.map(item => (
            <Link key={item.href} href={item.href} className={linkCls}>
              {item.label}
            </Link>
          ))}
          {mgmtItems.length > 0 && (
            <div className="relative">
              <button
                onClick={() => { setVerwaltungOpen(o => !o); setUserOpen(false); }}
                className={`${accentCls} flex items-center gap-1`}
                aria-expanded={verwaltungOpen}
              >
                Verwaltung <span className="text-[8px]">▾</span>
              </button>
              {verwaltungOpen && (
                <div className="absolute left-0 mt-3 min-w-[150px] border border-ink bg-bg z-50 flex flex-col">
                  {mgmtItems.map(item => (
                    <Link key={item.href} href={item.href}
                      className={`${accentCls} px-4 py-2.5 hover:bg-bg-2`}
                      onClick={closeDesktop}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Rechte Seite: Login-CTA oder Nutzer-Menü */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="relative">
              <button
                onClick={() => { setUserOpen(o => !o); setVerwaltungOpen(false); }}
                className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 hover:text-ink transition"
                aria-expanded={userOpen}
              >
                {session.user?.name ?? session.user?.email}
                {role && <span className="ml-1.5 text-accent">· {ROLE_LABEL[role] ?? role}</span>}
                <span className="text-[8px] ml-0.5">▾</span>
              </button>
              {userOpen && (
                <div className="absolute right-0 mt-3 min-w-[160px] border border-ink bg-bg z-50 flex flex-col">
                  {USER_MENU.map(item => (
                    <Link key={item.href} href={item.href}
                      className={`${linkCls} px-4 py-2.5 hover:bg-bg-2`}
                      onClick={closeDesktop}>
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { closeDesktop(); signOut({ callbackUrl: "/login" }); }}
                    className="text-left font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 hover:text-ink transition px-4 py-2.5 border-t border-line"
                  >
                    Abmelden
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="font-mono text-[11px] uppercase tracking-[0.08em] px-4 py-2 bg-ink text-bg hover:bg-ink-2 transition"
            >
              Anmelden
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden font-mono text-xl text-ink leading-none px-1"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setOpen(o => !o)}
        >
          {open ? "✕" : "≡"}
        </button>
      </div>

      {/* Backdrop schließt Desktop-Dropdowns bei Klick außerhalb */}
      {(verwaltungOpen || userOpen) && (
        <div className="fixed inset-0 z-40 hidden md:block" onClick={closeDesktop} aria-hidden />
      )}

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-ink bg-bg">
          <nav className="mx-auto max-w-content px-6 py-4 flex flex-col gap-5">
            {/* Öffentliche Links */}
            {NAV_PUBLIC.map(item => (
              <Link key={item.href} href={item.href} className={`${linkCls} hover:text-ink`}
                onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            {/* Auth-Links */}
            {session && NAV_AUTH.map(item => (
              <Link key={item.href} href={item.href} className={`${linkCls} hover:text-ink`}
                onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            {/* Verwaltung (gruppiert) */}
            {mgmtItems.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-line pt-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-3">Verwaltung</span>
                {mgmtItems.map(item => (
                  <Link key={item.href} href={item.href} className={`${accentCls} hover:text-accent/80`}
                    onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
            {/* Nutzer-Bereich */}
            <div className="border-t border-line pt-3 flex flex-col gap-4">
              {session ? (
                <>
                  {USER_MENU.map(item => (
                    <Link key={item.href} href={item.href} className={`${linkCls} hover:text-ink`}
                      onClick={() => setOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="text-left font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 hover:text-ink transition"
                  >
                    Abmelden · {session.user?.name ?? session.user?.email}
                  </button>
                </>
              ) : (
                <Link href="/login"
                  className="font-mono text-[11px] uppercase tracking-[0.08em] px-4 py-2 bg-ink text-bg inline-block"
                  onClick={() => setOpen(false)}>
                  Anmelden
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
