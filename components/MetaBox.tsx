import Link from "next/link";
import { getModuleById, type Module } from "@/lib/modules";
import { BloomBadge } from "@/components/BloomBadge";

type Props = {
  module: Module;
};

function ModuleChip({ moduleId }: { moduleId: string }) {
  const targetModule = getModuleById(moduleId);

  if (!targetModule) {
    return (
      <span className="inline-flex rounded-full border border-dashed border-slate-300 px-3 py-1 text-sm font-medium text-slate-400">
        {moduleId}
      </span>
    );
  }

  return (
    <Link
      href={`/module/${moduleId}`}
      className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary"
    >
      {moduleId}
    </Link>
  );
}

export function MetaBox({ module }: Props) {
  return (
    <aside className="grid gap-6 lg:sticky lg:top-24">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-primary">Lernziele</h2>
        <ul className="mt-5 space-y-4">
          {module.lernziele.map((ziel, index) => (
            <li key={`${ziel.text}-${index}`} className="flex items-start gap-3">
              <BloomBadge level={ziel.bloom_stufe} />
              <span className="pt-1 text-sm leading-6 text-ink">{ziel.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-primary">Moduldetails</h2>
        <dl className="mt-5 space-y-5 text-sm">
          <div>
            <dt className="font-semibold text-slate-500">Format</dt>
            <dd className="mt-1 text-ink">{module.format}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Version</dt>
            <dd className="mt-1 text-ink">{module.version}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Status</dt>
            <dd className="mt-1 text-ink">{module.status}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Voraussetzungen</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {module.voraussetzungen.length ? (
                module.voraussetzungen.map((item) => <ModuleChip key={item} moduleId={item} />)
              ) : (
                <span className="text-slate-500">Keine</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Folgemodule</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {module.folgemodule.length ? (
                module.folgemodule.map((item) => <ModuleChip key={item} moduleId={item} />)
              ) : (
                <span className="text-slate-500">Keine</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}
