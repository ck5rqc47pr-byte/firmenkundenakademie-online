import type { ReactNode } from "react";

// Sichtbarer Platzhalter – muss vor Go-live durch reale, rechtlich geprüfte Angaben ersetzt werden.
function PH({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-amber-100 px-1 font-medium text-amber-900">
      [ {children} ]
    </mark>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-primary">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}

export default function DatenschutzPage() {
  return (
    <section className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-card lg:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Rechtliches</p>
      <h1 className="mt-3 text-4xl font-semibold text-primary">Datenschutzerklärung</h1>

      <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Entwurf – noch nicht rechtlich freigegeben.</strong> Diese Struktur listet die
        tatsächlich in der Anwendung stattfindenden Verarbeitungen auf (Login, Quiz-Speicherung,
        Feedback-Formular, E-Mail-Versand, Hosting). Rechtsgrundlagen, Speicherfristen und die
        Verantwortlichen-Angaben sind Platzhalter und vor dem Go-live juristisch zu prüfen.
        Diese Seite ist <em>keine</em> Rechtsberatung.
      </div>

      <div className="mt-6 space-y-6 text-slate-700">
        <Block title="1. Verantwortlicher">
          <p>
            Verantwortlich im Sinne der DSGVO ist:
            <br />
            <PH>Name / Firma, Anschrift, E-Mail – identisch zum Impressum</PH>
          </p>
        </Block>

        <Block title="2. Datenschutzbeauftragter">
          <p>
            <PH>Kontakt des Datenschutzbeauftragten – falls bestellt; sonst Hinweis, dass keine Bestellpflicht besteht</PH>
          </p>
        </Block>

        <Block title="3. Hosting (Vercel)">
          <p>
            Die Plattform wird bei Vercel Inc. gehostet. Beim Aufruf werden technisch notwendige
            Server-Logdaten (u. a. IP-Adresse, Zeitpunkt, abgerufene Seite) verarbeitet.
          </p>
          <p>
            Rechtsgrundlage: <PH>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) – prüfen</PH>.
            Auftragsverarbeitung/Drittlandtransfer (USA):{" "}
            <PH>AV-Vertrag und Transfermechanismus (EU-Standardvertragsklauseln) benennen</PH>.
          </p>
        </Block>

        <Block title="4. Benutzerkonten & Anmeldung">
          <p>
            Für den Zugang zu geschützten Inhalten wird ein Konto genutzt. Verarbeitet werden Name,
            Login, ein verschlüsseltes Passwort (Hash) und die zugewiesene Rolle. Die Anmeldung
            erfolgt über ein Session-Cookie (NextAuth).
          </p>
          <p>
            Rechtsgrundlage: <PH>Art. 6 Abs. 1 lit. b DSGVO (Vertrag/Nutzungsverhältnis) – prüfen</PH>.
            Speicherdauer: <PH>z. B. für die Dauer der Kontonutzung – konkretisieren</PH>.
          </p>
        </Block>

        <Block title="5. Lernfortschritt & Quiz-Ergebnisse">
          <p>
            Zur Lernerfolgsmessung werden Quiz-Ergebnisse gespeichert und dem Konto zugeordnet.
          </p>
          <p>
            Rechtsgrundlage: <PH>Art. 6 Abs. 1 lit. b / lit. f DSGVO – prüfen</PH>.
            Speicherdauer: <PH>konkretisieren</PH>.
            Eine etwaige Auswertung für Vorgesetzte/Bereichsleiter ist gesondert zu beschreiben,
            sobald das Reporting (Backlog B5) umgesetzt ist.
          </p>
        </Block>

        <Block title="6. Feedback-/Verbesserungsformular">
          <p>
            Über das Vorschlagsformular übermittelte Angaben (Art des Hinweises, Nachricht) werden
            gespeichert und können per E-Mail (Dienstleister: Resend) an die Redaktion benachrichtigt
            werden.
          </p>
          <p>
            Rechtsgrundlage: <PH>Art. 6 Abs. 1 lit. f DSGVO – prüfen</PH>.
            Speicherdauer: <PH>konkretisieren</PH>. Mit Resend ist ein{" "}
            <PH>AV-Vertrag</PH> erforderlich.
          </p>
        </Block>

        <Block title="7. Eingebettete Videos (YouTube)">
          <p>
            Sofern auf Modulseiten Videos eingebettet werden, kann beim Abspielen eine Verbindung zu
            Google/YouTube hergestellt werden. Aktuell sind keine Videos hinterlegt; vor Aktivierung
            ist dieser Abschnitt verbindlich auszufüllen.
          </p>
          <p>
            Rechtsgrundlage: <PH>Einwilligung Art. 6 Abs. 1 lit. a DSGVO / Consent-Banner – prüfen</PH>.
          </p>
        </Block>

        <Block title="8. Betroffenenrechte">
          <p>
            Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17),
            Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21) sowie
            das Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77).
          </p>
          <p>
            Zuständige Aufsichtsbehörde: <PH>zuständige Landesdatenschutzbehörde benennen</PH>.
          </p>
        </Block>

        <Block title="9. Stand">
          <p>
            Stand dieser Erklärung: <PH>Datum</PH>.
          </p>
        </Block>
      </div>
    </section>
  );
}
