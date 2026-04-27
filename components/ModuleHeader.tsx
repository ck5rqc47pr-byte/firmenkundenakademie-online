import Link from "next/link";
import type { Module } from "@/lib/modules";
import { StufenBadge } from "@/components/StufenBadge";

type Props = {
  module: Module;
};

export function ModuleHeader({ module }: Props) {
  return (
    <section className="rounded-[2rem] bg-primary px-6 py-10 text-white shadow-card lg:px-10">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/75">
        <Link href="/" className="transition hover:text-white">
          Akademie
        </Link>
        <span>›</span>
        <Link href={`/kompetenzfeld/${module.kompetenzfeld_slug}`} className="transition hover:text-white">
          {module.kompetenzfeld}
        </Link>
        <span>›</span>
        <span className="text-white">{module.title}</span>
      </div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-200">{module.id}</p>
      <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight lg:text-5xl">
        {module.title}
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-white/80">{module.subtitle}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <StufenBadge stufe={module.stufe} inverted />
        <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
          {module.dauer}
        </span>
        <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
          Bloom {module.bloom}
        </span>
      </div>
    </section>
  );
}
