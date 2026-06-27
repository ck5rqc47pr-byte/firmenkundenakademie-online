import Link from "next/link";
import { getAllModules, getKompetenzfelder } from "@/lib/modules";
import { FeedbackKreislauf } from "@/components/FeedbackKreislauf";
import { Entwicklungspfad } from "@/components/Entwicklungspfad";

const ETAPPEN = [
  {
    nr: 1,
    titel: "Beraterhandwerk",
    sub: "Berater",
    beschreibung:
      "Bilanzen lesen, Risiken früh erkennen, KMU-Strukturen verstehen. Die handwerkliche Grundlage, auf der alles Weitere aufbaut.",
    module: ["Bilanzlesen", "Kreditrisikofrüherkennung", "KMU-Kompetenz", "NMZ-Optimierung", "agree & Co.", "Cross-Selling"],
  },
  {
    nr: 2,
    titel: "Sparringspartner",
    sub: "Sparringspartner",
    beschreibung:
      "Der Kunde sucht das Gespräch, weil der Berater Strukturen erkennt, die andere übersehen — und Optionen aufzeigt, die er selbst nicht gesehen hätte.",
    module: ["Bilanzgespräch", "Bedarfsanalyse", "Latente Bedarfe", "Heilberufe", "Immobilien", "Ertragsoptimierung", "Datengetriebener Vertrieb", "Wissenstransfer", "Kreditentscheidung", "Geschäftsmodell & Strategie"],
  },
  {
    nr: 3,
    titel: "Strategischer Partner",
    sub: "Strategischer Partner",
    beschreibung:
      "Nachfolge, Kapitalstruktur, Marktbearbeitung: Themen, in denen aus Beratung Partnerschaft wird — auf Augenhöhe mit der Geschäftsführung.",
    module: ["Strategischer Finanzdialog", "Branchenrisiken", "CEO-Dialog & Nachfolge", "Marktbearbeitung", "Branchenexperte", "Netzwerk & Sichtbarkeit"],
  },
];

const MANIFEST = [
  ["I.", "Praxis trifft Evidenz", "Inhalte aus echten Fragestellungen — fachlich geprüft und wissenschaftlich fundiert."],
  ["II.", "Klarheit als Disziplin", "Komplexes verdichtet, damit es im Alltag anwendbar bleibt — ohne Tiefe zu verlieren."],
  ["III.", "Kundennutzen vor Produkt", "Beratung, die das Unternehmen versteht — nicht das Erklären von Produkten."],
  ["IV.", "Austausch, der zurückfließt", "Hinweise aus der Praxis fließen geprüft in den Campus und seine Weiterentwicklung ein."],
];

export default function HomePage() {
  const alleModule = getAllModules();
  const moduleCount = alleModule.length;
  const countByStufe = (stufe: string) =>
    alleModule.filter((m) => m.stufe === stufe).length;
  const felderBerater = getKompetenzfelder("berater");
  const felderAssistenz = getKompetenzfelder("assistenz");
  const feldZahl = felderBerater.length + felderAssistenz.length;

  return (
    <div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-content px-6 lg:px-14 pt-16 pb-14 lg:pt-24 lg:pb-20">
          <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3 mb-8 flex items-center gap-3">
            <span className="w-6 h-px bg-ink-3 inline-block" />
            FKB Campus · Für Bereichsleiter Firmenkunden
          </div>
          <h1
            className="font-serif text-[clamp(44px,7vw,96px)] font-normal leading-[0.95] tracking-[-0.035em] mb-8 max-w-4xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Aus Beratern werden{" "}
            <em className="italic" style={{ color: "var(--accent)" }}>
              Strategische Partner.
            </em>
          </h1>
          <p className="font-serif text-xl text-ink-2 leading-relaxed max-w-2xl mb-6">
            Der FKB Campus ist ein praxisorientiertes Qualifizierungsprogramm
            für Firmenkundenberater in Volksbanken und Raiffeisenbanken —
            wissenschaftlich fundiert, direkt auf den Beratungsalltag zugeschnitten.
          </p>
          <p className="font-serif text-lg text-ink-2 leading-relaxed max-w-2xl mb-12 border-l-2 border-accent pl-5">
            Wir machen relevantes Wissen im Firmenkundengeschäft sichtbar, prüfbar und
            anwendbar — für ein Firmenkundengeschäft, in dem Wissen nicht verloren geht und
            Beratung kontinuierlich besser wird.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:hello@fkb-campus.de?subject=Firmenkundenakademie – Interesse"
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
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-line bg-primary text-white">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { num: String(moduleCount), label: "Module" },
            { num: "3",      label: "Etappen" },
            { num: String(feldZahl), label: "Kompetenzfelder" },
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
      <section className="border-b border-ink">
        <div className="mx-auto max-w-content px-6 lg:px-14 pt-16 pb-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-5 flex items-center gap-2">
            <span className="w-4 h-px inline-block bg-ink-3" />
            Das Programm
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-normal tracking-[-0.02em] leading-tight max-w-xl">
            Drei Etappen. Ein klarer{" "}
            <em className="italic text-ink-2">Entwicklungspfad.</em>
          </h2>
        </div>
        <div className="mx-auto max-w-content px-6 lg:px-14 pb-14">
          <Entwicklungspfad className="w-full max-w-4xl mx-auto h-auto" />
        </div>
        <div className="mx-auto max-w-content border-t border-ink">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {ETAPPEN.map((e, i) => {
              const isDark   = i === 2;
              const isAccent = i === 1;
              const numerals = ["I.", "II.", "III."];
              return (
                <div
                  key={e.nr}
                  className={`px-8 lg:px-10 pt-10 pb-12 ${i < 2 ? "border-b lg:border-b-0 lg:border-r border-ink" : ""}`}
                  style={{ background: isDark ? "var(--primary)" : isAccent ? "var(--accent)" : "var(--bg-2)" }}
                >
                  {/* Roman numeral */}
                  <div
                    className="font-serif text-[54px] leading-none italic mb-5"
                    style={{ color: isDark ? "var(--accent)" : "var(--primary)" }}
                  >
                    {numerals[i]}
                  </div>
                  {/* Eyebrow */}
                  <div className={`font-mono text-[9px] uppercase tracking-[0.1em] mb-2 ${isDark ? "text-white/40" : "text-ink-3"}`}>
                    Etappe {e.nr}
                  </div>
                  {/* Title */}
                  <h3 className={`font-serif text-2xl font-normal tracking-[-0.01em] mb-1 ${isDark ? "text-white" : "text-ink"}`}>
                    {e.titel}
                  </h3>
                  <div className={`font-mono text-[9px] uppercase tracking-[0.06em] mb-5 ${isDark ? "text-white/40" : "text-ink-3"}`}>
                    {countByStufe(e.sub)} Module · Zielstufe: {e.sub}
                  </div>
                  <div className={`h-px mb-5 ${isDark ? "bg-white/15" : "bg-ink/20"}`} />
                  {/* Description */}
                  <p className={`font-serif text-[15px] leading-relaxed mb-6 ${isDark ? "text-white/60" : "text-ink-2"}`}>
                    {e.beschreibung}
                  </p>
                  <div className={`h-px mb-5 ${isDark ? "bg-white/15" : "bg-line"}`} />
                  {/* Module list */}
                  <div className="space-y-1.5">
                    {e.module.slice(0, 4).map((m) => (
                      <div key={m} className={`flex items-center gap-2 font-mono text-[10px] ${isDark ? "text-white/40" : "text-ink-3"}`}>
                        <span>—</span><span>{m}</span>
                      </div>
                    ))}
                    {e.module.length > 4 && (
                      <div className={`font-mono text-[10px] font-medium ${isDark ? "text-white/30" : "text-ink-3"}`}>
                        + {e.module.length - 4} weitere
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MANIFEST ──────────────────────────────────────────────────────── */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-20">
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-5 flex items-center gap-2">
            <span className="w-4 h-px inline-block bg-ink-3" />
            Das Versprechen
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-normal tracking-[-0.02em] leading-tight mb-14 max-w-xl">
            Vier Leitwerte.{" "}
            <em className="italic text-ink-2">Ein Anspruch.</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MANIFEST.map(([n, t, d]) => (
              <div key={n} className="border border-line p-8 flex flex-col">
                <div
                  className="font-serif text-4xl italic leading-[0.9]"
                  style={{ color: "var(--primary)" }}
                >
                  {n}
                </div>
                <h3 className="font-serif text-xl font-normal tracking-[-0.02em] mt-5 mb-3">{t}</h3>
                <p className="text-sm leading-relaxed text-ink-2">{d}</p>
              </div>
            ))}
          </div>
          <Link
            href="/leitbild"
            className="inline-flex items-center gap-2 mt-10 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 hover:text-ink transition-all"
          >
            Mission, Vision &amp; Leitbild →
          </Link>
        </div>
      </section>

      {/* ── KOMPETENZFELDER ───────────────────────────────────────────────── */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-16">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 mb-6">
            § Kompetenzfelder
          </div>
          <h2 className="font-serif text-4xl lg:text-6xl font-normal leading-tight tracking-[-0.03em] mb-4">
            Zwei Lernpfade.{" "}
            <em style={{ fontStyle: "italic", color: "var(--primary)" }}>Ihre Kompetenzfelder.</em>
          </h2>
          <p className="font-serif text-lg text-ink-2 leading-relaxed max-w-2xl mb-12">
            Ein eigener Entwicklungspfad für Firmenkundenberater – und ein paralleler Track für
            die Vertriebsassistenz im Innendienst. Jedes Feld ein klar abgegrenzter Lernweg.
          </p>

          {[
            { label: "Firmenkundenberater", felder: felderBerater },
            { label: "Vertriebsassistenz", felder: felderAssistenz },
          ].map((track) => (
            <div key={track.label} className="mb-12 last:mb-0">
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 mb-4 flex items-center gap-2">
                <span className="w-5 h-px inline-block bg-primary" />
                {track.label} · {track.felder.length} Felder
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-ink">
                {track.felder.map((f) => (
                  <Link
                    key={f.slug}
                    href={`/kompetenzfeld/${f.slug}`}
                    className="group p-8 border-b border-r border-line hover:bg-bg-2 transition flex flex-col gap-2"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-primary">
                      {f.count} {f.count === 1 ? "Modul" : "Module"}
                    </div>
                    <div className="font-serif text-xl font-[500] leading-tight text-ink group-hover:text-primary transition">
                      {f.name}
                    </div>
                    <div className="font-mono text-[11px] text-ink-3 mt-auto pt-4">Entdecken →</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EINSATZFERTIG / ZWEI WEGE ─────────────────────────────────────── */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-5 flex items-center gap-2">
                <span className="w-4 h-px inline-block bg-ink-3" />
                Einsatzfertig
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl font-normal tracking-[-0.02em] leading-tight mb-5">
                Aufschlagen und{" "}
                <em className="italic text-ink-2">loslegen.</em>
              </h2>
              <p className="font-serif text-lg text-ink-2 leading-relaxed mb-7">
                Keine Zeit zur Vorbereitung? Jedes Modul kommt einsatzfertig — Ihr Bereichs-
                oder Teamleiter führt es durch, ganz ohne Vorbereitungsaufwand.
              </p>
              <ul className="space-y-2.5">
                {[
                  "Trainerhandbuch mit Regie & Minuten-Zeitplan",
                  "Fertiges Foliendeck (PPTX)",
                  "Teilnehmer-Workbook mit Praxiscases",
                  "Musterlösungen für den Trainer",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 font-serif text-[15px] text-ink-2 leading-snug">
                    <span className="font-mono text-accent text-xs pt-1">▪</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  nr: "Weg 1",
                  titel: "Inhouse-Workshop",
                  text: "Durch Ihren eigenen Trainer, Bereichs- oder Teamleiter — oder Sie buchen einen unserer Trainer. Alle Unterlagen liegen fertig bereit.",
                  badge: "Verfügbar",
                  verfuegbar: true,
                },
                {
                  nr: "Weg 2",
                  titel: "Vorproduziertes Webinar",
                  text: "Module als vorproduziertes Video — Wissensvermittlung ganz ohne eigene Durchführung, jederzeit im Campus abrufbar.",
                  badge: "In Vorbereitung",
                  verfuegbar: false,
                },
              ].map((w) => (
                <div key={w.nr} className="border border-line p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">{w.nr}</span>
                    <span
                      className={`font-mono text-[9px] uppercase tracking-[0.08em] px-2.5 py-1 border ${
                        w.verfuegbar
                          ? "text-accent border-accent"
                          : "text-ink-3 border-line"
                      }`}
                    >
                      {w.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-normal tracking-[-0.01em] text-ink mb-3">{w.titel}</h3>
                  <p className="font-serif text-[15px] text-ink-2 leading-relaxed">{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FORMAT & DURCHFÜHRUNG ─────────────────────────────────────────── */}
      <section className="border-b border-line bg-bg-2">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-20">
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-5 flex items-center gap-2">
            <span className="w-4 h-px inline-block bg-ink-3" />
            So ist ein Modul aufgebaut
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-normal tracking-[-0.02em] leading-tight mb-14 max-w-xl">
            Lernen, das in den{" "}
            <em className="italic text-ink-2">Alltag passt.</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { nr: "01", titel: "Kompaktes Format",  text: "90–180 Minuten je Modul — fokussiert auf konkrete Situationen aus dem Beratungsalltag." },
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

      {/* ── FEEDBACK-VERSPRECHEN ─────────────────────────────────────────── */}
      <section className="border-b border-ink bg-bg">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent mb-5 flex items-center gap-2">
                <span className="w-4 h-px inline-block bg-accent" />
                Lebendiges Programm
              </div>
              <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-normal leading-[1.1] tracking-[-0.02em] mb-5">
                Jeder Hinweis zählt.{" "}
                <em className="italic text-ink-2">Garantiert.</em>
              </h2>
              <p className="font-serif text-lg text-ink-2 leading-relaxed">
                Der FKB Campus wächst durch das Feedback derer, die ihn nutzen.
                Jeder Verbesserungsvorschlag wird geprüft — kritische Fehler sofort
                korrigiert, alle anderen Hinweise innerhalb von 5 Werktagen bestätigt
                und im nächsten Revisionszyklus umgesetzt.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-line divide-y sm:divide-y-0 sm:divide-x divide-line">
              {[
                { kennzahl: "5 WT",    label: "Bestätigung",        sub: "Jeder Hinweis wird innerhalb von 5 Werktagen geprüft" },
                { kennzahl: "Sofort",  label: "Bei krit. Fehlern",  sub: "Falsche Zahlen oder Regulatorik werden umgehend korrigiert" },
                { kennzahl: "100 %",   label: "Transparenz",        sub: "Jede Änderung ist im Changelog der Modulversion sichtbar" },
              ].map((item) => (
                <div key={item.kennzahl} className="p-6">
                  <div className="font-serif text-3xl text-primary mb-1">{item.kennzahl}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.07em] text-ink-2 mb-2">{item.label}</div>
                  <p className="font-serif text-[13px] text-ink-3 leading-snug">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-14 border-t border-line pt-12">
            <FeedbackKreislauf className="w-full max-w-3xl mx-auto h-auto" />
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
              href="mailto:hello@fkb-campus.de?subject=Firmenkundenakademie – Gesprächsanfrage"
              className="inline-flex items-center justify-center gap-3 bg-white text-primary px-8 py-5 font-mono text-[11px] uppercase tracking-[0.08em] hover:bg-white/90 transition-all"
            >
              Per E-Mail melden →
            </a>
            <Link
              href="/module"
              className="inline-flex items-center justify-center gap-3 border border-white/30 text-white/80 px-8 py-5 font-mono text-[11px] uppercase tracking-[0.08em] hover:border-white hover:text-white transition-all"
            >
              Alle {moduleCount} Module ansehen
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
