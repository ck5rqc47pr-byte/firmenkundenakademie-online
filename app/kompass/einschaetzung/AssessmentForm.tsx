"use client";

import { actionSaveAssessment } from "./actions";
import { useRef, useState } from "react";

type Stufe = {
  value: 1 | 2 | 3;
  label: string;
  sub: string;
};

const FIELDS: {
  slug: string;
  label: string;
  beschreibung: string;
  stufen: Stufe[];
}[] = [
  {
    slug: "finanzanalyse",
    label: "Finanzanalyse & Kreditexpertise",
    beschreibung: "Bilanz- & GuV-Analyse · M01 · M02 · M03 · M04 · M05 · M21",
    stufen: [
      {
        value: 1,
        label: "Berater",
        sub: "Ich lese und verstehe Jahresabschlüsse und erkenne Standard-Kennzahlen wie EK-Quote, Cashflow und DSCR.",
      },
      {
        value: 2,
        label: "Sparringspartner",
        sub: "Ich interpretiere Bilanzpolitik, erkenne Gestaltungsspielräume und erstelle eigenständig Kapitaldienstfähigkeitsberechnungen.",
      },
      {
        value: 3,
        label: "Strategischer Partner",
        sub: "Ich führe strategische Bilanzgespräche auf Augenhöhe mit GF/CFO und leite Handlungsempfehlungen aus der Finanzanalyse ab.",
      },
    ],
  },
  {
    slug: "branchenwissen",
    label: "Branchenwissen",
    beschreibung: "KMU / Mittelstand · M06 · M07 · M08 · M09",
    stufen: [
      {
        value: 1,
        label: "Berater",
        sub: "Ich kenne branchentypische Kennzahlen und Finanzierungsanlässe der Top-5-Branchen in meinem Bestand.",
      },
      {
        value: 2,
        label: "Sparringspartner",
        sub: "Ich verstehe Wertschöpfungsketten, erkenne Branchenzyklen und deren Auswirkung auf die Bonität meiner Kunden.",
      },
      {
        value: 3,
        label: "Strategischer Partner",
        sub: "Ich fungiere als Branchenexperte, vernetze Kunden untereinander und antizipiere Marktveränderungen proaktiv.",
      },
    ],
  },
  {
    slug: "gespraechsfuehrung",
    label: "Gesprächsführung & Beratung",
    beschreibung: "Bedarfsanalyse & Gesprächsstruktur · M10 · M11 · M12",
    stufen: [
      {
        value: 1,
        label: "Berater",
        sub: "Ich führe strukturierte Beratungsgespräche nach VR-Finanzplan-Standards und stelle gezielt offene Fragen.",
      },
      {
        value: 2,
        label: "Sparringspartner",
        sub: "Ich lenke Gespräche auf strategische Themen und identifiziere latente Bedarfe hinter dem eigentlichen Auftrag.",
      },
      {
        value: 3,
        label: "Strategischer Partner",
        sub: "Ich führe CEO-Dialoge auf Augenhöhe und moderiere komplexe Entscheidungsprozesse beim Kunden.",
      },
    ],
  },
  {
    slug: "vertrieb",
    label: "Vertrieb & Ertragsmanagement",
    beschreibung: "Cross-Selling & Verbundgeschäft · M13 · M14 · M15 · M16",
    stufen: [
      {
        value: 1,
        label: "Berater",
        sub: "Ich nutze systematisch Gesprächsanlässe und kenne die Angebote der Verbundpartner (R+V, Union Investment, Schwäbisch Hall u. a.).",
      },
      {
        value: 2,
        label: "Sparringspartner",
        sub: "Ich entwickle kundenindividuelle Produktbündel und steuere aktiv den Deckungsbeitrag pro Kunde.",
      },
      {
        value: 3,
        label: "Strategischer Partner",
        sub: "Ich baue integrierte Beratungskonzepte über alle Verbundpartner und optimiere den Kundenertragswert langfristig.",
      },
    ],
  },
  {
    slug: "digital",
    label: "Digitale Kompetenz",
    beschreibung: "Atruvia / agree-Systeme · M17 · M18",
    stufen: [
      {
        value: 1,
        label: "Berater",
        sub: "Ich bediene Kernprozesse in agree sicher: Kreditantrag, Kontoeröffnung, VR-Standardprozesse.",
      },
      {
        value: 2,
        label: "Sparringspartner",
        sub: "Ich nutze erweiterte agree-Funktionen effizient: Auswertungen, Workflows und Schnittstellen.",
      },
      {
        value: 3,
        label: "Strategischer Partner",
        sub: "Ich identifiziere Prozessoptimierungen, gebe qualifiziertes Feedback an IT/Orga und teste neue Funktionen proaktiv.",
      },
    ],
  },
  {
    slug: "fuehrung",
    label: "Führung & Zusammenarbeit",
    beschreibung: "Teamarbeit & Wissenstransfer · M19 · M20",
    stufen: [
      {
        value: 1,
        label: "Berater",
        sub: "Ich teile relevante Informationen im Team und nehme aktiv an Fallbesprechungen teil.",
      },
      {
        value: 2,
        label: "Sparringspartner",
        sub: "Ich übernehme eine Mentorenrolle für jüngere Kollegen und leite Fachthemen in Teamrunden.",
      },
      {
        value: 3,
        label: "Strategischer Partner",
        sub: "Ich entwickle Schulungsformate, baue eine Wissensdatenbank auf und fördere eine Lernkultur im Bereich.",
      },
    ],
  },
];

export function AssessmentForm({
  initial,
}: {
  initial: Record<string, number>;
}) {
  const [values, setValues] = useState<Record<string, number>>(initial);
  const formRef = useRef<HTMLFormElement>(null);

  const allFilled = FIELDS.every((f) => values[f.slug] !== undefined);

  return (
    <form ref={formRef} action={actionSaveAssessment} className="space-y-10">
      {FIELDS.map((field, i) => (
        <div key={field.slug} className="border-b border-line pb-10 last:border-b-0">
          <div className="flex items-start gap-5 mb-6">
            <span className="font-mono text-[10px] text-ink-3 mt-0.5 shrink-0 w-5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-serif text-xl font-medium text-ink mb-1">
                {field.label}
              </h3>
              <p className="font-mono text-[11px] text-ink-3 uppercase tracking-[0.06em]">
                {field.beschreibung}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-10">
            {field.stufen.map((stufe) => {
              const isSelected = values[field.slug] === stufe.value;
              return (
                <label
                  key={stufe.value}
                  className={`cursor-pointer border p-4 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-line hover:border-ink-2"
                  }`}
                >
                  <input
                    type="radio"
                    name={field.slug}
                    value={stufe.value}
                    className="sr-only"
                    checked={isSelected}
                    onChange={() =>
                      setValues((v) => ({ ...v, [field.slug]: stufe.value }))
                    }
                  />
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full border flex-shrink-0 transition-all ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-ink-3"
                      }`}
                    />
                    <span
                      className={`font-mono text-[11px] uppercase tracking-[0.07em] font-medium ${
                        isSelected ? "text-primary" : "text-ink-2"
                      }`}
                    >
                      {stufe.label}
                    </span>
                  </div>
                  <p className="font-serif text-[13px] text-ink-2 leading-snug pl-4">
                    {stufe.sub}
                  </p>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="pt-4 flex items-center gap-6">
        <button
          type="submit"
          disabled={!allFilled}
          className={`font-mono text-[11px] uppercase tracking-[0.08em] px-8 py-3.5 transition-all ${
            allFilled
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-line text-ink-3 cursor-not-allowed"
          }`}
        >
          Kompetenzkarte speichern →
        </button>
        {!allFilled && (
          <span className="font-mono text-[10px] text-ink-3 uppercase tracking-[0.06em]">
            Bitte alle {FIELDS.length} Felder ausfüllen
          </span>
        )}
      </div>
    </form>
  );
}
