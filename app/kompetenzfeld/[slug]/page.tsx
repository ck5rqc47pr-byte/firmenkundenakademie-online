import { notFound } from "next/navigation";
import { ModuleCard } from "@/components/ModuleCard";
import { getAllModules, getModulesByKompetenzfeld } from "@/lib/modules";

type Props = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return Array.from(
    new Set(getAllModules().map((module) => module.kompetenzfeld_slug)),
  ).map((slug) => ({ slug }));
}

export default function KompetenzfeldPage({ params }: Props) {
  const modules = getModulesByKompetenzfeld(params.slug);
  if (!modules.length) {
    notFound();
  }

  const stufen = ["Berater", "Sparringspartner", "Stratege"];

  return (
    <div>
      {/* Header */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-16 lg:py-20">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 mb-6">
            § Kompetenzfeld
          </div>
          <h1 className="font-serif text-5xl lg:text-7xl font-normal leading-[0.93] tracking-[-0.035em] text-ink">
            {modules[0].kompetenzfeld}
          </h1>
          <p className="mt-6 font-serif text-xl leading-relaxed text-ink-2 max-w-2xl">
            {modules.length} Module mit klarer Entwicklungslogik vom Einstieg bis zur
            strategischen Beratung.
          </p>
        </div>
        {/* Stufen badges */}
        <div className="border-t border-line bg-bg-2">
          <div className="mx-auto max-w-content px-6 lg:px-14 py-4 flex gap-6">
            {stufen.map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module grid */}
      <div className="mx-auto max-w-content">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-ink">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </div>
    </div>
  );
}
