import Link from "next/link";

export const metadata = {
  title: "Leitbild – FKB Campus",
  description:
    "Warum es den FKB Campus braucht, unsere Mission, Vision und Leitwerte.",
};

const WERTE = [
  {
    titel: "Praxis trifft Evidenz",
    text: "Unsere Inhalte entstehen aus echten Fragestellungen des Firmenkundengeschäfts — nicht aus abstrakten Schulungskatalogen. Praxiswissen wird fachlich eingeordnet, geprüft und mit wissenschaftlicher Grundlage verbunden.",
  },
  {
    titel: "Klarheit als Disziplin",
    text: "Wir verdichten komplexe Themen so, dass sie verständlich bleiben und im Beratungsalltag tatsächlich angewendet werden können — ohne fachliche Tiefe zu verlieren.",
  },
  {
    titel: "Kundennutzen vor Produkt",
    text: "Wir befähigen zu Beratung, die das Unternehmen versteht, Entwicklungen einordnet und Entscheidungen begleitet — nicht zum Erklären von Produkten.",
  },
  {
    titel: "Austausch, der zurückfließt",
    text: "Hinweise aus der Praxis fließen geprüft in den Campus und seine Weiterentwicklung ein und werden bei Relevanz schnell in Inhalte übersetzt.",
  },
];

export default function LeitbildPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="border-b border-line px-6 lg:px-14 py-20 lg:py-28 max-w-[1240px] mx-auto">
        <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3 mb-8 flex items-center gap-3">
          <span className="w-6 h-px bg-ink-3 inline-block" />
          Leitbild · FKB Campus
        </div>
        <h1 className="font-serif text-[clamp(40px,6vw,80px)] font-normal leading-[1.0] tracking-[-0.03em] mb-8 max-w-3xl hyphens-auto" lang="de">
          Wofür der FKB Campus{" "}
          <em className="italic" style={{ color: "var(--ink-2)" }}>steht.</em>
        </h1>
        <p className="font-serif text-xl text-ink-2 leading-relaxed max-w-2xl">
          Wir machen relevantes Wissen im Firmenkundengeschäft sichtbar, prüfbar und
          anwendbar — damit aus Beratern strategische Partner werden.
        </p>
      </section>

      {/* ── WARUM ────────────────────────────────────────────── */}
      <section className="border-b border-line px-6 lg:px-14 py-20 max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-5 flex items-center gap-2">
              <span className="w-4 h-px inline-block bg-ink-3" />
              Warum es uns braucht
            </div>
            <h2 className="font-serif text-3xl font-normal tracking-[-0.02em] leading-tight">
              Zwischen Praxis und Wissenschaft entsteht eine{" "}
              <em className="italic text-ink-2">Lücke.</em>
            </h2>
          </div>
          <div className="space-y-5 font-serif text-base text-ink-2 leading-relaxed max-w-2xl">
            <p>
              Der demografische Wandel, Fluktuation und Rollenwechsel führen dazu, dass
              wertvolles Erfahrungswissen im Firmenkundengeschäft verloren geht. Gleichzeitig
              müssen neue Berater schneller handlungsfähig werden — in einem Umfeld, das
              fachlich anspruchsvoller, zeitlich enger und beratungsintensiver wird.
            </p>
            <p>
              Klassische Akademieformate leisten dabei einen wichtigen Beitrag, sind aber
              häufig teuer, zeitaufwendig und nicht immer nah genug am aktuellen
              Beratungsalltag. Zwischen gelebter Praxis und wissenschaftlicher Evidenz
              entsteht eine Lücke.
            </p>
            <p className="text-ink font-medium">Genau diese Lücke schließt der FKB Campus.</p>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ─────────────────────────────────── */}
      <section className="border-b border-line bg-bg-2 px-6 lg:px-14 py-20">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-line bg-bg p-8 lg:p-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent mb-4">
              Mission
            </div>
            <p className="font-serif text-xl text-ink leading-relaxed mb-4">
              Wir machen relevantes Wissen im Firmenkundengeschäft sichtbar, prüfbar und
              anwendbar.
            </p>
            <p className="font-serif text-[15px] text-ink-2 leading-relaxed">
              Dafür verbinden wir Erfahrungswissen aus der Praxis mit wissenschaftlicher
              Grundlage und übersetzen es in kompakte Inhalte, die Berater im Alltag wirklich
              nutzen können.
            </p>
          </div>
          <div className="border border-primary bg-primary text-white p-8 lg:p-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/50 mb-4">
              Vision
            </div>
            <p className="font-serif text-xl leading-relaxed mb-4">
              Ein Firmenkundengeschäft, in dem Wissen nicht verloren geht, Einarbeitung
              schneller gelingt und Beratung kontinuierlich besser wird.
            </p>
            <p className="font-serif text-[15px] text-white/70 leading-relaxed">
              Denn der deutsche Mittelstand braucht keine Banker, die nur Produkte erklären —
              sondern strategische Partner, die Unternehmen verstehen, Entwicklungen einordnen
              und unternehmerische Entscheidungen begleiten.
            </p>
          </div>
        </div>
      </section>

      {/* ── LEITWERTE ────────────────────────────────────────── */}
      <section className="border-b border-line px-6 lg:px-14 py-20 max-w-[1240px] mx-auto">
        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-5 flex items-center gap-2">
          <span className="w-4 h-px inline-block bg-ink-3" />
          Leitwerte
        </div>
        <h2 className="font-serif text-3xl lg:text-4xl font-normal tracking-[-0.02em] leading-tight mb-14 max-w-xl">
          Woran wir uns{" "}
          <em className="italic text-ink-2">halten.</em>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {WERTE.map((w, i) => (
            <div key={w.titel} className="border border-line p-8">
              <div className="font-mono text-[10px] text-ink-3 mb-4">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-serif text-xl font-medium text-ink mb-3">{w.titel}</h3>
              <p className="font-serif text-[15px] text-ink-2 leading-relaxed">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-primary text-white px-6 lg:px-14 py-20">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-normal leading-[1.1] tracking-[-0.02em] max-w-xl">
            Aus Beratern werden{" "}
            <em className="italic text-white/60">strategische Partner.</em>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/module"
              className="inline-flex items-center justify-center gap-3 bg-white text-primary px-7 py-4 font-mono text-[11px] uppercase tracking-[0.08em] hover:bg-white/90 transition-all"
            >
              Module ansehen →
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-3 border border-white/30 text-white/80 px-7 py-4 font-mono text-[11px] uppercase tracking-[0.08em] hover:border-white hover:text-white transition-all"
            >
              Das Programm für Banken
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
