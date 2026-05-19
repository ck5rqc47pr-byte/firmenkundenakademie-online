"use client";

import { actionSaveAssessment } from "./actions";
import { useRef, useState } from "react";

const FIELDS = [
  {
    slug: "finanzanalyse",
    label: "Finanzanalyse",
    beschreibung: "Bilanzen lesen, Risikofrüherkennung, Kreditentscheidungen, Branchenrisiken",
  },
  {
    slug: "branchenwissen",
    label: "Branchenwissen",
    beschreibung: "KMU-Strukturen, Heilberufe, Immobilien, Branchen-Spezifika",
  },
  {
    slug: "gespraechsfuehrung",
    label: "Gesprächsführung",
    beschreibung: "Bedarfsanalyse, latente Bedarfe erkennen, CEO-Dialoge führen",
  },
  {
    slug: "vertrieb",
    label: "Vertrieb",
    beschreibung: "Cross-Selling, Ertrag pro Kunde, NMZ-Optimierung, Marktbearbeitung",
  },
  {
    slug: "digital",
    label: "Digital",
    beschreibung: "agree & Co. effizient nutzen, datengetriebener Vertrieb",
  },
  {
    slug: "fuehrung",
    label: "Führung",
    beschreibung: "Wissenstransfer im Team, Netzwerk & Sichtbarkeit",
  },
];

const STUFEN = [
  {
    value: 1,
    label: "Berater",
    sub: "Ich kenne die Grundlagen und wende sie mit Anleitung an.",
  },
  {
    value: 2,
    label: "Sparringspartner",
    sub: "Ich arbeite selbstständig und erkenne Zusammenhänge, die andere übersehen.",
  },
  {
    value: 3,
    label: "Stratege",
    sub: "Ich gestalte aktiv mit und berate auf Augenhöhe mit der Geschäftsführung.",
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
            {STUFEN.map((stufe) => {
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
