import Link from "next/link";
import { getModuleById, type Module } from "@/lib/modules";

type Props = {
  module: Module;
  pdfUrl?: string | null;
  trainerPdfUrl?: string | null;
  beobachtungsbogenUrl?: string | null;
  teamleiterLeitfadenUrl?: string | null;
  arbeitsmaterialUrl?: string | null;
  presentationUrl?: string | null;
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

export function MetaBox({ module, pdfUrl, trainerPdfUrl, beobachtungsbogenUrl, teamleiterLeitfadenUrl, arbeitsmaterialUrl, presentationUrl, hasTheorie, isTrainerOrAdmin, className }: Props) {
  return (
    <aside className={`space-y-8 ${className ?? ""}`}>
      {/* Auf dieser Seite – nur Desktop (Mobile hat eigene Leiste oben) */}
      <div className="hidden lg:block">
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
      {(pdfUrl || arbeitsmaterialUrl || beobachtungsbogenUrl || teamleiterLeitfadenUrl || (isTrainerOrAdmin && (trainerPdfUrl || presentationUrl))) && (
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 pb-3 border-b border-ink mb-4">
            Downloads
          </div>
          <div className="flex flex-col gap-2">
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-2 bg-primary text-primary-ink px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] hover:opacity-90 transition"
              >
                <span>Workbook (PDF)</span>
                <span>↓</span>
              </a>
            )}
            {arbeitsmaterialUrl && (
              <a
                href={arbeitsmaterialUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-2 border border-line text-ink-2 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] hover:border-primary hover:text-primary transition"
              >
                <span>Rechenmodell (XLSX)</span>
                <span>↓</span>
              </a>
            )}
            {beobachtungsbogenUrl && (
              <a
                href={beobachtungsbogenUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-2 border border-line text-ink-2 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] hover:border-primary hover:text-primary transition"
              >
                <span>Beobachtungsbogen (PDF)</span>
                <span>↓</span>
              </a>
            )}
            {teamleiterLeitfadenUrl && (
              <a
                href={teamleiterLeitfadenUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-2 border border-line text-ink-2 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] hover:border-primary hover:text-primary transition"
              >
                <span>Transfergespräch-Leitfaden (PDF)</span>
                <span>↓</span>
              </a>
            )}
            {isTrainerOrAdmin && trainerPdfUrl && (
              <a
                href={trainerPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-2 border border-accent text-accent px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] hover:bg-accent hover:text-primary-ink transition"
              >
                <span>Trainerhandbuch (PDF)</span>
                <span>↓</span>
              </a>
            )}
            {isTrainerOrAdmin && presentationUrl && (
              <a
                href={presentationUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-2 border border-accent text-accent px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] hover:bg-accent hover:text-primary-ink transition"
              >
                <span>Präsentation (PPTX)</span>
                <span>↓</span>
              </a>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
