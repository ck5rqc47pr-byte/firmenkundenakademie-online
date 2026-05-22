import Link from "next/link";
import { getAllModules, getKompetenzfelder } from "@/lib/modules";
import { ModuleCard } from "@/components/ModuleCard";

const ETAPPEN = [
  {
    nr: 1,
    titel: "Beraterhandwerk",
    sub: "Berater",
    beschreibung:
      "Bilanzen lesen, Risiken früh erkennen, KMU-Strukturen verstehen. Die handwerkliche Grundlage, auf der alles Weitere aufbaut.",
    module: ["Bilanzlesen", "Kreditrisikofrüherkennung", "KMU-Kompetenz", "NMZ-Optimierung", "agree & Co.", "Cross-Selling"],
    count: 6,
  },
  {
    nr: 2,
    titel: "Sparringspartner",
    sub: "Sparringspartner",
    beschreibung:
      "Der Kunde sucht das Gespräch, weil der Berater Strukturen erkennt, die andere übersehen — und Optionen aufzeigt, die er selbst nicht gesehen hätte.",
    module: ["Bilanzgespräch", "Bedarfsanalyse", "Latente Bedarfe", "Heilberufe", "Immobilien", "Ertragsoptimierung", "Datengetriebener Vertrieb", "Wissenstransfer", "Kreditentscheidung"],
    count: 9,
  },
  {
    nr: 3,
    titel: "Strategischer Partner",
    sub: "Stratege",
    beschreibung:
      "Nachfolge, Kapitalstruktur, Marktbearbeitung: Themen, in denen aus Beratung Partnerschaft wird — auf Augenhöhe mit der Geschäftsführung.",
    module: ["Strategischer Finanzdialog", "Branchenrisiken", "CEO-Dialog & Nachfolge", "Marktbearbeitung", "Branchenexperte", "Netzwerk & Sichtbarkeit"],
    count: 6,
  },
];

const MANIFEST = [
  ["I.", "Aus der Praxis.", "Wer schreibt, hat den Kunden gestern noch beraten."],
  ["II.", "Fundiert.", "Jeder Befund mit Studie. Jeder Satz mit Quelle."],
  ["III.", "Genossenschaftlich.", "Mitgliederlogik, Region, langfristige Beziehung."],
  ["IV.", "Ihr Tempo.", "Lesen, wann es passt. Tief genug, um zu überzeugen."],
];

export default function HomePage() {
  const modules = getAllModules().slice(0, 3);
  const felder = getKompetenzfelder();

  return (
    <div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-content px-6 lg:px-14 pt-16 pb-14 lg:pt-24 lg:pb-20">
          <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3 mb-8 flex items-center gap-3">
            <span className="w-6 h-px bg-ink-3 inline-block" />
            Firmenkundenakademie · Für Bereichsleiter Firmenkunden
          </div>
          <h1
            className="font-serif text-[clamp(44px,7vw,96px)] font-normal leading-[0.95] tracking-[-0.035em] mb-8 max-w-4xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Aus Beratern werden{" "}
            <em className="italic" style={{ color: "var(--accent)" }}>
              Sparringspartner.
            </em>
          </h1>
          <p className="font-serif text-xl text-ink-2 leading-relaxed max-w-2xl mb-12">
            Die Firmenkundenakademie ist ein praxisorientiertes Qualifizierungsprogramm
            für Firmenkundenberater in Volksbanken und Raiffeisenbanken —
            wissenschaftlich fundiert, direkt auf den Beratungsalltag zugeschnitten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:info@benedikt-zoller.de?subject=Firmenkundenakademie – Interesse"
              className="inline-flex items-center gap-3 bg-primary text-white px-7 py-4 font-mono text-[11px] uppercase tracking-[0.08em] hover:bg-primary/90 transition-all"
            >
              Gespräch vereinbaren →
            </a>
            <Link
              href="/module"
              className="inline-flex items-center gap-3 border border-line px-7 py-4 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 hover:border-ink hover:text-ink transition-all"
            >
              Alle Module ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-line bg-primary text-white">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { num: "21",     label: "Module" },
            { num: "3",      label: "Etappen" },
            { num: "6",      label: "Kompetenzfelder" },
            { num: "90–180", label: "Min. je Modul" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-serif text-[clamp(36px,5vw,56px)] font-normal leading-none tracking-[-0.02em] mb-2">
                {s.num}
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/60">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM ───────────────────────────────────────────────────────── */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-5 flex items-center gap-2">
                <span className="w-4 h-px inline-block bg-ink-3" />
                Die Ausgangslage
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl font-normal tracking-[-0.02em] leading-tight">
                Was Bereichsleiter<br />
                <em className="italic text-ink-2">täglich beschäftigt.</em>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { nr: "01", text: "Berater sprechen über Produkte — nicht über die Situation des Kunden." },
                { nr: "02", text: "Bilanzgespräche werden vermieden, weil das Handwerkszeug fehlt." },
                { nr: "03", text: "Latente Bedarfe bleiben unerkannt — der Wettbewerb schlägt zu." },
                { nr: "04", text: "Cross-Selling läuft reaktiv statt systematisch — Potenziale bleiben liegen." },
              ].map((item) => (
                <div key={item.nr} className="border border-line p-5">
                  <div className="font-mono text-[10px] text-ink-3 mb-3">{item.nr}</div>
                  <p className="font-serif text-base text-ink-2 leading-snug">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ETAPPEN ───────────────────────────────────────────────────────── */}
      <section className="border-b border-line bg-bg-2">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-20">
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-5 flex items-center gap-2">
            <span className="w-4 h-px inline-block bg-ink-3" />
            Das Programm
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-normal tracking-[-0.02em] leading-tight mb-16 max-w-xl">
            Drei Etappen. Ein klarer{" "}
            <em className="italic text-ink-2">Entwicklungspfad.</em>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {ETAPPEN.map((e) => (
              <div
                key={e.nr}
                className={`border border-line p-8 ${e.nr === 3 ? "bg-primary text-white border-primary" : "bg-bg"}`}
              >
                <div className={`font-mono text-[10px] uppercase tracking-[0.1em] mb-6 flex items-center gap-2 ${e.nr === 3 ? "text-white/50" : "text-ink-3"}`}>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] ${e.nr === 3 ? "border-white/30 text-white/50" : "border-ink-3 text-ink-3"}`}>
                    {e.nr}
                  </span>
                  Etappe {e.nr}
                </div>
                <h3 className={`font-serif text-2xl font-normal tracking-[-0.01em] mb-1 ${e.nr === 3 ? "text-white" : "text-ink"}`}>
                  {e.titel}
                </h3>
                <div className={`font-mono text-[10px] uppercase tracking-[0.06em] mb-5 ${e.nr === 3 ? "text-white/40" : "text-ink-3"}`}>
                  {e.count} Module · Zielstufe: {e.sub}
                </div>
                <p className={`font-serif text-[15px] leading-relaxed mb-6 ${e.nr === 3 ? "text-white/60" : "text-ink-2"}`}>
                  {e.beschreibung}
                </p>
                <div className={`pt-5 border-t ${e.nr === 3 ? "border-white/15" : "border-line"} space-y-1.5`}>
                  {e.module.slice(0, 4).map((m) => (
                    <div key={m} className={`flex items-center gap-2 font-mono text-[10px] ${e.nr === 3 ? "text-white/40" : "text-ink-3"}`}>
                      <span>—</span><span>{m}</span>
                    </div>
                  ))}
                  {e.module.length > 4 && (
                    <div className={`font-mono text-[10px] ${e.nr === 3 ? "text-white/30" : "text-ink-3/60"}`}>
                      + {e.module.length - 4} weitere
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFEST ──────────────────────────────────────────────────────── */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-content px-6 lg:px-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-ink">
            {MANIFEST.map(([n, t, d], i) => (
              <div
                key={n}
                style={{
                  background: i === 1 ? "var(--primary)" : undefined,
                  color:      i === 1 ? "var(--primary-ink)" : undefined,
                }}
                className="p-10 border-b border-r border-line min-h-[280px] flex flex-col"
              >
                <div
                  className="font-serif text-5xl italic leading-[0.9]"
                  style={{ color: i === 1 ? "var(--accent)" : "var(--primary)" }}
                >
                  {n}
                </div>
                <h3 className="font-serif text-2xl font-normal tracking-[-0.02em] mt-6 mb-3">{t}</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: i === 1 ? "oklch(0.85 0.02 240)" : "var(--ink-2)" }}
                >
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KOMPETENZFELDER ───────────────────────────────────────────────── */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-16">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 mb-6">
            § Kompetenzfelder
          </div>
          <h2 className="font-serif text-4xl lg:text-6xl font-normal leading-tight tracking-[-0.03em] mb-12">
            Sechs Felder.{" "}
            <em style={{ fontStyle: "italic", color: "var(--primary)" }}>Ihr Lernpfad.</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-ink">
            {felder.map((f) => (
              <Link
                key={f.slug}
                href={`/kompetenzfeld/${f.slug}`}
                className="group p-8 border-b border-r border-line hover:bg-bg-2 transition flex flex-col gap-2"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-primary">
                  {f.count} Module
                </div>
                <div className="font-serif text-xl font-[500] leading-tight text-ink group-hover:text-primary transition">
                  {f.name}
                </div>
                <div className="font-mono text-[11px] text-ink-3 mt-auto pt-4">Entdecken →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMAT & DURCHFÜHRUNG ─────────────────────────────────────────── */}
      <section className="border-b border-line bg-bg-2">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-20">
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-5 flex items-center gap-2">
            <span className="w-4 h-px inline-block bg-ink-3" />
            Format & Durchführung
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-normal tracking-[-0.02em] leading-tight mb-14 max-w-xl">
            Lernen, das in den{" "}
            <em className="italic text-ink-2">Alltag passt.</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { nr: "01", titel: "Workshop",        text: "90–180 Minuten je Modul. Trainer-geführt, mit Praxiscases aus dem VR-Umfeld." },
              { nr: "02", titel: "Praxistransfer",  text: "Jedes Modul enthält eine konkrete Transferaufgabe für die nächsten 4 Wochen." },
              { nr: "03", titel: "Wissenstest",     text: "Kurzer Wissenstest nach jedem Modul — Kirkpatrick Level 2, anonym auswertbar." },
              { nr: "04", titel: "Online-Begleitung", text: "Alle Unterlagen, Kompetenzkarte und Lernfortschritt im FKB Campus." },
            ].map((item) => (
              <div key={item.nr} className="bg-bg border border-line p-6">
                <div className="font-mono text-[10px] text-ink-3 mb-4">{item.nr}</div>
                <h3 className="font-serif text-lg font-medium text-ink mb-3">{item.titel}</h3>
                <p className="font-serif text-[14px] text-ink-2 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIDAKTIK ──────────────────────────────────────────────────────── */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-5 flex items-center gap-2">
                <span className="w-4 h-px inline-block bg-ink-3" />
                Didaktik
              </div>
              <h2 className="font-serif text-3xl font-normal tracking-[-0.02em] leading-tight">
                Wissenschaftlich{" "}
                <em className="italic text-ink-2">fundiert.</em>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { modell: "Dreyfus-Modell",    beschreibung: "Die drei Etappen entsprechen den Dreyfus-Stufen 2–4. Jedes Modul ist einer Kompetenzstufe zugeordnet." },
                { modell: "Bloom-Taxonomie",   beschreibung: "Alle Lernziele sind nach Anderson & Krathwohl (2001) formuliert — mit taxonomiestufengerechten Verben." },
                { modell: "Kirkpatrick-Modell", beschreibung: "Evaluation auf Level 1–3: Reaktion, Lernerfolg und Verhaltenstransfer in den Arbeitsalltag." },
              ].map((item) => (
                <div key={item.modell} className="border-t border-line pt-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.07em] text-accent mb-3">
                    {item.modell}
                  </div>
                  <p className="font-serif text-[14px] text-ink-2 leading-relaxed">{item.beschreibung}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EMPFOHLENE MODULE ─────────────────────────────────────────────── */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-16">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-3xl font-normal tracking-[-0.02em]">
              Empfohlene Module.
            </h2>
            <Link
              href="/module"
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 hover:text-ink transition"
            >
              Alle ansehen →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-ink">
            {modules.map((m) => (
              <ModuleCard key={m.id} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/50 mb-6 flex items-center gap-2">
              <span className="w-4 h-px inline-block bg-white/30" />
              Kontakt
            </div>
            <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-normal leading-[1.05] tracking-[-0.02em] mb-6">
              Interesse geweckt?{" "}
              <em className="italic text-white/60">Sprechen wir.</em>
            </h2>
            <p className="font-serif text-lg text-white/70 leading-relaxed max-w-lg">
              Ich zeige Ihnen das Programm in einem 30-minütigen Gespräch —
              live in der Online-Akademie, mit echten Modulen und konkreten
              Zahlen aus dem Pilotbetrieb.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href="mailto:info@benedikt-zoller.de?subject=Firmenkundenakademie – Gesprächsanfrage"
              className="inline-flex items-center justify-center gap-3 bg-white text-primary px-8 py-5 font-mono text-[11px] uppercase tracking-[0.08em] hover:bg-white/90 transition-all"
            >
              Per E-Mail melden →
            </a>
            <Link
              href="/module"
              className="inline-flex items-center justify-center gap-3 border border-white/30 text-white/80 px-8 py-5 font-mono text-[11px] uppercase tracking-[0.08em] hover:border-white hover:text-white transition-all"
            >
              Alle 21 Module ansehen
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
