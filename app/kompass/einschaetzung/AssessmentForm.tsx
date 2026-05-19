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
    label: "Finanzanalyse",
    beschreibung: "M01 · M02 · M03 · M04 · M05 · M21",
    stufen: [
      {
        value: 1,
        label: "Berater",
        sub: "Ich lese HGB-Bilanzen selbstständig, berechne EK-Quote und Anlagendeckung und erkenne erste Frühwarnsignale im Kreditportfolio.",
      },
      {
        value: 2,
        label: "Sparringspartner",
        sub: "Ich führe Bilanzgespräche nach dem 5-Phasen-Rahmen, beziehe qualitative Unternehmenssignale ein und leite Beratungsimpulse für Verbundprodukte ab.",
      },
      {
        value: 3,
        label: "Stratege",
        sub: "Ich analysiere und optimiere Kapitalstrukturen, bewerte Mezzanine und Beteiligungskapital und entwickle strategische Finanzierungspläne.",
      },
    ],
  },
  {
    slug: "branchenwissen",
    label: "Branchenwissen",
    beschreibung: "M06 · M07 · M08 · M09",
    stufen: [
      {
        value: 1,
        label: "Berater",
        sub: "Ich ordne Firmenkunden nach KMU-Kriterien ein und beschreibe typische Finanzierungsmuster und Risikofelder je Unternehmenstyp.",
      },
      {
        value: 2,
        label: "Sparringspartner",
        sub: "Ich analysiere EÜR von Heilberuflern, berechne Praxiswert nach IDW S5 und beurteile Immobilienprojekte anhand LTV, DSCR und BelWertV.",
      },
      {
        value: 3,
        label: "Stratege",
        sub: "Ich analysiere Branchen mit Porter's Five Forces und PESTEL, baue strukturiert Expertenwissen auf und positioniere mich als gefragten Branchenkenner.",
      },
    ],
  },
  {
    slug: "gespraechsfuehrung",
    label: "Gesprächsführung",
    beschreibung: "M10 · M11 · M12",
    stufen: [
      {
        value: 1,
        label: "Berater",
        sub: "Ich strukturiere Kundengespräche aktiv, stelle offene Fragen und halte relevante Informationen systematisch im UnternehmerDialog fest.",
      },
      {
        value: 2,
        label: "Sparringspartner",
        sub: "Ich wende SPIN-Fragetechnik und das Vier-Ohren-Modell an, erkenne latente Bedarfe hinter sachlichen Aussagen und führe strukturierte Bedarfsanalysen.",
      },
      {
        value: 3,
        label: "Stratege",
        sub: "Ich führe CEO-Dialoge auf Augenhöhe, erkenne emotionale Nachfolgewiderstände und entwickle gemeinsam individuelle Roadmaps über 3–7 Jahre.",
      },
    ],
  },
  {
    slug: "vertrieb",
    label: "Vertrieb",
    beschreibung: "M13 · M14 · M15 · M16",
    stufen: [
      {
        value: 1,
        label: "Berater",
        sub: "Ich identifiziere Cross-Selling-Potenziale per Wallet-Share-Methodik, wende den 4-Schritte-Prozess an und lese NMZ-Berichte in agree.",
      },
      {
        value: 2,
        label: "Sparringspartner",
        sub: "Ich berechne Kundendeckungsbeiträge, beurteile ob Beziehungen risikogerecht bepreist sind und führe wertbasierte Konditionengespräche.",
      },
      {
        value: 3,
        label: "Stratege",
        sub: "Ich entwickle Marktbearbeitungsstrategien für Zielsegmente, bewerte die Wettbewerbsposition meiner Bank und plane strukturierte Jahresmaßnahmen.",
      },
    ],
  },
  {
    slug: "digital",
    label: "Digital",
    beschreibung: "M17 · M18",
    stufen: [
      {
        value: 1,
        label: "Berater",
        sub: "Ich nutze agree sicher für Gesprächsvorbereitung, Bedarfsdokumentation und NMZ-Berichte und identifiziere Zeitfresser in meinem Workflow.",
      },
      {
        value: 2,
        label: "Sparringspartner",
        sub: "Ich werte Kundendaten systematisch für den Vertrieb aus, erkenne Abwanderungssignale frühzeitig und leite datenbasierte Aktivitäten ab.",
      },
      {
        value: 3,
        label: "Stratege",
        sub: "Ich gestalte datengetriebene Vertriebsprozesse im Team mit und nutze Kundendaten als strategisches Steuerungsinstrument.",
      },
    ],
  },
  {
    slug: "fuehrung",
    label: "Führung",
    beschreibung: "M19 · M20",
    stufen: [
      {
        value: 1,
        label: "Berater",
        sub: "Ich teile mein Wissen aktiv mit Kollegen, hole mir gezielt Feedback und übernehme Verantwortung für meine eigene Weiterentwicklung.",
      },
      {
        value: 2,
        label: "Sparringspartner",
        sub: "Ich strukturiere Wissenstransfer im Team, baue gezielt Netzwerke zu Verbundpartnern auf und etabliere mich als gefragten Ansprechpartner.",
      },
      {
        value: 3,
        label: "Stratege",
        sub: "Ich gestalte meine interne und externe Sichtbarkeit aktiv, baue Netzwerke strategisch aus und positioniere mich als Experten in meinem Feld.",
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
