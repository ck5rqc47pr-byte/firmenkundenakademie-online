// Leitprinzipien für die beiden Tracks
// ────────────────────────────────────────────────────────────────────────────
// Inspiriert von der Idee, Erfahrung in einprägsame, anwendbare Prinzipien zu
// destillieren (u. a. Ray Dalio, *Principles*, 2017).
//
// Ab Phase 15.3 liegen die MODUL-Prinzipien im Frontmatter jedes Moduls
// (`prinzipien:` in content/modules/MXX.md) und werden von der /prinzipien-Seite
// aus den Modulen aggregiert (nach Track + Kompetenzfeld). Hier verbleiben nur
// die feldübergreifenden LEITPRINZIPIEN je Track – sie gehören zu keinem Modul.

export interface Prinzip {
  prinzip: string;          // die Maxime (einprägsam, imperativ)
  warum: string;            // eine Zeile: warum / wie
  moduleId?: string;        // Rückverweis aufs Quellmodul (bei Modul-Prinzipien)
}

// Berater-Track: übergeordnete Beratungshaltung.
export const LEITPRINZIPIEN: Prinzip[] = [
  {
    prinzip: "Sei Sparringspartner, nicht Produktverkäufer.",
    warum:
      "Wer den Unternehmer und sein Geschäft besser versteht als der Wettbewerb, muss nicht verkaufen – er wird gefragt.",
  },
  {
    prinzip: "Diagnose vor Therapie.",
    warum:
      "Erst das Geschäftsmodell und die Zahlen verstehen, dann über Lösungen sprechen. Nie umgekehrt.",
  },
  {
    prinzip: "Die Kennzahl ist nicht die Antwort, sie ist die bessere Frage.",
    warum:
      "Eine Zahl öffnet das Gespräch – die Erklärung des Kunden ist der eigentliche Erkenntnisgewinn.",
  },
  {
    prinzip: "Bereite vor, was du in den ersten fünf Minuten gewinnst.",
    warum:
      "Wer Bilanz und Branche vor dem Termin gelesen hat, gewinnt früh Vertrauen – das trägt das ganze Gespräch.",
  },
  {
    prinzip: "Sprich Unangenehmes offen an – als Frage, nicht als Urteil.",
    warum:
      "Kritische Entwicklungen verschwinden nicht, wenn man sie verschweigt; sie eskalieren.",
  },
  {
    prinzip: "Mach dich als Auskunftei überflüssig und als Denkpartner unverzichtbar.",
    warum:
      "Der Weg vom Anwender zum Experten (Dreyfus) führt über eigenständiges Urteil, nicht über Nachschlagen.",
  },
];

// Vertriebsassistenz-Track: Haltung des Innendienstes.
export const LEITPRINZIPIEN_ASSISTENZ: Prinzip[] = [
  {
    prinzip: "Genauigkeit ist gelebter Kundenservice.",
    warum:
      "Im Innendienst ist Sorgfalt nicht Bürokratie, sondern das, was Kunde und Berater trägt.",
  },
  {
    prinzip: "Fehler früh fangen ist billiger als spät korrigieren.",
    warum:
      "Ein geprüftes Detail heute erspart eine Eskalation morgen.",
  },
  {
    prinzip: "Halte dem Berater den Rücken frei – proaktiv, nicht reaktiv.",
    warum:
      "Wer mitdenkt und vorbereitet, statt nur abzuarbeiten, macht den Unterschied.",
  },
  {
    prinzip: "Kenne das System, dann nutzt es dir – nicht umgekehrt.",
    warum:
      "Wer agree & Co. beherrscht, gewinnt Zeit; wer sie umgeht, schafft Risiko.",
  },
  {
    prinzip: "Was nicht dokumentiert ist, ist nicht passiert.",
    warum:
      "Nachvollziehbarkeit schützt – die Bank, den Kunden und dich selbst.",
  },
];

// Führungs-/Teamleiter-Track: genossenschaftliches Führungsverständnis (Servant Leadership).
export const LEITPRINZIPIEN_FUEHRUNG: Prinzip[] = [
  {
    prinzip: "Entwickle die Menschen – die Menschen entwickeln das Geschäft.",
    warum:
      "„Build the people, the people build the company“ (Dan Martell): Führung investiert zuerst in " +
      "Menschen – ein starkes, entwickeltes Team trägt Geschäft und Genossenschaft. Der genossenschaftliche " +
      "Förderauftrag in Führungssprache.",
  },
  {
    prinzip: "Dein Erfolg ist die Leistung deines Teams – nicht deine eigene.",
    warum:
      "Der Rollenwechsel vom Fachexperten zur Führungskraft ist die Grundentscheidung: Wer der beste Berater bleiben will, führt nicht.",
  },
  {
    prinzip: "Führen heißt ermöglichen, nicht anweisen.",
    warum:
      "Dienende Führung (Servant Leadership) entwickelt Menschen, statt sie zu kontrollieren – das passt zum genossenschaftlichen Förderauftrag.",
  },
  {
    prinzip: "Steuere UND entwickle – nie nur das eine.",
    warum:
      "Kennzahlen und Cockpit sind Handwerk, kein Führungsideal. Steuerung ohne Entwicklung erzeugt Zahlen, keine Wirkung.",
  },
  {
    prinzip: "Führe nach oben so ehrlich wie nach unten.",
    warum:
      "Die mittlere Führungskraft trägt eine doppelte Loyalität: Wer nach oben beschönigt, verliert das Vertrauen beider Seiten.",
  },
  {
    prinzip: "Gib Orientierung, ohne Sicherheit vorzutäuschen.",
    warum:
      "In Unsicherheit braucht das Team Halt und Ehrlichkeit zugleich – Pseudosicherheit zerstört die Glaubwürdigkeit.",
  },
];
