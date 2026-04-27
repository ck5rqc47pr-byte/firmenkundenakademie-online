import Link from "next/link";
import clsx from "clsx";
import type { Module } from "@/lib/modules";
import { StufenBadge } from "@/components/StufenBadge";

type Props = {
  module: Module;
};

const statusMap = {
  freigegeben: {
    label: "Verfügbar",
    className: "bg-emerald-100 text-emerald-700",
  },
  draft: {
    label: "In Vorbereitung",
    className: "bg-slate-100 text-slate-600",
  },
  "coming-soon": {
    label: "Demnächst",
    className: "bg-orange-100 text-accent",
  },
};

export function ModuleCard({ module }: Props) {
  const status = statusMap[module.status] ?? statusMap.draft;

  return (
    <Link
      href={`/module/${module.id}`}
      className="group flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-primary/30"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">
          {module.id}
        </span>
        <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold", status.className)}>
          {status.label}
        </span>
      </div>
      <div className="mt-5 space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
          {module.kompetenzfeld}
        </p>
        <div>
          <h3 className="text-2xl font-semibold text-ink transition group-hover:text-primary">
            {module.title}
          </h3>
          <p className="mt-2 text-sm text-slate-600">{module.subtitle}</p>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
        <StufenBadge stufe={module.stufe} />
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {module.dauer}
        </span>
      </div>
    </Link>
  );
}
