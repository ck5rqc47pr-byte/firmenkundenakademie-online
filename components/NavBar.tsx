import Link from "next/link";

const NAV = [
  { href: "/", label: "Campus" },
  { href: "/module", label: "Programm" },
  { href: "/kompetenzmodell", label: "Kompetenzmodell" },
  { href: "/quellen", label: "Quellen" },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-bg">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5 lg:px-14">
        <Link href="/" className="flex items-center gap-2.5 font-sans text-sm font-semibold tracking-tight text-ink">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden>
            <rect x="2" y="2" width="18" height="3" fill="currentColor"/>
            <rect x="2" y="7" width="12" height="3" fill="currentColor" opacity="0.5"/>
            <rect x="2" y="12" width="18" height="3" fill="currentColor"/>
            <rect x="2" y="17" width="8" height="3" fill="currentColor" opacity="0.5"/>
          </svg>
          FKB <span className="font-normal text-ink-2 ml-1">Campus</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <span className="font-mono text-xl md:hidden">≡</span>
      </div>
    </header>
  );
}
