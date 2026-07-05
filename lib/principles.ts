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
