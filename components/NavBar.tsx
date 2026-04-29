import Link from "next/link";

const navigation = [
  { href: "/", label: "Start" },
  { href: "/module", label: "Module" },
  { href: "/kompetenzmodell", label: "Modell", labelFull: "Kompetenzmodell" },
  { href: "/quellen", label: "Quellen" },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white sm:h-11 sm:w-11 sm:rounded-2xl sm:text-base">
            FKA
          </span>
          {/* Brand text: hidden on xs, visible from sm */}
          <div className="hidden sm:block">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Benedikt Zoller Coaching
            </p>
            <p className="text-lg font-semibold text-ink">Firmenkundenakademie</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-0.5 sm:gap-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-primary sm:px-4 sm:py-2 sm:text-sm"
            >
              {/* Show abbreviated label on mobile, full label on sm+ */}
              <span className="sm:hidden">{item.label}</span>
              <span className="hidden sm:inline">{item.labelFull ?? item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
