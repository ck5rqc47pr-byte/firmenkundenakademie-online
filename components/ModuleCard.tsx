import Link from "next/link";
import type { Module } from "@/lib/modules";

const ROMAN: Record<string, string> = {
  finanzanalyse: "I",
  branchenwissen: "II",
  gespraechsfuehrung: "III",
  vertrieb: "IV",
  digital: "V",
  fuehrung: "VI",
  // Vertriebsassistenz-Track (K-A00…K-A05)
  "k-a00": "A0",
  "k-a01": "A1",
  "k-a02": "A2",
  "k-a03": "A3",
  "k-a04": "A4",
  "k-a05": "A5",
  "k-a06": "A6",
};

export function ModuleCard({ module }: { module: Module }) {
  const roman = ROMAN[module.kompetenzfeld_slug] ?? "·";
  return (
    <Link
      href={`/module/${module.id}`}
      className="group flex flex-col p-6 border-b border-r border-line min-h-[200px] transition hover:bg-bg-2 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-primary">
          § {roman} · {module.id}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">
          {module.stufe === "Sparringspartner" ? "Sparring" : module.stufe}
        </span>
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
