import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getModulesByZielrolle, TRACKS, type Zielrolle } from "@/lib/modules";
import { LEITPRINZIPIEN, LEITPRINZIPIEN_ASSISTENZ, type Prinzip } from "@/lib/principles";

export const metadata: Metadata = {
  title: "Prinzipien · FKB Campus",
  description:
    "Destillierte Handlungsprinzipien für den Alltag – die Brücke zwischen Modulwissen und dem nächsten Kundenkontakt.",
};

// Geschützter Bereich: nur für angemeldete Nutzer.
export const dynamic = "force-dynamic";

type FeldItem = Prinzip & { moduleTitle?: string };
type Feld = { slug: string; titel: string; prinzipien: FeldItem[] };

// Modul-Prinzipien eines Tracks nach Kompetenzfeld (in Track-Reihenfolge) bündeln.
function feldGruppen(zielrolle: Zielrolle): Feld[] {
  const module = getModulesByZielrolle(zielrolle);
  return TRACKS[zielrolle].felder
    .map((feld) => {
      const prinzipien = module
        .filter((m) => m.kompetenzfeld_slug === feld.slug)
        .flatMap((m) =>
          m.prinzipien.map((p) => ({ ...p, moduleId: m.id, moduleTitle: m.title })),
        );
      return { slug: feld.slug, titel: feld.label, prinzipien };
    })
    .filter((g) => g.prinzipien.length > 0);
}

function PrinzipItem({ nr, p }: { nr: string; p: FeldItem }) {
  return (
    <div className="flex gap-5 sm:gap-7 border-t border-line py-7 first:border-t-0">
      <div className="font-serif text-2xl sm:text-3xl text-accent-ink/40 leading-none w-10 sm:w-14 shrink-0 tabular-nums">
        {nr}
      </div>
      <div className="min-w-0">
        <h3 className="font-serif text-xl sm:text-2xl font-normal leading-snug tracking-[-0.01em] text-ink">
          {p.prinzip}
        </h3>
        <p className="mt-2 text-sm sm:text-[15px] text-ink-2 leading-relaxed max-w-2xl">{p.warum}</p>
        {p.moduleId && (
          <Link
            href={`/module/${p.moduleId}`}
            className="inline-flex items-center gap-1.5 mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 hover:text-accent-ink transition"
          >
            <span className="bg-bg-2 border border-line px-1.5 py-0.5">{p.moduleId}</span>
            {p.moduleTitle}
            <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}

function TrackSection({
  eyebrow,
  titel,
  leitsatz,
  leitprinzipien,
  gruppen,
}: {
  eyebrow: string;
  titel: string;
  leitsatz: string;
  leitprinzipien: Prinzip[];
  gruppen: Feld[];
}) {
  return (
    <section className="space-y-14">
      <div className="border-b border-ink pb-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent-ink mb-2">
          {eyebrow}
        </div>
        <h2 className="font-serif text-3xl lg:text-4xl font-normal tracking-[-0.02em] text-ink">
          {titel}
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-ink-2 leading-relaxed">{leitsatz}</p>
      </div>

      {/* Leitprinzipien */}
      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3 mb-2">
          Leitprinzipien
        </h3>
        <div>
          {leitprinzipien.map((p, i) => (
            <PrinzipItem key={i} nr={`${i + 1}`} p={p} />
          ))}
        </div>
      </div>

      {/* Felder */}
      {gruppen.map((g) => (
        <div key={g.slug}>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3 mb-2">
            {g.titel}
          </h3>
          <div>
            {g.prinzipien.map((p, i) => (
              <PrinzipItem key={i} nr={`${i + 1}`} p={p} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default async function PrinzipienPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/prinzipien");

  const beraterGruppen = feldGruppen("berater");
  const assistenzGruppen = feldGruppen("assistenz");

  return (
    <div>
      {/* Header */}
      <section className="border-b border-ink bg-primary">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-3">
            Vom Wissen zum Handeln
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-normal leading-tight tracking-[-0.03em] text-white">
            Prinzipien für den Arbeitsalltag
          </h1>
          <p className="mt-5 max-w-2xl text-white/70 leading-relaxed">
            Wissen wird erst wirksam, wenn es im Moment der Entscheidung abrufbar ist. Diese
            Prinzipien destillieren die Module zu einprägsamen Leitsätzen – je Rolle: als
            Berater und im Innendienst der Vertriebsassistenz.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-content px-6 lg:px-14 py-14 space-y-24">
        {/* Einordnung */}
        <p className="text-sm text-ink-3 leading-relaxed max-w-2xl border-l-2 border-accent pl-4">
          Inspiriert von der Idee, Erfahrung in klare Prinzipien zu fassen (u. a. Ray Dalio,
          <em> Principles</em>, 2017). Jedes Feld-Prinzip ist aus den Lernzielen eines Moduls
          abgeleitet und im Frontmatter des Moduls verankert – die Seite aggregiert sie nach
          Track und Kompetenzfeld.
        </p>

        <TrackSection
          eyebrow="Track · Firmenkundenberater"
          titel="Berater"
          leitsatz="Vom Zahlenversteher zum Sparringspartner des Unternehmers."
          leitprinzipien={LEITPRINZIPIEN}
          gruppen={beraterGruppen}
        />

        <TrackSection
          eyebrow="Track · Vertriebsassistenz"
          titel="Vertriebsassistenz"
          leitsatz="Der Innendienst als verlässliches Rückgrat – genau, mitdenkend, prüfsicher."
          leitprinzipien={LEITPRINZIPIEN_ASSISTENZ}
          gruppen={assistenzGruppen}
        />
      </div>
    </div>
  );
}
