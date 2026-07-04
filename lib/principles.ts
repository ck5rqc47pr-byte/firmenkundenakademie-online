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
  {
    slug: "branchenwissen",
    titel: "Branchenwissen",
    einleitung:
      "Die Branche verstehen, bevor man über Zahlen und Finanzierung urteilt – jeder Sektor tickt anders.",
    prinzipien: [
      {
        moduleId: "M06",
        prinzip: "Beim Mittelständler sind Unternehmen und Unternehmer nicht zu trennen.",
        warum:
          "Eigentum, Leitung und Haftung liegen in einer Hand – wer den Menschen nicht versteht, versteht das Kreditrisiko nicht.",
      },
      {
        moduleId: "M07",
        prinzip: "Kenne die Spielregeln der Branche, bevor du über Finanzierung sprichst.",
        warum:
          "Freier Beruf ≠ Gewerbe, EÜR ≠ Bilanz, Praxiswert ≠ Substanzwert – branchenfremde Maßstäbe führen in die Irre.",
      },
      {
        moduleId: "M08",
        prinzip: "Der Beleihungswert ist kein Marktwert – verwechsle Sicherheit nicht mit Preis.",
        warum:
          "Nach BelWertV zählt der dauerhaft erzielbare Wert; wer den Marktpreis besichert, besichert die Übertreibung mit.",
      },
      {
        moduleId: "M09",
        prinzip: "Branchenkompetenz ist kein Wissen allein, sondern System plus Netzwerk.",
        warum:
          "Wer eine Branche mit Five Forces und PESTEL systematisch liest und vernetzt ist, wird vom Anbieter zum gefragten Gesprächspartner.",
      },
    ],
  },
  {
    slug: "gespraechsfuehrung",
    titel: "Gesprächsführung",
    einleitung:
      "Zuhören, die eigentliche Botschaft entschlüsseln und auf Augenhöhe fragen statt argumentieren.",
    prinzipien: [
      {
        moduleId: "M10",
        prinzip: "Hinter jeder Sachaussage steckt eine Botschaft – hör auf allen vier Ohren.",
        warum:
          "Der eigentliche Bedarf liegt selten in dem, was der Kunde sagt, sondern in dem, was er meint (Schulz von Thun).",
      },
      {
        moduleId: "M11",
        prinzip: "Der wichtigste Bedarf ist der, den der Kunde noch nicht ausgesprochen hat.",
        warum:
          "Explizite Wünsche bearbeitet jeder; latente Bedarfe mit SPIN-Fragen zu heben, unterscheidet den Berater vom Sachbearbeiter.",
      },
      {
        moduleId: "M12",
        prinzip: "Auf Augenhöhe fragt man – man argumentiert nicht.",
        warum:
          "Im CEO-Dialog öffnen zirkuläre Fragen und echte Neugier einen Raum, den kein Produktpitch je erreicht.",
      },
      {
        moduleId: "M24",
        prinzip: "Kommuniziere eine Bandbreite, keine Scheingenauigkeit.",
        warum:
          "Ein Unternehmenswert ist ein Urteil, kein Messwert – Ehrlichkeit über die Spanne schafft mehr Vertrauen als falsche Präzision.",
      },
    ],
  },
  {
    slug: "vertrieb",
    titel: "Vertrieb",
    einleitung:
      "Ertrag entsteht aus Bedarf und Fokus – nicht aus Volumen und Gießkanne.",
    prinzipien: [
      {
        moduleId: "M13",
        prinzip: "Cross-Selling beginnt beim Bedarf des Kunden, nicht bei der Produktliste der Bank.",
        warum:
          "Bedarfsorientiertes Cross-Selling (Pull) bindet und bringt Ertrag; Produkte drücken (Push) verbrennt Vertrauen.",
      },
      {
        moduleId: "M14",
        prinzip: "Nicht das Volumen zählt, sondern der Deckungsbeitrag.",
        warum:
          "Ein großer Kredit zu dünner Marge ist ein Verlustgeschäft – wer nur den Zinssatz kennt, verhandelt blind.",
      },
      {
        moduleId: "M15",
        prinzip: "Wer jeden Kunden gleich bedient, verzettelt seinen Markt.",
        warum:
          "Ein priorisiertes Zielsegment mit klarem Wertversprechen schlägt die Gießkanne – Fokus ist die Strategie.",
      },
      {
        moduleId: "M16",
        prinzip: "Steuere den Bestand über die eine Kennzahl, die alles bündelt: die Nettomarge.",
        warum:
          "Die NMZ zeigt, wo Ertrag verloren geht – die drei Kunden mit dem größten Hebel schlagen zwanzig Aktionen ohne Fokus.",
      },
    ],
  },
  {
    slug: "digital",
    titel: "Digital",
    einleitung:
      "Werkzeuge und Daten sollen Zeit fürs Gespräch schaffen – nicht es ersetzen.",
    prinzipien: [
      {
        moduleId: "M17",
        prinzip: "Das System soll dir Zeit fürs Gespräch schenken, nicht sie nehmen.",
        warum:
          "Wer agree für Vorbereitung und Dokumentation beherrscht, gewinnt Minuten je Termin zurück – für den Kunden.",
      },
      {
        moduleId: "M18",
        prinzip: "Ein Datenpunkt öffnet die Tür – das Gespräch bleibt menschlich.",
        warum:
          "Trigger aus agree machen aus dem Kaltanruf einen Anlass; die Beziehung entsteht trotzdem am Telefon, nicht in der Software.",
      },
    ],
  },
  {
    slug: "fuehrung",
    titel: "Führung",
    einleitung:
      "Wissen teilen und Beziehungen bauen, bevor man sie braucht.",
    prinzipien: [
      {
        moduleId: "M19",
        prinzip: "Wissen, das nur in einem Kopf liegt, ist ein Risiko – kein Vorsprung.",
        warum:
          "Erst geteiltes Wissen macht das Team stärker als die Summe seiner Berater; Transfer ist Führungsaufgabe.",
      },
      {
        moduleId: "M20",
        prinzip: "Beziehungen baut man, bevor man sie braucht.",
        warum:
          "Ein Netzwerk aus Brücken (nicht nur Kontakten) und gezielte Sichtbarkeit bringen Anfragen, bevor der Wettbewerb sie sieht.",
      },
    ],
  },
];

// Alle Kompetenzfelder sind ausgerollt – keine offenen mehr.
export const PRINZIP_GRUPPEN_GEPLANT: string[] = [];
