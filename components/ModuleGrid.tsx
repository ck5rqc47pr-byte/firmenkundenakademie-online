"use client";

import { useSearchParams } from "next/navigation";
import { ModuleCard } from "@/components/ModuleCard";
import type { Module } from "@/lib/modules";

type Props = {
  modules: Module[];
};

export function ModuleGrid({ modules }: Props) {
  const searchParams = useSearchParams();
  const kompetenzfeld = searchParams.get("kompetenzfeld");
  const stufe = searchParams.get("stufe");
  const status = searchParams.get("status");

  const filteredModules = modules.filter((module) => {
    const fieldMatch = !kompetenzfeld || module.kompetenzfeld_slug === kompetenzfeld;
    const levelMatch = !stufe || stufe === "Alle" || module.stufe === stufe;
    const statusMatch = !status || status === "alle" || module.status === status;

    return fieldMatch && levelMatch && statusMatch;
  });

  return (
    <section className="space-y-4">
      <p className="text-sm font-medium text-slate-600">
        {filteredModules.length} Modul{filteredModules.length === 1 ? "" : "e"} gefunden
      </p>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredModules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
      {!filteredModules.length ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          Für diese Filterkombination wurden aktuell keine Module gefunden.
        </div>
      ) : null}
    </section>
  );
}
