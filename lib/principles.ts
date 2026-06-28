// Prinzipien für den Beratungsalltag
// ────────────────────────────────────────────────────────────────────────────
// Inspiriert von der Idee, Erfahrung in einprägsame, anwendbare Prinzipien zu
// destillieren (u. a. Ray Dalio, *Principles*, 2017). Die Prinzipien sind aus
// den Lernzielen, Praxisfällen und Handlungsempfehlungen der Module abgeleitet
// (Distillation, keine Erfindung) und schließen die Lücke zwischen „Modul
// gelernt" und „Montag im Kundengespräch angewandt".
//
// PILOT-STATUS: Aktuell kuratiert für die Leitprinzipien + das Kompetenzfeld
// Finanzanalyse. Bei Freigabe wandert die Quelle pro Modul ins Frontmatter
// (`prinzipien:` in content/modules/MXX.md) und die übrigen Felder folgen.

export interface Prinzip {
  prinzip: string;          // die Maxime (einprägsam, imperativ)
  warum: string;            // eine Zeile: warum / wie
  moduleId?: string;        // Rückverweis aufs Quellmodul
}

export interface PrinzipGruppe {
  slug: string;
  titel: string;
  einleitung: string;
  prinzipien: Prinzip[];
}

// Übergeordnete Beratungsphilosophie – gilt feldübergreifend.
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

// Modul-abgeleitete Prinzipien, gruppiert nach Kompetenzfeld.
export const PRINZIP_GRUPPEN: PrinzipGruppe[] = [
  {
    slug: "finanzanalyse",
    titel: "Finanzanalyse",
    einleitung:
      "Zahlen lesen, einordnen, ins Gespräch bringen – und daraus eine begründete Entscheidung ableiten.",
    prinzipien: [
      {
        moduleId: "M01",
        prinzip: "Lies die Bilanz wie eine Geschichte, nicht wie eine Tabelle.",
        warum:
          "Jede Position erzählt von einer Entscheidung des Unternehmens; vier Kennzahlen (EK-Quote, Anlagendeckung, Liquidität) sagen mehr als vierzig Zeilen.",
      },
      {
        moduleId: "M02",
        prinzip: "Bring kritische Zahlen ins Gespräch, ohne Abwehr auszulösen.",
        warum:
          "Wer im offenen Dialog fragt statt anklagt, erhält die Erklärung – und den nächsten Beratungsansatz.",
      },
      {
        moduleId: "M03",
        prinzip: "Erkenne, wann der Bankkredit an seine Grenze stößt – und öffne die nächste Tür.",
        warum:
          "Mezzanine, Beteiligung, Förderung: Die strategische Stärke zeigt sich dort, wo der Standardkredit endet.",
      },
      {
        moduleId: "M04",
        prinzip: "Das erste Warnsignal steht selten in der Bilanz – meist im Kontokorrent.",
        warum:
          "Qualitative Frühindikatoren laufen den Kennzahlen voraus; reagiere auf das schwache Signal, nicht erst auf den Schaden.",
      },
      {
        moduleId: "M05",
        prinzip: "Jede Branche hat ihre eigenen Frühwarnzeichen.",
        warum:
          "Ein einheitlicher Maßstab für alle Branchen übersieht genau die Risiken, die in der jeweiligen Branche zählen.",
      },
      {
        moduleId: "M21",
        prinzip: "Eine Kreditentscheidung ist erst gut, wenn du sie begründen kannst.",
        warum:
          "Trenne Bauchgefühl und Begründung – und prüfe beide; die Kreditvorlage zwingt zur Klarheit.",
      },
      {
        moduleId: "M22",
        prinzip: "Bewerte das Geschäftsmodell, nicht nur den Jahresabschluss.",
        warum:
          "Klumpenrisiken, Nachfolge und Wettbewerbsdruck stehen in keiner Kennzahl, entscheiden aber über die Zukunft.",
      },
      {
        moduleId: "M23",
        prinzip: "Ein Plan, der sich nicht schließt, ist kein Plan.",
        warum:
          "Prüfe GuV, Bilanz und Cashflow gegeneinander; hinterfrage die Annahme, nicht nur das Ergebnis.",
      },
    ],
  },
];

// Kompetenzfelder, die noch folgen (für die Vorschau auf der Seite).
export const PRINZIP_GRUPPEN_GEPLANT = [
  "Branchenwissen",
  "Gesprächsführung",
  "Vertrieb",
  "Digital",
  "Führung",
];
