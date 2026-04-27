import { Suspense } from "react";
import { FilterBar } from "@/components/FilterBar";
import { ModuleGrid } from "@/components/ModuleGrid";
import { getAllModules, getKompetenzfelder } from "@/lib/modules";

export default function ModulesPage() {
  const modules = getAllModules();
  const kompetenzfelder = getKompetenzfelder();

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] bg-white p-6 shadow-card lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Modulübersicht</p>
        <h1 className="mt-3 text-4xl font-semibold text-primary">Alle Module im Überblick</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          Filtern Sie nach Kompetenzfeld, Entwicklungsstufe und Status, um passende
          Weiterbildungsmodule für Ihre aktuelle Beratungssituation zu finden.
        </p>
      </section>

      <Suspense fallback={null}>
        <FilterBar
          kompetenzfelder={kompetenzfelder.map((field) => ({ slug: field.slug, name: field.name }))}
        />
      </Suspense>

      <Suspense fallback={null}>
        <ModuleGrid modules={modules} />
      </Suspense>
    </div>
  );
}
