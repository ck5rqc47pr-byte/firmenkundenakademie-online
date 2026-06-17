"use client";

import { useSearchParams } from "next/navigation";
import { ModuleCard } from "@/components/ModuleCard";
import type { Module } from "@/lib/modules";

type Props = {
  modules: Module[];
};

export function ModuleGrid({ modules }: Props) {
  const searchParams = useSearchParams();
  const track = searchParams.get("track");
  const kompetenzfeld = searchParams.get("kompetenzfeld");
  const stufe = searchParams.get("stufe");
  const status = searchParams.get("status");

  const filteredModules = modules.filter((module) => {
    const trackMatch = !track || track === "alle" || module.zielrolle === track;
    const fieldMatch = !kompetenzfeld || module.kompetenzfeld_slug === kompetenzfeld;
    const levelMatch = !stufe || stufe === "Alle" || module.stufe === stufe;
    const statusMatch = !status || status === "alle" || module.status === status;
    return trackMatch && fieldMatch && levelMatch && statusMatch;
  });

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {filteredModules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
      {!filteredModules.length && (
        <div className="border-b border-r border-line p-10 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
          Keine Module für diese Filterauswahl gefunden.
        </div>
      )}
    </section>
  );
}
