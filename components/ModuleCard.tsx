import Link from "next/link";
import type { Module } from "@/lib/modules";

const ROMAN: Record<string, string> = {
  finanzanalyse: "I",
  branchenwissen: "II",
  gespraechsfuehrung: "III",
  vertrieb: "IV",
  digital: "V",
  fuehrung: "VI",
};

export function ModuleCard({ module }: { module: Module }) {
  const roman = ROMAN[module.kompetenzfeld_slug] ?? "·";
  const isNew = module.version?.startsWith("v0.1");
  return (
    <Link
      href={`/module/${module.id}`}
      className="group flex flex-col p-6 border-b border-r border-line min-h-[200px] transition hover:bg-bg-2 relative overflow-hidden"
    >
      {isNew && (
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: "var(--accent)" }}
        />
      )}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-primary">
          § {roman} · {module.id}
        </span>
        <div className="flex items-center gap-2">
          {isNew && (
            <span
              className="font-mono text-[9px] uppercase tracking-[0.06em] px-1.5 py-0.5 leading-none"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              Neu
            </span>
          )}
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">
            {module.stufe === "Sparringspartner" ? "Sparring" : module.stufe}
          </span>
        </div>
      </div>
      <h3 className="font-serif text-xl leading-tight tracking-[-0.01em] text-ink font-[500] flex-1 group-hover:text-primary transition-colors">
        {module.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-3 line-clamp-2">{module.subtitle}</p>
      <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">{module.dauer}</span>
        <span className="font-mono text-[12px] text-ink-3 group-hover:text-ink transition">→</span>
      </div>
    </Link>
  );
}
