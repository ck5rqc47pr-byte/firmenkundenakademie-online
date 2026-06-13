import type { ReactNode } from "react";

// Sichtbarer Platzhalter – muss vor Go-live durch reale, rechtlich geprüfte Angaben ersetzt werden.
function PH({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-amber-100 px-1 font-medium text-amber-900">
      [ {children} ]
    </mark>
  );
}

export default function ImpressumPage() {
  return (
    <section className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-card lg:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Rechtliches</p>
      <h1 className="mt-3 text-4xl font-semibold text-primary">Impressum</h1>

      <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Entwurf – noch nicht rechtlich freigegeben.</strong> Alle gelb markierten Felder
        müssen durch reale Angaben ersetzt und vor dem Go-live anwaltlich/rechtlich geprüft werden
        (Pflichtangaben nach § 5 DDG, vormals § 5 TMG).
      </div>

      <div className="mt-6 space-y-6 text-slate-700">
        <div>
          <h2 className="text-lg font-semibold text-primary">Diensteanbieter</h2>
          <p className="mt-2">
            <PH>Vollständiger Name / Firmenbezeichnung des Diensteanbieters</PH>
            <br />
            <PH>Straße und Hausnummer</PH>
            <br />
            <PH>PLZ und Ort</PH>
            <br />
            <PH>Land</PH>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-primary">Vertreten durch</h2>
          <p className="mt-2">
            <PH>Vertretungsberechtigte Person(en)</PH>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-primary">Kontakt</h2>
          <p className="mt-2">
            Telefon: <PH>Telefonnummer</PH>
            <br />
            E-Mail: <PH>kontakt@…</PH>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-primary">Registereintrag</h2>
          <p className="mt-2">
            <PH>Registergericht und Registernummer – nur falls eingetragen (HRB/HRA), sonst Abschnitt entfernen</PH>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-primary">Umsatzsteuer-ID</h2>
          <p className="mt-2">
            <PH>USt-IdNr. nach § 27a UStG – falls vorhanden, sonst Abschnitt entfernen</PH>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-primary">Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)</h2>
          <p className="mt-2">
            <PH>Name und Anschrift der inhaltlich verantwortlichen Person</PH>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-primary">EU-Streitschlichtung</h2>
          <p className="mt-2">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              className="text-accent underline"
              target="_blank"
              rel="noreferrer"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . <PH>Hinweis ergänzen, ob zur Teilnahme an einem Verbraucherschlichtungsverfahren bereit/verpflichtet</PH>
          </p>
        </div>
      </div>
    </section>
  );
}
