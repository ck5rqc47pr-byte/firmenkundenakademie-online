import Link from "next/link";
import type { Metadata } from "next";
import { getModuleById } from "@/lib/modules";
import {
  LEITPRINZIPIEN,
  PRINZIP_GRUPPEN,
  PRINZIP_GRUPPEN_GEPLANT,
  type Prinzip,
} from "@/lib/principles";

export const metadata: Metadata = {
  title: "Prinzipien · FKB Campus",
  description:
    "Destillierte Handlungsprinzipien für den Beratungsalltag – die Brücke zwischen Modulwissen und dem nächsten Kundengespräch.",
};

function PrinzipItem({ nr, p }: { nr: string; p: Prinzip }) {
  const modul = p.moduleId ? getModuleById(p.moduleId) : null;
  return (
    <div className="flex gap-5 sm:gap-7 border-t border-line py-7 first:border-t-0">
      <div className="font-serif text-2xl sm:text-3xl text-accent-ink/40 leading-none w-10 sm:w-14 shrink-0 tabular-nums">
        {nr}
      </div>
      <div className="min-w-0">
        <h3 className="font-serif text-xl sm:text-2xl font-normal leading-snug tracking-[-0.01em] text-ink">
          {p.prinzip}
        </h3>
        <p className="mt-2 text-sm sm:text-[15px] text-ink-2 leading-relaxed max-w-2xl">
          {p.warum}
        </p>
        {modul && (
          <Link
            href={`/module/${modul.id}`}
            className="inline-flex items-center gap-1.5 mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 hover:text-accent-ink transition"
          >
            <span className="bg-bg-2 border border-line px-1.5 py-0.5">{modul.id}</span>
            {modul.title}
            <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function PrinzipienPage() {
  return (
    <div>
      {/* Header */}
      <section className="border-b border-ink bg-primary">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-3">
            Vom Wissen zum Handeln
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-normal leading-tight tracking-[-0.03em] text-white">
            Prinzipien für den Beratungsalltag
          </h1>
          <p className="mt-5 max-w-2xl text-white/70 leading-relaxed">
            Wissen wird erst wirksam, wenn es im Moment der Entscheidung abrufbar ist. Diese
            Prinzipien destillieren die Module zu einprägsamen Leitsätzen – die Brücke zwischen
            „im Workshop gelernt" und „Montag im Kundengespräch angewandt".
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-content px-6 lg:px-14 py-14 space-y-20">
        {/* Einordnung */}
        <p className="text-sm text-ink-3 leading-relaxed max-w-2xl border-l-2 border-accent pl-4">
          Inspiriert von der Idee, Erfahrung in klare Prinzipien zu fassen (u. a. Ray Dalio,
          <em> Principles</em>, 2017). Jedes Prinzip ist aus den Lernzielen, Praxisfällen und
          Handlungsempfehlungen eines Moduls abgeleitet und verlinkt zurück auf seine Quelle.
        </p>

        {/* Leitprinzipien */}
        <section>
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent-ink">
              Teil I
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-[-0.02em] text-ink">
              Leitprinzipien
            </h2>
          </div>
          <p className="text-sm text-ink-2 leading-relaxed max-w-2xl mb-6">
            Die übergeordnete Haltung – sie gilt in jedem Gespräch, unabhängig vom Thema.
          </p>
          <div>
            {LEITPRINZIPIEN.map((p, i) => (
              <PrinzipItem key={i} nr={`${i + 1}`} p={p} />
            ))}
          </div>
        </section>

        {/* Feld-Gruppen */}
        {PRINZIP_GRUPPEN.map((gruppe, gi) => (
          <section key={gruppe.slug}>
            <div className="flex items-baseline gap-4 mb-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent-ink">
                Teil {gi + 2}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-[-0.02em] text-ink">
                {gruppe.titel}
              </h2>
            </div>
            <p className="text-sm text-ink-2 leading-relaxed max-w-2xl mb-6">{gruppe.einleitung}</p>
            <div>
              {gruppe.prinzipien.map((p, i) => (
                <PrinzipItem key={i} nr={`${gi + 2}.${i + 1}`} p={p} />
              ))}
            </div>
          </section>
        ))}

        {/* Ausblick */}
        <section className="border-t border-line pt-10">
          <h2 className="font-serif text-xl font-normal text-ink mb-3">In Vorbereitung</h2>
          <p className="text-sm text-ink-2 leading-relaxed max-w-2xl mb-4">
            Prinzipien für die übrigen Kompetenzfelder werden derzeit aus den Modulen destilliert:
          </p>
          <div className="flex flex-wrap gap-2">
            {PRINZIP_GRUPPEN_GEPLANT.map((f) => (
              <span
                key={f}
                className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 border border-line bg-bg-2 px-2.5 py-1"
              >
                {f}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
