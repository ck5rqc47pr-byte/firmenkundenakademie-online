// Konfiguration des Selbsteinschätzungsbogens je Track.
// Single Source für AssessmentForm (Anzeige) und actions.ts (Validierung der Slugs).

export type Stufe = {
  value: 1 | 2 | 3;
  label: string;
  sub: string;
};

export type AssessmentField = {
  slug: string;
  label: string;
  beschreibung: string;
  stufen: Stufe[];
};

export const BERATER_FIELDS: AssessmentField[] = [
  {
    slug: "finanzanalyse",
    label: "Finanzanalyse & Kreditexpertise",
    beschreibung: "Bilanz- & GuV-Analyse · M01 · M02 · M03 · M04 · M05 · M21",
    stufen: [
      { value: 1, label: "Berater", sub: "Ich lese und verstehe Jahresabschlüsse und erkenne Standard-Kennzahlen wie EK-Quote, Cashflow und DSCR." },
      { value: 2, label: "Sparringspartner", sub: "Ich interpretiere Bilanzpolitik, erkenne Gestaltungsspielräume und erstelle eigenständig Kapitaldienstfähigkeitsberechnungen." },
      { value: 3, label: "Strategischer Partner", sub: "Ich führe strategische Bilanzgespräche auf Augenhöhe mit GF/CFO und leite Handlungsempfehlungen aus der Finanzanalyse ab." },
    ],
  },
  {
    slug: "branchenwissen",
    label: "Branchenwissen",
    beschreibung: "KMU / Mittelstand · M06 · M07 · M08 · M09",
    stufen: [
      { value: 1, label: "Berater", sub: "Ich kenne branchentypische Kennzahlen und Finanzierungsanlässe der Top-5-Branchen in meinem Bestand." },
      { value: 2, label: "Sparringspartner", sub: "Ich verstehe Wertschöpfungsketten, erkenne Branchenzyklen und deren Auswirkung auf die Bonität meiner Kunden." },
      { value: 3, label: "Strategischer Partner", sub: "Ich fungiere als Branchenexperte, vernetze Kunden untereinander und antizipiere Marktveränderungen proaktiv." },
    ],
  },
  {
    slug: "gespraechsfuehrung",
    label: "Gesprächsführung & Beratung",
    beschreibung: "Bedarfsanalyse & Gesprächsstruktur · M10 · M11 · M12",
    stufen: [
      { value: 1, label: "Berater", sub: "Ich führe strukturierte Beratungsgespräche nach VR-Finanzplan-Standards und stelle gezielt offene Fragen." },
      { value: 2, label: "Sparringspartner", sub: "Ich lenke Gespräche auf strategische Themen und identifiziere latente Bedarfe hinter dem eigentlichen Auftrag." },
      { value: 3, label: "Strategischer Partner", sub: "Ich führe CEO-Dialoge auf Augenhöhe und moderiere komplexe Entscheidungsprozesse beim Kunden." },
    ],
  },
  {
    slug: "vertrieb",
    label: "Vertrieb & Ertragsmanagement",
    beschreibung: "Cross-Selling & Verbundgeschäft · M13 · M14 · M15 · M16",
    stufen: [
      { value: 1, label: "Berater", sub: "Ich nutze systematisch Gesprächsanlässe und kenne die Angebote der Verbundpartner (R+V, Union Investment, Schwäbisch Hall u. a.)." },
      { value: 2, label: "Sparringspartner", sub: "Ich entwickle kundenindividuelle Produktbündel und steuere aktiv den Deckungsbeitrag pro Kunde." },
      { value: 3, label: "Strategischer Partner", sub: "Ich baue integrierte Beratungskonzepte über alle Verbundpartner und optimiere den Kundenertragswert langfristig." },
    ],
  },
  {
    slug: "digital",
    label: "Digitale Kompetenz",
    beschreibung: "Atruvia / agree-Systeme · M17 · M18",
    stufen: [
      { value: 1, label: "Berater", sub: "Ich bediene Kernprozesse in agree sicher: Kreditantrag, Kontoeröffnung, VR-Standardprozesse." },
      { value: 2, label: "Sparringspartner", sub: "Ich nutze erweiterte agree-Funktionen effizient: Auswertungen, Workflows und Schnittstellen." },
      { value: 3, label: "Strategischer Partner", sub: "Ich identifiziere Prozessoptimierungen, gebe qualifiziertes Feedback an IT/Orga und teste neue Funktionen proaktiv." },
    ],
  },
  {
    slug: "fuehrung",
    label: "Führung & Zusammenarbeit",
    beschreibung: "Teamarbeit & Wissenstransfer · M19 · M20",
    stufen: [
      { value: 1, label: "Berater", sub: "Ich teile relevante Informationen im Team und nehme aktiv an Fallbesprechungen teil." },
      { value: 2, label: "Sparringspartner", sub: "Ich übernehme eine Mentorenrolle für jüngere Kollegen und leite Fachthemen in Teamrunden." },
      { value: 3, label: "Strategischer Partner", sub: "Ich entwickle Schulungsformate, baue eine Wissensdatenbank auf und fördere eine Lernkultur im Bereich." },
    ],
  },
];

export const ASSISTENZ_FIELDS: AssessmentField[] = [
  {
    slug: "k-a00",
    label: "Orientierung & Grundlagen",
    beschreibung: "Produkte, Prozesse, Systeme & Partner im Überblick · VA00",
    stufen: [
      { value: 1, label: "Sachbearbeitung", sub: "Ich kenne die Produkte und Verbundpartner meines Hauses im Überblick und weiß, welches System ich wofür nutze." },
      { value: 2, label: "Eigenständige Assistenz", sub: "Ich finde mich im Kreditprozess und in der Rollenverteilung (Markt/Marktfolge) sicher zurecht und weiß, wen ich bei welchem Anliegen anspreche." },
      { value: 3, label: "Co-Pilot", sub: "Ich nutze meinen Überblick über Haus, Produkte und Schnittstellen, um Abläufe aktiv mitzudenken und neue Kolleg:innen zu orientieren." },
    ],
  },
  {
    slug: "k-a01",
    label: "Auftrags- & Kreditsachbearbeitung",
    beschreibung: "Kreditakte & Sicherheiten · VA01 · VA02",
    stufen: [
      { value: 1, label: "Sachbearbeitung", sub: "Ich führe Kreditakten vollständig und prüfe Standardunterlagen sicher auf Vollständigkeit." },
      { value: 2, label: "Eigenständige Assistenz", sub: "Ich erkenne Mängel in Sicherheiten und Auszahlungsvoraussetzungen, dokumentiere sie und eskaliere an die richtige Stelle." },
      { value: 3, label: "Co-Pilot", sub: "Ich denke die formale Bearbeitung vorausschauend mit und entlaste den Berater auch bei komplexen Engagements." },
    ],
  },
  {
    slug: "k-a02",
    label: "Systeme & Prozesse",
    beschreibung: "agree & Datenqualität · VA03 · VA04",
    stufen: [
      { value: 1, label: "Sachbearbeitung", sub: "Ich bediene agree in den Kernfunktionen sicher und erledige Vorgänge im System statt über Workarounds." },
      { value: 2, label: "Eigenständige Assistenz", sub: "Ich steuere Wiedervorlagen, Fristen und Datenqualität eigenständig und halte den Bestand sauber." },
      { value: 3, label: "Co-Pilot", sub: "Ich erkenne Datenlücken früh, optimiere Abläufe und gebe qualifiziertes Feedback an Berater und Marktfolge." },
    ],
  },
  {
    slug: "k-a03",
    label: "Kundenkommunikation Innendienst",
    beschreibung: "Telefon, Schriftverkehr & Termine · VA05 · VA06",
    stufen: [
      { value: 1, label: "Sachbearbeitung", sub: "Ich kommuniziere am Telefon und im Schriftverkehr freundlich, klar und im Rahmen der Auskunftspolitik." },
      { value: 2, label: "Eigenständige Assistenz", sub: "Ich bereite Termine entscheidungsreif vor und nach, sodass der Berater optimal vorbereitet ins Gespräch geht." },
      { value: 3, label: "Co-Pilot", sub: "Ich gestalte die Kundenkommunikation serviceorientiert mit und antizipiere, was Kunde und Berater brauchen." },
    ],
  },
  {
    slug: "k-a04",
    label: "Zusammenarbeit & Selbstorganisation",
    beschreibung: "Schnittstelle & Selbstorganisation · VA07 · VA08",
    stufen: [
      { value: 1, label: "Sachbearbeitung", sub: "Ich organisiere meine Aufgaben strukturiert und priorisiere nach Dringlichkeit und Wichtigkeit." },
      { value: 2, label: "Eigenständige Assistenz", sub: "Ich gestalte die Schnittstelle zum Berater aktiv und handle Prioritätenkonflikte transparent aus." },
      { value: 3, label: "Co-Pilot", sub: "Ich steuere die Zusammenarbeit mehrerer Berater souverän und kommuniziere Kapazitätsgrenzen konstruktiv." },
    ],
  },
  {
    slug: "k-a06",
    label: "Neugeschäft & gesetzliche Sorgfaltspflichten",
    beschreibung: "Legitimation, Vertretung, Einheiten & Geldwäscheprävention · VA10 · VA11",
    stufen: [
      { value: 1, label: "Sachbearbeitung", sub: "Ich lege Neukunden formal korrekt an: Legitimation, Kontenwahrheit und Vertretungs-/Zeichnungsberechtigung prüfe ich sicher." },
      { value: 2, label: "Eigenständige Assistenz", sub: "Ich bilde Kreditnehmereinheiten aus Beteiligungsstrukturen, ermittle den wirtschaftlich Berechtigten und erkenne Geldwäsche-Verdachtsmomente." },
      { value: 3, label: "Co-Pilot", sub: "Ich bin im Team Ansprechpartnerin für die gesetzlichen Sorgfaltspflichten, halte die GwG-Prozesse sauber und führe neue Kolleg:innen ein." },
    ],
  },
  {
    slug: "k-a05",
    label: "Vertriebsunterstützung",
    beschreibung: "Vertriebsanlässe erkennen & aufbereiten · VA09",
    stufen: [
      { value: 1, label: "Sachbearbeitung", sub: "Ich erkenne offensichtliche Vertriebsanlässe in den Bestandsdaten meiner Kunden." },
      { value: 2, label: "Eigenständige Assistenz", sub: "Ich bewerte Anlässe auf Relevanz und sortiere saisonales Datenrauschen aus." },
      { value: 3, label: "Co-Pilot", sub: "Ich bereite belastbare Anlässe entscheidungsreif auf und bringe sie als Co-Pilotin proaktiv beim Berater ein." },
    ],
  },
];

export const TEAMLEITER_FIELDS: AssessmentField[] = [
  {
    slug: "k-f00",
    label: "Selbst- & Rollenführung",
    beschreibung: "Rollenwechsel, Führungshaltung & Selbstführung · TL00 · TL01",
    stufen: [
      { value: 1, label: "Teamleiter", sub: "Ich verstehe, dass mein Erfolg jetzt durch das Team entsteht, und trenne meine Führungsrolle bewusst von meiner früheren Beraterrolle." },
      { value: 2, label: "Führungscoach", sub: "Ich handle aus einem klaren Führungsselbstverständnis, setze Prioritäten souverän und nehme mir bewusst Zeit für Führung statt für Fachaufgaben." },
      { value: 3, label: "Strategische Führungskraft", sub: "Ich führe werteorientiert und dienend (Servant Leadership), bin für mein Team Vorbild und reflektiere meine Wirkung als Führungspersönlichkeit kontinuierlich." },
    ],
  },
  {
    slug: "k-f01",
    label: "Führung & Teamentwicklung",
    beschreibung: "Führungsstile, situatives Führen & Teamdynamik · TL02 · TL03",
    stufen: [
      { value: 1, label: "Teamleiter", sub: "Ich kenne die grundlegenden Führungsstile und passe meinen Stil bewusst an den Reifegrad des einzelnen Beraters an." },
      { value: 2, label: "Führungscoach", sub: "Ich delegiere wirksam, motiviere situativ und erkenne, in welcher Entwicklungsphase mein Team steht." },
      { value: 3, label: "Strategische Führungskraft", sub: "Ich entwickle mein Team transformational weiter, gestalte eine tragfähige Teamkultur und führe auch heterogene Teams zu gemeinsamer Leistung." },
    ],
  },
  {
    slug: "k-f02",
    label: "Vertriebssteuerung & Cockpit",
    beschreibung: "Ziele, Kennzahlen & Steuerungsgespräche · TL04 · TL05",
    stufen: [
      { value: 1, label: "Teamleiter", sub: "Ich lese das Cockpit sicher, unterscheide Aktivitäts- von Ergebniskennzahlen und erkenne Auffälligkeiten im Team." },
      { value: 2, label: "Führungscoach", sub: "Ich leite aus Kennzahlen Hypothesen und Handlungen ab und führe Steuerungsgespräche, die entwickeln statt Druck zu machen." },
      { value: 3, label: "Strategische Führungskraft", sub: "Ich verbinde Steuerung und Entwicklung zu einem stimmigen Führungssystem und richte die Vertriebssteuerung an der langfristigen Kundenbeziehung aus." },
    ],
  },
  {
    slug: "k-f03",
    label: "Personalentwicklung & Coaching",
    beschreibung: "Feedback-, Entwicklungsgespräche & Coaching · TL06 · TL07",
    stufen: [
      { value: 1, label: "Teamleiter", sub: "Ich gebe regelmäßig konkretes Feedback und führe strukturierte Entwicklungsgespräche mit meinen Beratern." },
      { value: 2, label: "Führungscoach", sub: "Ich führe mit einer Coaching-Haltung (z. B. GROW), stelle entwicklungsfördernde Fragen statt vorschnelle Lösungen zu liefern." },
      { value: 3, label: "Strategische Führungskraft", sub: "Ich erkenne und fördere Potenziale systematisch, begleite Berater am Arbeitsplatz und baue Nachfolge und Kompetenz im Team gezielt auf." },
    ],
  },
  {
    slug: "k-f04",
    label: "Change & Kommunikation",
    beschreibung: "Veränderung führen, schwierige Gespräche & Konflikt · TL08 · TL09 · TL10",
    stufen: [
      { value: 1, label: "Teamleiter", sub: "Ich kommuniziere Veränderungen klar und führe schwierige Gespräche sachlich und wertschätzend." },
      { value: 2, label: "Führungscoach", sub: "Ich moderiere Konflikte im Team, bereite kritische Gespräche gezielt vor und begleite mein Team durch Veränderungen." },
      { value: 3, label: "Strategische Führungskraft", sub: "Ich führe mein Team sicher durch Unsicherheit, gestalte Veränderungsprozesse aktiv mit und kommuniziere wirksam nach oben wie nach unten." },
    ],
  },
];

export const FIELDS_BY_TRACK: Record<string, AssessmentField[]> = {
  berater: BERATER_FIELDS,
  assistenz: ASSISTENZ_FIELDS,
  teamleiter: TEAMLEITER_FIELDS,
};

export function getAssessmentFields(track?: string): AssessmentField[] {
  if (track === "assistenz") return ASSISTENZ_FIELDS;
  if (track === "teamleiter") return TEAMLEITER_FIELDS;
  return BERATER_FIELDS;
}
