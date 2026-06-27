import type { ReactNode } from "react";

// Sichtbarer Platzhalter – muss vor Go-live durch reale, rechtlich geprüfte Angaben ersetzt werden.
function PH({ children }: { children: ReactNode }) {
  return (
    <mark className="bg-amber-100 px-1 font-medium text-amber-900">[ {children} ]</mark>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-line pt-6">
      <h2 className="font-serif text-xl font-normal tracking-[-0.01em] text-ink mb-2">{title}</h2>
      <div className="text-sm text-ink-2 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function ImpressumPage() {
  return (
    <div>
      {/* Header */}
      <section className="border-b border-ink bg-primary">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-3">
            Rechtliches
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-normal leading-tight tracking-[-0.03em] text-white">
            Impressum
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-content px-6 lg:px-14 py-12 space-y-8">
        {/* Rechts-Disclaimer */}
        <div className="border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed">
          <strong>Entwurf – noch nicht rechtlich freigegeben.</strong> Alle gelb markierten Felder
          müssen durch reale Angaben ersetzt und vor dem Go-live rechtlich geprüft werden
          (Pflichtangaben nach § 5 DDG, vormals § 5 TMG; § 18 MStV).
        </div>

        {/* Marken-/Rechtsträger-Hinweis */}
        <p className="text-sm text-ink-2 leading-relaxed">
          <strong className="text-ink">FKB Campus</strong> ist die Marken- und Angebotsbezeichnung
          dieser Plattform. Diensteanbieter im Sinne des Gesetzes ist die unten genannte reale
          natürliche oder juristische Person – die Markenbezeichnung allein genügt den
          Impressumspflichten nicht.
        </p>

        <div className="space-y-6">
          <Block title="Diensteanbieter">
            <p>
              <PH>Vollständiger Name bzw. Firmenbezeichnung des Diensteanbieters</PH>
              <br />
              <PH>Straße und Hausnummer</PH>
              <br />
              <PH>PLZ und Ort</PH>
              <br />
              Deutschland
            </p>
          </Block>

          <Block title="Vertreten durch">
            <p>
              <PH>Vertretungsberechtigte Person(en) – bei Einzelunternehmen identisch mit dem Diensteanbieter</PH>
            </p>
          </Block>

          <Block title="Kontakt">
            <p>
              E-Mail:{" "}
              <a href="mailto:hello@fkb-campus.de" className="text-primary underline">
                hello@fkb-campus.de
              </a>
              <br />
              Telefon: <PH>Telefonnummer (empfohlen, nicht zwingend, wenn schnelle E-Mail-Erreichbarkeit besteht)</PH>
            </p>
          </Block>

          <Block title="Registereintrag">
            <p>
              <PH>Registergericht und Registernummer (HRB/HRA) – nur falls eingetragen, sonst diesen Abschnitt entfernen</PH>
            </p>
          </Block>

          <Block title="Umsatzsteuer-Identifikationsnummer">
            <p>
              <PH>USt-IdNr. nach § 27a UStG – falls vorhanden, sonst diesen Abschnitt entfernen</PH>
            </p>
          </Block>

          <Block title="Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)">
            <p>
              <PH>Name und Anschrift der inhaltlich verantwortlichen Person – bei Einzelunternehmen wie Diensteanbieter</PH>
            </p>
          </Block>

          <Block title="EU-Streitschlichtung">
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                className="text-primary underline"
                target="_blank"
                rel="noreferrer"
              >
                ec.europa.eu/consumers/odr
              </a>
              .
            </p>
          </Block>

          <Block title="Verbraucherstreitbeilegung">
            <p>
              Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.{" "}
              <PH>Anpassen, falls eine Teilnahmebereitschaft/-pflicht besteht</PH>
            </p>
          </Block>

          <Block title="Haftung für Inhalte">
            <p>
              Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
              Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.
              Als Diensteanbieter sind wir für eigene Inhalte nach den allgemeinen Gesetzen
              verantwortlich (§ 7 Abs. 1 DDG).
            </p>
          </Block>

          <Block title="Haftung für Links">
            <p>
              Unser Angebot kann Links zu externen Websites Dritter enthalten, auf deren Inhalte
              wir keinen Einfluss haben. Für diese fremden Inhalte ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich.
            </p>
          </Block>

          <Block title="Urheberrecht">
            <p>
              Die durch den Diensteanbieter erstellten Inhalte und Werke auf diesen Seiten
              unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.
            </p>
          </Block>
        </div>
      </div>
    </div>
  );
}
