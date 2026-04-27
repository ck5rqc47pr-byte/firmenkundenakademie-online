import { notFound } from "next/navigation";
import { LernpfadVisualisierung } from "@/components/LernpfadVisualisierung";
import { ModuleCard } from "@/components/ModuleCard";
import { getAllModules, getModulesByKompetenzfeld } from "@/lib/modules";

type Props = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return Array.from(new Set(getAllModules().map((module) => module.kompetenzfeld_slug))).map(
    (slug) => ({ slug }),
  );
}

export default function KompetenzfeldPage({ params }: Props) {
  const modules = getModulesByKompetenzfeld(params.slug);
  if (!modules.length) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] bg-white p-6 shadow-card lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Kompetenzfeld</p>
        <h1 className="mt-3 text-4xl font-semibold text-primary">{modules[0].kompetenzfeld}</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          Alle zugeordneten Module im Feld {modules[0].kompetenzfeld} mit klarer
          Entwicklungslogik vom Einstieg bis zur strategischen Beratung.
        </p>
      </section>

      <LernpfadVisualisierung current={modules[0].stufe} />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </section>
    </div>
  );
}
