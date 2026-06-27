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

export default function DatenschutzPage() {
  return (
    <div>
      {/* Header */}
      <section className="border-b border-ink bg-primary">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-3">
            Rechtliches
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-normal leading-tight tracking-[-0.03em] text-white">
            Datenschutzerklärung
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-content px-6 lg:px-14 py-12 space-y-8">
        {/* Rechts-Disclaimer */}
        <div className="border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed">
          <strong>Entwurf – noch nicht rechtlich freigegeben.</strong> Diese Erklärung listet die
          tatsächlich in der Anwendung stattfindenden Verarbeitungen auf (Login, Lernfortschritt,
          Wissenstests, Feedback, Verbesserungsvorschläge, E-Mail-Versand, Hosting, Datenbank).
          Verantwortlichen-Angaben, Rechtsgrundlagen, Speicherfristen und die zuständige
          Aufsichtsbehörde sind als Platzhalter markiert und vor dem Go-live juristisch zu prüfen.
          Diese Seite ist <em>keine</em> Rechtsberatung.
        </div>

        <div className="space-y-6">
          <Block title="1. Verantwortlicher">
            <p>
              Verantwortlich im Sinne der DSGVO ist der im Impressum genannte Diensteanbieter:
              <br />
              <PH>Name / Firma und Anschrift – identisch zum Impressum</PH>
              <br />
              E-Mail:{" "}
              <a href="mailto:hello@fkb-campus.de" className="text-primary underline">
                hello@fkb-campus.de
              </a>
            </p>
          </Block>

          <Block title="2. Datenschutzbeauftragter">
            <p>
              <PH>
                Kontakt des/der Datenschutzbeauftragten – falls bestellt. Andernfalls Hinweis, dass
                keine gesetzliche Bestellpflicht besteht (richtet sich u. a. nach § 38 BDSG).
              </PH>
            </p>
          </Block>

          <Block title="3. Hosting (Vercel)">
            <p>
              Die Plattform wird bei der Vercel Inc. (USA) betrieben. Beim Aufruf werden technisch
              notwendige Server-Logdaten (u. a. IP-Adresse, Datum und Uhrzeit, abgerufene Seite,
              Browser-/Geräteinformationen) verarbeitet, um die Auslieferung und Sicherheit der
              Seite zu gewährleisten.
            </p>
            <p>
              Rechtsgrundlage: <PH>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) – prüfen</PH>.
              Mit Vercel besteht ein Auftragsverarbeitungsvertrag. Da eine Übermittlung in die USA
              (Drittland) erfolgt, ist der Transfermechanismus zu benennen:{" "}
              <PH>EU-Standardvertragsklauseln / EU-US Data Privacy Framework – bestätigen</PH>.
            </p>
          </Block>

          <Block title="4. Datenbank (Neon)">
            <p>
              Konto-, Lern- und Feedbackdaten werden in einer PostgreSQL-Datenbank des Anbieters
              Neon gespeichert.
            </p>
            <p>
              Auftragsverarbeitungsvertrag erforderlich. Speicherort/Region:{" "}
              <PH>EU-Region oder USA – konkret benennen; bei USA Transfermechanismus angeben</PH>.
            </p>
          </Block>

          <Block title="5. Benutzerkonten & Anmeldung">
            <p>
              Der Zugang zu geschützten Inhalten erfolgt über ein Benutzerkonto. Verarbeitet werden
              Name, Login, ein kryptografisch gehashtes Passwort und die zugewiesene Rolle
              (Teilnehmer, Teamleiter, Trainer, Admin). Die Anmeldung wird über ein technisch
              notwendiges Session-Cookie (NextAuth) verwaltet. Konten werden in der Regel durch die
              auftraggebende Bank bzw. den Teamleiter angelegt.
            </p>
            <p>
              Rechtsgrundlage:{" "}
              <PH>Art. 6 Abs. 1 lit. b DSGVO (Nutzungs-/Vertragsverhältnis) – prüfen</PH>.
              Speicherdauer: <PH>für die Dauer der Kontonutzung; Löschung nach … – konkretisieren</PH>.
            </p>
          </Block>

          <Block title="6. Lernfortschritt, Wissenstests & Feedback">
            <p>
              Zur Lernerfolgsmessung (in Anlehnung an das Kirkpatrick-Modell) werden gespeichert und
              dem Konto zugeordnet: abgeschlossene Module, Ergebnisse der Wissenstests (Punktzahl und
              Antworten) sowie freiwillige Rückmeldungen über den Feedbackbogen.
            </p>
            <p>
              <strong className="text-ink">Sichtbarkeit:</strong> Diese Lerndaten sind innerhalb der
              Plattform für die Rollen Teamleiter, Trainer und Admin einsehbar (Cockpit-/Auswertungs-Ansichten),
              um den Lernfortschritt zu begleiten. Eine Einschränkung, sodass ein Teamleiter bzw.
              Trainer ausschließlich die Teilnehmer seiner eigenen Bank/Gruppe sieht
              (Mandantentrennung), wird derzeit umgesetzt.
            </p>
            <p>
              Rechtsgrundlage: <PH>Art. 6 Abs. 1 lit. b / lit. f DSGVO – prüfen</PH>.
              Speicherdauer: <PH>konkretisieren</PH>.
            </p>
          </Block>

          <Block title="7. Verbesserungsvorschläge & E-Mail-Versand (Resend)">
            <p>
              Über das Vorschlagsformular übermittelte Angaben (Modul, Art des Hinweises, Nachricht,
              Name/Kennung) werden gespeichert. Optional wird die Redaktion per E-Mail benachrichtigt;
              der Versand erfolgt über den Dienstleister Resend (USA).
            </p>
            <p>
              Rechtsgrundlage: <PH>Art. 6 Abs. 1 lit. f DSGVO – prüfen</PH>.
              Mit Resend ist ein Auftragsverarbeitungsvertrag erforderlich; bei Übermittlung in die
              USA Transfermechanismus benennen. Speicherdauer: <PH>konkretisieren</PH>.
            </p>
          </Block>

          <Block title="8. Kontaktaufnahme per E-Mail">
            <p>
              Wenn Sie uns per E-Mail kontaktieren (z. B. an hello@fkb-campus.de), verarbeiten wir
              Ihre Angaben zur Bearbeitung der Anfrage.
            </p>
            <p>
              Rechtsgrundlage: <PH>Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO – prüfen</PH>.
            </p>
          </Block>

          <Block title="9. Cookies">
            <p>
              Es werden ausschließlich technisch notwendige Cookies eingesetzt – insbesondere das
              Session-Cookie für die Anmeldung. Es findet <strong className="text-ink">kein</strong>{" "}
              Tracking und keine Reichweiten-/Werbeanalyse statt; ein Einwilligungs-Banner ist daher
              nicht erforderlich.
            </p>
            <p>
              Rechtsgrundlage für notwendige Cookies: § 25 Abs. 2 TDDDG i. V. m.{" "}
              <PH>Art. 6 Abs. 1 lit. f DSGVO – prüfen</PH>.
            </p>
          </Block>

          <Block title="10. Eingebettete Videos (YouTube)">
            <p>
              Auf Modulseiten können künftig Webinar-Videos eingebettet werden; beim Abspielen kann
              eine Verbindung zu Google/YouTube hergestellt werden. <strong className="text-ink">Aktuell
              sind keine Videos aktiv.</strong> Vor Aktivierung ist dieser Abschnitt verbindlich zu
              ergänzen (i. d. R. Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO / „2-Klick"-Lösung).
            </p>
          </Block>

          <Block title="11. Ihre Rechte">
            <p>
              Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17),
              Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch
              (Art. 21) sowie das Recht, eine erteilte Einwilligung jederzeit zu widerrufen. Zudem
              besteht ein Beschwerderecht bei einer Aufsichtsbehörde (Art. 77).
            </p>
            <p>
              Zuständige Aufsichtsbehörde: <PH>zuständige Landesdatenschutzbehörde benennen</PH>.
            </p>
          </Block>

          <Block title="12. Stand">
            <p>
              Stand dieser Erklärung: <PH>Datum</PH>.
            </p>
          </Block>
        </div>
      </div>
    </div>
  );
}
