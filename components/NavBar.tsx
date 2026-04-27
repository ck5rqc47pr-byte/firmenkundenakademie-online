import Link from "next/link";

const navigation = [
  { href: "/", label: "Start" },
  { href: "/module", label: "Module" },
  { href: "/kompetenzmodell", label: "Kompetenzmodell" },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary font-bold text-white">
            FKA
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Benedikt Zoller Coaching
            </p>
            <p className="text-lg font-semibold text-ink">Firmenkundenakademie</p>
          </div>
        </Link>
        <nav className="flex items-center gap-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
