import Link from "next/link";
import { getAllModules, getKompetenzfelder } from "@/lib/modules";
import { ModuleCard } from "@/components/ModuleCard";

const MANIFEST = [
  ["I.", "Aus der Praxis.", "Wer schreibt, hat den Kunden gestern noch beraten."],
  ["II.", "Fundiert.", "Jeder Befund mit Studie. Jeder Satz mit Quelle."],
  ["III.", "Genossenschaftlich.", "Mitgliederlogik, Region, langfristige Beziehung."],
  ["IV.", "Ihr Tempo.", "Lesen, wann es passt. Tief genug, um zu überzeugen."],
];

export default function HomePage() {
  const modules = getAllModules().slice(0, 3);
  const felder = getKompetenzfelder();

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-content px-6 lg:px-14 pt-16 pb-14 border-b border-ink">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 mb-8">
          FKB CAMPUS · FIRMENKUNDENAKADEMIE · VR-BANKEN
        </div>
        <h1
          className="font-serif text-6xl lg:text-8xl xl:text-[112px] font-normal leading-[0.92] tracking-[-0.04em]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Die digitale<br />
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
            Firmen&shy;kunden&shy;akademie
          </em>
          <br />
          für VR-Banken.
        </h1>
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="font-serif text-xl leading-relaxed text-ink-2 max-w-xl">
            Entwickelt aus der Praxis. Fundiert auf Forschung. Geschrieben für Berater:innen,
            die mehr wollen als ein Webinar zwischen zwei Terminen.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/module"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] bg-ink text-bg px-6 py-3 hover:bg-ink-2 transition"
            >
              Programm ansehen →
            </Link>
            <Link
              href="/kompetenzmodell"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] border border-ink text-ink px-6 py-3 hover:bg-bg-2 transition"
            >
              Kompetenzmodell
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-bg-2">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-8 grid grid-cols-3 gap-8 lg:grid-cols-6">
          {(
            [
              ["21", "Module"],
              ["6", "Kompetenzfelder"],
              ["3", "Stufen"],
              ["Bloom 1–6", "Taxonomie"],
              ["APA 7", "Zitierstandard"],
              ["MaRisk", "Regulatorik"],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div key={v}>
              <div className="font-serif text-2xl font-normal leading-tight tracking-[-0.02em]">
                {k}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3 mt-1">
                {v}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Manifest */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-content px-6 lg:px-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-ink">
            {MANIFEST.map(([n, t, d], i) => (
              <div
                key={n}
                style={{
                  background: i === 1 ? "var(--primary)" : undefined,
                  color: i === 1 ? "var(--primary-ink)" : undefined,
                }}
                className="p-10 border-b border-r border-line min-h-[280px] flex flex-col"
              >
                <div
                  className="font-serif text-5xl italic leading-[0.9]"
                  style={{ color: i === 1 ? "var(--accent)" : "var(--primary)" }}
                >
                  {n}
                </div>
                <h3 className="font-serif text-2xl font-normal tracking-[-0.02em] mt-6 mb-3">
                  {t}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: i === 1 ? "oklch(0.85 0.02 240)" : "var(--ink-2)",
                  }}
                >
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kompetenzfelder */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-16">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 mb-6">
            § Kompetenzfelder
          </div>
          <h2 className="font-serif text-4xl lg:text-6xl font-normal leading-tight tracking-[-0.03em] mb-12">
            Sechs Felder.{" "}
            <em style={{ fontStyle: "italic", color: "var(--primary)" }}>Ihr Lernpfad.</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-ink">
            {felder.map((f) => (
              <Link
                key={f.slug}
                href={`/kompetenzfeld/${f.slug}`}
                className="group p-8 border-b border-r border-line hover:bg-bg-2 transition flex flex-col gap-2"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-primary">
                  {f.count} Module
                </div>
                <div className="font-serif text-xl font-[500] leading-tight text-ink group-hover:text-primary transition">
                  {f.name}
                </div>
                <div className="font-mono text-[11px] text-ink-3 mt-auto pt-4">Entdecken →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Empfohlene Module */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-16">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-3xl font-normal tracking-[-0.02em]">
              Empfohlene Module.
            </h2>
            <Link
              href="/module"
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 hover:text-ink transition"
            >
              Alle ansehen →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-ink">
            {modules.map((m) => (
              <ModuleCard key={m.id} module={m} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
