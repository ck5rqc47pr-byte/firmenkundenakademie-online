import Link from "next/link";
import { getModuleById, type Module } from "@/lib/modules";

type Props = {
  module: Module;
  pdfUrl?: string | null;
  hasTheorie?: boolean;
  isTrainerOrAdmin?: boolean;
  className?: string;
};

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

export function MetaBox({ module, pdfUrl, hasTheorie, isTrainerOrAdmin, className }: Props) {
  return (
    <aside className={`space-y-8 ${className ?? ""}`}>
      {/* Auf dieser Seite */}
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 pb-3 border-b border-ink mb-4">
          Auf dieser Seite
        </div>
        <ul className="space-y-2">
          {hasTheorie && (
            <li>
              <a href="#einordnung" className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-2 hover:text-primary transition">
                Einordnung
              </a>
            </li>
          )}
          <li>
            <a href="#inhalte" className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-2 hover:text-primary transition">
              Inhalte
            </a>
          </li>
          <li>
            <a href="#transfer" className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-2 hover:text-primary transition">
              Praxistransfer
            </a>
          </li>
          <li>
            <a href="#quellen" className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-2 hover:text-primary transition">
              Quellen
            </a>
          </li>
          {isTrainerOrAdmin && (
            <li>
              <a href="#trainerbereich" className="font-mono text-[10px] uppercase tracking-[0.06em] text-accent hover:opacity-80 transition">
                Trainerbereich
              </a>
            </li>
          )}
        </ul>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 pb-3 border-b border-ink mb-4">
          Lernziele
        </div>
        <ul className="space-y-4">
          {module.lernziele.map((z, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="font-mono text-[10px] shrink-0 font-[500] px-1.5 py-0.5 leading-none"
                style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
              >
                B{z.bloom_stufe}
              </span>
              <span className="text-sm leading-relaxed text-ink-2">{z.text}</span>
            </li>
          ))}
        </ul>
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
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 pb-3 border-b border-ink mb-4">
          Kompetenzfeld
        </div>
        <Link
          href={`/kompetenzfeld/${module.kompetenzfeld_slug}`}
          className="text-sm text-primary hover:underline leading-snug"
        >
          {module.kompetenzfeld} →
        </Link>
      </div>
      {pdfUrl && (
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 pb-3 border-b border-ink mb-4">
            Unterlagen
          </div>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-2 bg-primary text-primary-ink px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] hover:opacity-90 transition"
          >
            <span>Teilnehmerunterlagen (PDF)</span>
            <span>↓</span>
          </a>
        </div>
      )}
    </aside>
  );
}
