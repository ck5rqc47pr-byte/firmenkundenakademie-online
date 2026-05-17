import type React from "react";
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

export function ModuleHeader({ module, isTrainerOrAdmin }: { module: Module; isTrainerOrAdmin?: boolean }) {
  const roman = ROMAN[module.kompetenzfeld_slug] ?? "·";
  return (
    <section className="border-b border-ink">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-content px-6 lg:px-14 py-3 border-b border-line">
        <nav className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 flex gap-3 flex-wrap">
          <Link href="/" className="hover:text-ink transition">Campus</Link>
          <span>/</span>
          <Link href={`/kompetenzfeld/${module.kompetenzfeld_slug}`} className="hover:text-ink transition">
            {module.kompetenzfeld}
          </Link>
          <span>/</span>
          <span className="text-ink">{module.id}</span>
        </nav>
      </div>
      {/* Hero */}
      <div className="mx-auto max-w-content px-6 lg:px-14 py-14 lg:py-20">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 mb-6">
          § {roman} · {module.id} · {module.dauer} · Bloom {module.bloom}
        </div>
        <h1
          className="font-serif text-5xl lg:text-7xl xl:text-[88px] font-normal leading-[0.93] tracking-[-0.035em] text-ink"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {module.title}
        </h1>
        <p className="mt-6 font-serif text-xl lg:text-2xl leading-relaxed text-ink-2 max-w-2xl">
          {module.subtitle}
        </p>
      </div>
      {/* Apparat */}
      <div className="border-t border-line bg-primary">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-5 flex flex-wrap gap-10">
          {([["Kompetenzstufe", module.stufe], ...(isTrainerOrAdmin ? [["Format", module.format]] : []), ["Bloom-Stufe", module.bloom ? `Bloom ${module.bloom}` : ""]] as [string, string][]).map(([label, val]) =>
            val ? (
              <div key={label}>
                <div className="font-serif text-lg font-normal leading-tight text-primary-ink">{val}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-primary-ink opacity-60 mt-1">{label}</div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}
