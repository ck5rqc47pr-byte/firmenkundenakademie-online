import Link from "next/link";
import { getModuleById, type Module } from "@/lib/modules";

type Props = { module: Module; className?: string };

function Chip({ moduleId }: { moduleId: string }) {
  const t = getModuleById(moduleId);
  const cls =
    "font-mono text-[10px] uppercase tracking-[0.06em] px-2 py-1 border transition";
  return t ? (
    <Link
      href={`/module/${moduleId}`}
      className={cls + " border-line text-primary hover:border-primary"}
    >
      {moduleId}
    </Link>
  ) : (
    <span className={cls + " border-dashed border-line text-ink-3"}>{moduleId}</span>
  );
}

export function MetaBox({ module, className }: Props) {
  return (
    <aside className={`space-y-8 ${className ?? ""}`}>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 pb-3 border-b border-ink mb-4">
          Lernziele
        </div>
        <ul className="space-y-4">
          {module.lernziele.map((z, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-[10px] text-primary mt-0.5 shrink-0 font-[500]">
                B{z.bloom_stufe}
              </span>
              <span className="text-sm leading-relaxed text-ink-2">{z.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 pb-3 border-b border-ink mb-4">
          Details
        </div>
        <dl className="space-y-3">
          {([["Format", module.format], ["Dauer", module.dauer], ["Version", module.version]] as [string, string][]).map(
            ([l, v]) =>
              v ? (
                <div key={l}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">{l}</dt>
                  <dd className="mt-0.5 text-sm text-ink">{v}</dd>
                </div>
              ) : null,
          )}
        </dl>
      </div>
      {module.voraussetzungen.length > 0 && (
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-3">
            Voraussetzungen
          </div>
          <div className="flex flex-wrap gap-2">
            {module.voraussetzungen.map((id) => (
              <Chip key={id} moduleId={id} />
            ))}
          </div>
        </div>
      )}
      {module.folgemodule.length > 0 && (
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-3">
            Folgemodule
          </div>
          <div className="flex flex-wrap gap-2">
            {module.folgemodule.map((id) => (
              <Chip key={id} moduleId={id} />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
