import Link from "next/link";

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
    sub: "Strategischer Partner",
    beschreibung:
      "Nachfolge, Kapitalstruktur, Marktbearbeitung: Themen, in denen aus Beratung Partnerschaft wird — auf Augenhöhe mit der Geschäftsführung.",
    module: ["Strategischer Finanzdialog", "Branchenrisiken", "CEO-Dialog & Nachfolge", "Marktbearbeitung", "Branchenexperte", "Netzwerk & Sichtbarkeit"],
    count: 6,
  },
];

const STATS = [
  { num: "21", label: "Module" },
  { num: "3", label: "Etappen" },
  { num: "6", label: "Kompetenzfelder" },
  { num: "90–180", label: "Min. je Modul" },
];

const FELDER = [
  { icon: "▪", label: "Finanzanalyse & Kreditexpertise" },
  { icon: "▪", label: "Branchenwissen" },
  { icon: "▪", label: "Gesprächsführung & Beratung" },
  { icon: "▪", label: "Vertrieb & Ertragsmanagement" },
  { icon: "▪", label: "Digitale Kompetenz" },
  { icon: "▪", label: "Führung & Zusammenarbeit" },
];

export default function FuerBankenPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="border-b border-line px-6 lg:px-14 py-20 lg:py-32 max-w-[1240px] mx-auto">
        <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3 mb-8 flex items-center gap-3">
          <span className="w-6 h-px bg-ink-3 inline-block" />
          Firmenkundenakademie · Für Bereichsleiter Firmenkunden
        </div>

        <h1 lang="de" className="font-serif text-[clamp(40px,7vw,88px)] font-normal leading-[1.0] tracking-[-0.03em] mb-8 max-w-4xl hyphens-auto">
          Aus Beratern werden{" "}
          <em className="italic" style={{ color: "var(--ink-2)" }}>
            Strategische Partner.
          </em>
        </h1>

        <p className="font-serif text-xl text-ink-2 leading-relaxed max-w-2xl mb-12">
          Die Firmenkundenakademie ist ein praxisorientiertes Qualifizierungsprogramm
          für Firmenkundenberater in Volksbanken und Raiffeisenbanken —
          wissenschaftlich fundiert, direkt auf den Beratungsalltag zugeschnitten.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:kreisel-sendung7x@icloud.com?subject=Firmenkundenakademie – Interesse"
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
          <a
            href="/downloads/teilnehmerunterlagen/M01.pdf"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-3 border border-accent px-7 py-4 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 hover:border-ink hover:text-ink transition-all"
          >
            Muster-Workbook laden (M01, PDF)
          </a>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">
          Vollständiges Teilnehmer-Workbook „Bilanzlesen für Praktiker" – frei zugänglich als Qualitätsprobe.
        </p>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="border-b border-line bg-primary text-white px-6 lg:px-14 py-12">
        <div className="max-w-[1240px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s) => (
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

      {/* ── PROBLEM ──────────────────────────────────────────── */}
      <section className="border-b border-line px-6 lg:px-14 py-20 max-w-[1240px] mx-auto">
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
              {
                nr: "01",
                text: "Berater sprechen über Produkte — nicht über die Situation des Kunden.",
              },
              {
                nr: "02",
                text: "Bilanzgespräche werden vermieden, weil das Handwerkszeug fehlt.",
              },
              {
                nr: "03",
                text: "Latente Bedarfe bleiben unerkannt — der Wettbewerb schlägt zu.",
              },
              {
                nr: "04",
                text: "Cross-Selling läuft reaktiv statt systematisch — Potenziale bleiben liegen.",
              },
            ].map((item) => (
              <div key={item.nr} className="border border-line p-5">
                <div className="font-mono text-[10px] text-ink-3 mb-3">{item.nr}</div>
                <p className="font-serif text-base text-ink-2 leading-snug">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LÖSUNG: ETAPPEN ──────────────────────────────────── */}
      <section className="border-b border-line bg-bg-2">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-14 py-20">
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
              <div key={e.nr} className={`border border-line p-8 ${e.nr === 3 ? "bg-primary text-white border-primary" : "bg-bg"}`}>
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
                      <span>—</span>
                      <span>{m}</span>
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

      {/* ── KOMPETENZFELDER ──────────────────────────────────── */}
      <section className="border-b border-line px-6 lg:px-14 py-20 max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-5 flex items-center gap-2">
              <span className="w-4 h-px inline-block bg-ink-3" />
              Kompetenzfelder
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-normal tracking-[-0.02em] leading-tight mb-6">
              Sechs Felder.{" "}
              <em className="italic text-ink-2">Ein Berater.</em>
            </h2>
            <p className="font-serif text-base text-ink-2 leading-relaxed">
              Das Programm entwickelt Firmenkundenberater in allen sechs
              Dimensionen, die im modernen Firmenkundengeschäft entscheidend sind —
              von der Bilanzanalyse bis zur Führungskompetenz.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FELDER.map((f) => (
              <div key={f.label} className="flex items-center gap-3 border border-line px-4 py-3.5">
                <span className="text-primary text-xs">▪</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-2">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WIE ES FUNKTIONIERT ──────────────────────────────── */}
      <section className="border-b border-line bg-bg-2 px-6 lg:px-14 py-20">
        <div className="max-w-[1240px] mx-auto">
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
              {
                nr: "01",
                titel: "Workshop",
                text: "90–180 Minuten je Modul. Trainer-geführt, mit Praxiscases aus dem VR-Umfeld.",
              },
              {
                nr: "02",
                titel: "Praxistransfer",
                text: "Jedes Modul enthält eine konkrete Transferaufgabe für die nächsten 4 Wochen.",
              },
              {
                nr: "03",
                titel: "Wissenstest",
                text: "Kurzer Wissenstest nach jedem Modul — Kirkpatrick Level 2, anonym auswertbar.",
              },
              {
                nr: "04",
                titel: "Online-Begleitung",
                text: "Alle Unterlagen, Kompetenzkarte und Lernfortschritt im FKB Campus.",
              },
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

      {/* ── WISSENSCHAFTLICHE GRUNDLAGE ──────────────────────── */}
      <section className="border-b border-line px-6 lg:px-14 py-20 max-w-[1240px] mx-auto">
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
              {
                modell: "Dreyfus-Modell",
                beschreibung:
                  "Die drei Etappen entsprechen den Dreyfus-Stufen 2–4. Jedes Modul ist einer Kompetenzstufe zugeordnet.",
              },
              {
                modell: "Bloom-Taxonomie",
                beschreibung:
                  "Alle Lernziele sind nach Anderson & Krathwohl (2001) formuliert — mit taxonomiestufengerechten Verben.",
              },
              {
                modell: "Kirkpatrick-Modell",
                beschreibung:
                  "Evaluation auf Level 1–3: Reaktion, Lernerfolg und Verhaltenstransfer in den Arbeitsalltag.",
              },
            ].map((item) => (
              <div key={item.modell} className="border-t border-line pt-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.07em] text-accent mb-3">
                  {item.modell}
                </div>
                <p className="font-serif text-[14px] text-ink-2 leading-relaxed">
                  {item.beschreibung}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-primary text-white px-6 lg:px-14 py-20 lg:py-28">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
              href="mailto:kreisel-sendung7x@icloud.com?subject=Firmenkundenakademie – Gesprächsanfrage"
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
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.06em] text-center pt-2">
              FKB Campus · kreisel-sendung7x@icloud.com
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
