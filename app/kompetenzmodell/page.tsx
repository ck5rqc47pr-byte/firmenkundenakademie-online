"use client";

import { useState } from "react";

// ── Daten ────────────────────────────────────────────────────────────────────

type Stufe = "berater" | "sparring" | "stratege";

interface Kompetenz {
  name: string;
  stufen: Record<Stufe, string>;
}

interface Kompetenzfeld {
  id: string;
  name: string;
  color: string;
  textColor: string;
  kompetenzen: Kompetenz[];
}

const KOMPETENZFELDER: Kompetenzfeld[] = [
  {
    id: "K-01",
    name: "Finanzanalyse & Kreditexpertise",
    color: "var(--primary)",
    textColor: "var(--primary-ink)",
    kompetenzen: [
      {
        name: "Bilanz- & GuV-Analyse",
        stufen: {
          berater:  "Liest und versteht Jahresabschlüsse; erkennt Standard-Kennzahlen (EKQ, Cashflow, DSCR)",
          sparring: "Interpretiert Bilanzpolitik, erkennt Gestaltungsspielräume; erstellt eigenständig Kapitaldienstfähigkeitsberechnungen",
          stratege: "Führt strategische Bilanzgespräche auf Augenhöhe mit GF/CFO; leitet Handlungsempfehlungen aus Finanzanalyse ab",
        },
      },
      {
        name: "Kreditrisikofrüherkennung",
        stufen: {
          berater:  "Kennt die 10 Frühwarnindikatoren; nutzt Checklisten zur Identifikation",
          sparring: "Erkennt Risikocluster selbstständig; initiiert proaktiv Gespräche bei Auffälligkeiten",
          stratege: "Entwickelt branchenspezifische Frühwarnsysteme; berät Kunden zur Risikovermeidung als Mehrwert",
        },
      },
      {
        name: "Sicherheitenbewertung & BelWertV",
        stufen: {
          berater:  "Kennt Grundlagen der Beleihungswertermittlung; ordnet Sicherheitenarten korrekt zu",
          sparring: "Bewertet komplexe Sicherheitenpakete eigenständig; erkennt Optimierungspotenziale",
          stratege: "Strukturiert Sicherheitenkonzepte strategisch; berät zu alternativen Besicherungsmodellen",
        },
      },
    ],
  },
  {
    id: "K-02",
    name: "Branchenwissen",
    color: "oklch(0.38 0.10 280)",
    textColor: "var(--primary-ink)",
    kompetenzen: [
      {
        name: "KMU / Mittelstand",
        stufen: {
          berater:  "Kennt branchentypische Kennzahlen und Finanzierungsanlässe der Top-5-Branchen im Bestand",
          sparring: "Versteht Wertschöpfungsketten; erkennt Branchenzyklen und deren Auswirkung auf Bonität",
          stratege: "Fungiert als Branchenexperte; vernetzt Kunden untereinander; antizipiert Marktveränderungen",
        },
      },
      {
        name: "Gewerbekunden / Kleingewerbe",
        stufen: {
          berater:  "Kennt typische Geschäftsmodelle und Finanzierungsbedarf im Kleingewerbe",
          sparring: "Erkennt Wachstumspotenziale und Professionalisierungsbedarf; bietet passende Lösungen",
          stratege: "Begleitet Transformation vom Gewerbe- zum Mittelstandskunden; entwickelt Wachstumsstrategien",
        },
      },
      {
        name: "Freie Berufe / Heilberufe",
        stufen: {
          berater:  "Kennt Standesrecht-Basics, typische Investitionszyklen und KV-/Abrechnungssysteme",
          sparring: "Versteht Praxisbewertung, MVZ-Strukturen und berufsrechtliche Finanzierungsbesonderheiten",
          stratege: "Berät zu Kooperationsmodellen, Nachfolge und strategischer Praxisentwicklung",
        },
      },
      {
        name: "Immobilieninvestoren / Bauträger",
        stufen: {
          berater:  "Kennt Grundlagen der Projektfinanzierung, LTV/LTC und Bauträger-Kalkulationslogik",
          sparring: "Bewertet Projekte eigenständig inkl. Sensitivitätsanalyse; versteht Mietmarkt-Dynamiken",
          stratege: "Strukturiert komplexe Projektfinanzierungen; berät zu Portfolio-Strategien und ESG-Anforderungen",
        },
      },
    ],
  },
  {
    id: "K-03",
    name: "Gesprächsführung & Beratung",
    color: "var(--accent-ink)",
    textColor: "var(--primary-ink)",
    kompetenzen: [
      {
        name: "Bedarfsanalyse & Gesprächsstruktur",
        stufen: {
          berater:  "Führt strukturierte Beratungsgespräche nach VR-Finanzplan-Standards; stellt offene Fragen",
          sparring: "Lenkt Gespräche auf strategische Themen; identifiziert latente Bedarfe hinter dem Auftrag",
          stratege: "Führt CEO-Dialoge auf Augenhöhe; moderiert komplexe Entscheidungsprozesse beim Kunden",
        },
      },
      {
        name: "Einwandbehandlung & Verhandlung",
        stufen: {
          berater:  "Beherrscht Standard-Einwandtechniken; argumentiert produktbezogen sicher",
          sparring: "Verhandelt Konditionen wertbasiert; nutzt Gesamtbeziehungsargumentation",
          stratege: "Führt Verhandlungen auf Vorstandsebene; setzt Preise durch strategische Positionierung durch",
        },
      },
      {
        name: "Nachfolge- & Strategieberatung",
        stufen: {
          berater:  "Kennt Grundlagen der Unternehmensnachfolge und die relevanten Produkte der Bank",
          sparring: "Identifiziert proaktiv Nachfolge-Situationen; vernetzt mit Spezialisten (Steuerberater, Recht)",
          stratege: "Begleitet den gesamten Nachfolgeprozess als Trusted Advisor; entwickelt Finanzierungskonzepte für MBO/MBI",
        },
      },
    ],
  },
  {
    id: "K-04",
    name: "Vertrieb & Ertragsmanagement",
    color: "oklch(0.40 0.12 20)",
    textColor: "var(--primary-ink)",
    kompetenzen: [
      {
        name: "Cross-Selling & Verbundgeschäft",
        stufen: {
          berater:  "Nutzt systematisch Gesprächsanlässe; kennt die Verbundpartner-Angebote (R+V, Union, Schwäbisch Hall etc.)",
          sparring: "Entwickelt kundenindividuelle Produktbündel; steuert aktiv den Deckungsbeitrag pro Kunde",
          stratege: "Baut integrierte Beratungskonzepte über alle Verbundpartner; optimiert den Kundenertragswert langfristig",
        },
      },
      {
        name: "Akquisition & Marktbearbeitung",
        stufen: {
          berater:  "Bearbeitet zugewiesene Leads; nutzt CRM-Impulse systematisch",
          sparring: "Generiert eigenständig Akquise-Anlässe aus Markt- und Brancheninformationen",
          stratege: "Entwickelt und implementiert Marktbearbeitungsstrategien für definierte Zielgruppen; gewinnt A-Kunden aktiv",
        },
      },
      {
        name: "Nettomarktzeit & Selbstmanagement",
        stufen: {
          berater:  "Dokumentiert NMZ gewissenhaft; erreicht Mindest-NMZ-Quote",
          sparring: "Optimiert eigenständig den Tagesablauf; delegiert ADM-Aufgaben systematisch",
          stratege: "Steuert NMZ strategisch; coacht Kollegen bei der Optimierung; nutzt NMZ-Analyse zur Vertriebssteuerung",
        },
      },
    ],
  },
  {
    id: "K-05",
    name: "Digitale Kompetenz",
    color: "oklch(0.38 0.10 160)",
    textColor: "var(--primary-ink)",
    kompetenzen: [
      {
        name: "Atruvia / agree-Systeme",
        stufen: {
          berater:  "Bedient Kernprozesse sicher (Kreditantrag, Kontoeröffnung, VR-Prozesse)",
          sparring: "Nutzt erweiterte Funktionen effizient (Auswertungen, Workflows, Schnittstellen)",
          stratege: "Identifiziert Prozessoptimierungen; gibt qualifiziertes Feedback an IT/Orga; testet neue Funktionen",
        },
      },
      {
        name: "Microsoft 365 & Datenanalyse",
        stufen: {
          berater:  "Nutzt Teams, Outlook, Excel auf Standard-Niveau für Tagesgeschäft",
          sparring: "Erstellt eigene Auswertungen in Excel/Power BI; nutzt Power Automate für Routineaufgaben",
          stratege: "Entwickelt datengetriebene Vertriebsanalysen; automatisiert Workflows; treibt digitale Innovation im Team",
        },
      },
    ],
  },
  {
    id: "K-06",
    name: "Führung & Zusammenarbeit",
    color: "oklch(0.38 0.06 60)",
    textColor: "var(--primary-ink)",
    kompetenzen: [
      {
        name: "Teamarbeit & Wissenstransfer",
        stufen: {
          berater:  "Teilt relevante Informationen im Team; nimmt an Fallbesprechungen teil",
          sparring: "Übernimmt Mentorenrolle für jüngere Kollegen; leitet Fachthemen in Teamrunden",
          stratege: "Entwickelt Schulungsformate; baut Wissensdatenbank auf; fördert eine Lernkultur im Bereich",
        },
      },
      {
        name: "Netzwerk & Stakeholder-Management",
        stufen: {
          berater:  "Pflegt interne Kontakte (Marktfolge, Spezialisten); kennt Entscheidungswege",
          sparring: "Baut aktiv Netzwerk zu Steuerberatern, WP, Rechtsanwälten auf; nutzt Multiplikatoren",
          stratege: "Ist als Firmenkundenexperte regional sichtbar; pflegt strategische Netzwerke (IHK, Verbände, Politik)",
        },
      },
    ],
  },
];

// ── Stufe-Konfiguration ───────────────────────────────────────────────────────

const STUFEN: { id: Stufe; label: string; badge: string; color: string }[] = [
  { id: "berater",  label: "Berater",         badge: "Stufe 1", color: "oklch(0.38 0.10 160)" },
  { id: "sparring", label: "Sparringspartner", badge: "Stufe 2", color: "var(--accent-ink)" },
  { id: "stratege", label: "Stratege",         badge: "Stufe 3", color: "var(--primary)" },
];

// ── Komponenten ───────────────────────────────────────────────────────────────

function StufeCell({ text, stufe, active }: { text: string; stufe: typeof STUFEN[0]; active: boolean }) {
  if (!active) return null;
  return (
    <div
      className="p-3 text-sm leading-6 text-ink-2"
      style={{ borderLeft: `2px solid ${stufe.color}`, background: "var(--bg-2)" }}
    >
      {text}
    </div>
  );
}

function KompetenzRow({
  kompetenz,
  activeStufen,
}: {
  kompetenz: Kompetenz;
  activeStufen: Stufe[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-line last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 py-3 text-left"
      >
        <span className="font-sans text-sm font-[500] text-ink">{kompetenz.name}</span>
        <span
          className="shrink-0 font-mono text-ink-3 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "" }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div
          className="mb-3 grid gap-2"
          style={{
            gridTemplateColumns:
              activeStufen.length > 1 ? `repeat(${activeStufen.length}, 1fr)` : "1fr",
          }}
        >
          {STUFEN.filter((s) => activeStufen.includes(s.id)).map((stufe) => (
            <StufeCell key={stufe.id} text={kompetenz.stufen[stufe.id]} stufe={stufe} active={true} />
          ))}
        </div>
      )}
    </div>
  );
}

function KompetenzfeldCard({
  feld,
  activeStufen,
}: {
  feld: Kompetenzfeld;
  activeStufen: Stufe[];
}) {
  return (
    <div className="overflow-hidden border border-line bg-bg">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ background: feld.color, color: feld.textColor }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[0.06em] px-2 py-0.5"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          {feld.id}
        </span>
        <h2 className="font-sans text-sm font-[600]">{feld.name}</h2>
        <span
          className="ml-auto font-mono text-[10px] uppercase tracking-[0.06em] px-2 py-0.5"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          {feld.kompetenzen.length} Kompetenzen
        </span>
      </div>
      {/* Kompetenzen */}
      <div className="px-5">
        {feld.kompetenzen.map((k) => (
          <KompetenzRow key={k.name} kompetenz={k} activeStufen={activeStufen} />
        ))}
      </div>
    </div>
  );
}

// ── Hauptseite ────────────────────────────────────────────────────────────────

export default function KompetenzmodellPage() {
  const [activeStufen, setActiveStufen] = useState<Stufe[]>(["berater", "sparring", "stratege"]);

  function toggleStufe(stufe: Stufe) {
    setActiveStufen((prev) => {
      if (prev.includes(stufe)) {
        if (prev.length === 1) return prev;
        return prev.filter((s) => s !== stufe);
      }
      return [...prev, stufe];
    });
  }

  function selectOnly(stufe: Stufe) {
    setActiveStufen([stufe]);
  }

  return (
    <div>
      {/* Seitenkopf */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-16 lg:py-20">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 mb-6">
            § Kompetenzmodell
          </div>
          <h1 className="font-serif text-5xl lg:text-7xl font-normal leading-[0.93] tracking-[-0.035em] text-ink">
            Kompetenzmodell.
          </h1>
          <p className="mt-6 font-serif text-xl leading-relaxed text-ink-2 max-w-2xl">
            6 Kompetenzfelder · 18 Kompetenzen · 3 Entwicklungsstufen. Der strukturierte
            Entwicklungspfad vom Berater zum Strategischen Partner.
          </p>
          {/* Stufen-Legende */}
          <div className="mt-10 flex flex-wrap gap-6">
            {STUFEN.map((stufe) => (
              <div key={stufe.id} className="flex items-center gap-2">
                <span
                  className="inline-flex h-5 w-5 items-center justify-center font-mono text-[10px] text-primary-ink"
                  style={{ background: stufe.color }}
                >
                  {stufe.badge.slice(-1)}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-2">
                  {stufe.badge}: {stufe.label}
                </span>
              </div>
            ))}
            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">
              → Entwicklungsrichtung
            </span>
          </div>
        </div>
      </section>

      {/* Filter */}
      <div className="border-b border-line bg-bg-2">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-4 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
            Stufe anzeigen:
          </span>
          <button
            onClick={() => setActiveStufen(["berater", "sparring", "stratege"])}
            className={`font-mono text-[11px] uppercase tracking-[0.08em] px-3 py-2 border transition ${
              activeStufen.length === 3
                ? "bg-ink text-bg border-ink"
                : "border-line text-ink-2 hover:border-ink-2 hover:text-ink"
            }`}
          >
            Alle vergleichen
          </button>
          {STUFEN.map((stufe) => {
            const isActive = activeStufen.length === 1 && activeStufen[0] === stufe.id;
            return (
              <button
                key={stufe.id}
                onClick={() => selectOnly(stufe.id)}
                className="font-mono text-[11px] uppercase tracking-[0.08em] px-3 py-2 border transition"
                style={
                  isActive
                    ? { borderColor: stufe.color, background: stufe.color, color: "var(--primary-ink)" }
                    : { borderColor: "var(--line)", background: "var(--bg)", color: "var(--ink-2)" }
                }
              >
                {stufe.badge}: {stufe.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Kompetenzfelder */}
      <div className="mx-auto max-w-content px-6 lg:px-14 py-12">
        <div className="grid gap-6 xl:grid-cols-2">
          {KOMPETENZFELDER.map((feld) => (
            <KompetenzfeldCard key={feld.id} feld={feld} activeStufen={activeStufen} />
          ))}
        </div>
        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 text-center">
          Firmenkundenakademie · Benedikt Zoller Coaching · Kompetenzmodell v1.0
        </p>
      </div>
    </div>
  );
}
