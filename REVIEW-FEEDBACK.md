# Review-Feedback Firmenkundenakademie (FKB Campus)

**Datum:** 11.06.2026
**Geprüft:** Online-Plattform inkl. 22 Modulinhalte, Quellen, Auth/DB, Deployment
**Methodik:** Prüfung aus drei Perspektiven — Teilnehmer, Bereichsleiter, IT-Spezialist.
Code-Befunde wurden manuell verifiziert (Build, Typecheck, npm audit, Datei-Inspektion).

> **Hinweis zur Lesart:** Einige Erstbefunde wurden bei der Verifikation entschärft und sind
> hier korrigiert. Korrekturen sind als _„Klarstellung"_ markiert, damit das Team keine
> Scheinprobleme bearbeitet.

---

## 0. Management-Zusammenfassung

Die Plattform ist **fachlich-didaktisch stark**, aber **technisch und organisatorisch noch
nicht produktionsreif** für den Einsatz in einer Bank. Der Inhalt (Kompetenzmodell, 22 Module,
~150 Quellen, Quizze) überzeugt; die größten Risiken liegen in **Zugriffsschutz, Rechtstexten
und fehlendem Führungs-/Reporting-Nutzen**.

**Go-Live-Blocker (zwingend vor Freischaltung für echte Nutzer):**

| # | Thema | Schweregrad | Datei |
|---|-------|-------------|-------|
| B1 | Admin-Server-Actions ohne Auth-Check (jeder eingeloggte Nutzer kann User anlegen/löschen/Passwörter setzen) | **Kritisch** | `app/admin/users/actions.ts` |
| B2 | Trainer-Material (22 Handbücher + 22 PPTX) öffentlich per URL abrufbar, auch ohne Login | **Kritisch** | `public/downloads/trainerhandbuch/`, `public/downloads/praesentation/` |
| B3 | Impressum & Datenschutz nur Platzhalter (Rechtspflicht TMG §5 / DSGVO) | **Kritisch** | `app/impressum/page.tsx`, `app/datenschutz/page.tsx` |
| B4 | Stufen-Filter defekt: 5 Module über Filter unauffindbar (uneinheitliche `stufe`-Werte) | **Hoch** | `content/modules/*.md`, `components/ModuleGrid.tsx:19` |
| B5 | Kein Team-Reporting für Bereichsleiter (Rolle `teamleiter` existiert, hat aber keine Funktion) | **Hoch** | `lib/db.ts`, `app/admin/*` |

---

## 1. Perspektive Teilnehmer (Firmenkundenberater)

### Stärken
- **Klare Nutzerführung:** Kompass (Selbsteinschätzung + Lernpfad), saubere Modulseiten mit
  Meta-Box, Lernzielen mit Bloom-Badges, Kapitelnavigation und Quiz.
- **Inhaltsqualität:** Module sind verständlich, praxisnah (Transferaufgaben, Selbstchecks),
  mit regulatorischen Bezügen (HGB, MaRisk, KWG).
- **Quiz:** 21 von 22 Modulen haben je 5 Fragen mit Erklärungen; Ergebnis wird gespeichert.
- **Download-Trennung in der UI:** Teilnehmerunterlagen für alle 22 Module vorhanden;
  Trainerhandbuch/PPTX werden in der Oberfläche nur Trainern/Admins angezeigt.

### Schwachstellen
1. **Stufen-Filter findet Module nicht** *(Hoch, siehe B4)*
   `components/ModuleGrid.tsx:19` filtert per exaktem Vergleich `module.stufe === stufe`.
   In den Modulen kommen aber 6 verschiedene Schreibweisen vor (siehe Abschnitt 2.1).
   Folge: Klick auf Tab **„Sparringspartner"** blendet M02, M10, M11, M14 (Wert `"Sparring"`)
   aus; Tab **„Stratege"** blendet M05 (Wert `"Strategischer Partner"`) aus. Der Teilnehmer
   sieht so 5 Module nie über den Filter.
2. **Video-Platzhalter auf allen 22 Modulen.** Alle `youtube_id` sind leer → jede Modulseite
   zeigt „Video in Produktion". Wirkt unfertig. Empfehlung: Platzhalter nur anzeigen, wenn ein
   Video tatsächlich geplant ist, oder Hinweis mit Zeithorizont versehen.
3. **M22 ist `draft` und hat kein Quiz.** Es erscheint im Kompass, ist aber inhaltlich nicht
   abgeschlossen. Entweder fertigstellen (Quiz ergänzen, freigeben) oder ausblenden.
4. **Inkonsistente Voraussetzungs-/Folgemodul-Ketten.** `folgemodule` und `voraussetzungen`
   sind nicht spiegelbildlich gepflegt; in der Meta-Box können Verweise auf Module mit
   gestricheltem Rand (= nicht verlinkbar) erscheinen.
5. **Barrierefreiheit:** Bild-Alt-Texte fallen auf leeren String zurück
   (`components/MarkdownRenderer.tsx`). Für Screenreader unschön.
6. **`/lernreise` ist nur ein Redirect auf `/kompass`** — entweder Inhalt geben oder NavBar
   direkt verlinken.

---

## 2. Perspektive Bereichsleiter (Einkaufs-/Einsatzentscheidung)

### Was überzeugt
- **Didaktisches Fundament:** Dreyfus-Stufen (Berater → Sparringspartner → Stratege),
  Bloom-Taxonomie in den Lernzielen, Kirkpatrick-Logik (Reaktion/Lernen/Transfer).
- **Curriculum:** 22 Module über 6 Kompetenzfelder; logische lineare Pfade
  (z.B. M01→M02→M03, M10→M11→M12).
- **Wissenschaftliche Fundierung:** Umfangreiches, seriöses Quellenverzeichnis
  (`content/quellen.md`) mit Standardwerken und aktueller Branchenliteratur.
- **Transparenz im Team:** Die Team-Seite weist die KI-gestützte Erstellung offen aus —
  glaubwürdiger als anonyme „Online-Akademien".

### Kaufhindernisse / Glaubwürdigkeitsrisiken
1. **Kein Führungs-/Reporting-Nutzen** *(Hoch, siehe B5).* Die Rolle `teamleiter` existiert in
   der Datenbank, hat aber **keine eigene Oberfläche**: kein Team-Überblick, keine
   Fortschritts-/Quiz-Auswertung pro Mitarbeiter, kein Export, keine Zertifikate. Ein
   Bereichsleiter bekommt aktuell keinen Mehrwert gegenüber dem reinen Selbstlernen seiner
   Mitarbeiter. Das ist für eine Einkaufsentscheidung das zentrale Defizit.
2. **Kein Bestehens-Gating / keine Nachweise.** Ein Modul gilt als „abgeschlossen" unabhängig
   vom Quiz-Ergebnis. Es gibt keine Teilnahmebescheinigung. Für Weiterbildungsnachweise
   (Revision, Personalentwicklung) fehlt damit die Grundlage.
3. **Rechtstexte sind Platzhalter** *(Kritisch, siehe B3).* `app/impressum/page.tsx` und
   `app/datenschutz/page.tsx` enthalten nur „Platzhalter"-Text. Für eine Bank ein K.-o.-Kriterium.
4. **Datenqualitäts-Signale.** Uneinheitliche Stufen- und Kompetenzfeld-Bezeichnungen (s. 2.1)
   sowie die Modulzahl-Differenz (s. 2.2) wirken bei genauer Prüfung nachlässig.
5. **Quellen nicht mit Aussagen verknüpft.** Das in der Architektur vorgesehene Inline-Zitat
   `[Q-XXX]` kommt im **gesamten Modul-Text 0-mal** vor. Die Quellen existieren zentral, sind
   aber nicht an konkrete Aussagen gebunden — für Audit/Nachvollziehbarkeit eine Lücke.
6. **Privat wirkende Kontaktadresse** als Fallback (`kreisel-sendung7x@icloud.com`, siehe 3.).

### 2.1 Uneinheitliche Stufen- und Feld-Bezeichnungen *(Datenbasis verifiziert)*

`stufe`-Werte über alle 22 Module:

| Wert | Anzahl | Kanonisch? |
|------|--------|-----------|
| `"Berater"` | 6 | ✅ |
| `"Sparringspartner"` | 5 | ✅ |
| `"Stratege"` | 5 | ✅ |
| `"Sparring"` | 4 | ❌ → sollte „Sparringspartner" |
| `Sparringspartner` (ohne Anführungszeichen) | 1 | ⚠️ parst korrekt, aber Stil-Bruch |
| `Strategischer Partner` | 1 (M05) | ❌ → sollte „Stratege" |

Kompetenzfeld-Drift: `K-01` erscheint als „…& Kreditexpertise" (5×) **und** „…& Strategieberatung" (2×);
`K-05` als „Digital & Daten" **und** „Digital & Technologie". Bitte je Feld eine verbindliche
Bezeichnung festlegen.

M05 hat zusätzlich durchgängig **unquotierte Frontmatter-Werte** (`id: M05`, `bloom: 4–6`,
`dauer: 1 Tag (8 Stunden)`) — bitte wie die übrigen Module mit Anführungszeichen normalisieren.

### 2.2 Modulzahl „21" vs. 22
Start- und Bankenseite nennen „21 Module" (`app/page.tsx:91,413`, `app/fuer-banken/page.tsx:34,344`).
Tatsächlich existieren 22 Module; davon ist eines (`M22`) `draft`, also 21 freigegeben.
Die Zahl ist damit *für freigegebene Module* vertretbar, aber inkonsistent zum Gesamtbestand.
Entscheidung nötig: M22 freigeben → „22", oder „21" bewusst beibehalten und M22 ausblenden.

---

## 3. Perspektive IT-Spezialist (Security & Betrieb)

### Kritisch
1. **Admin-Server-Actions ohne Autorisierung** — `app/admin/users/actions.ts`.
   `actionCreateUser`, `actionUpdateRole`, `actionResetPassword`, `actionDeleteUser` rufen
   **keine** `getServerSession`-Prüfung auf. Die Middleware schützt nur die *Seite*
   `/admin/users`, nicht die Actions. Ein beliebiger eingeloggter Nutzer (auch `teilnehmer`)
   kann die Action per direktem POST aufrufen und Admins anlegen, Rollen ändern, Passwörter
   zurücksetzen oder alle Nutzer löschen. **Fix:** In jeder Action Session laden und
   `role === "admin"` erzwingen (wie es die Seite `app/admin/users/page.tsx:26-28` bereits tut).
2. **Trainer-Material öffentlich** — `public/downloads/trainerhandbuch/` (22 PDF) und
   `public/downloads/praesentation/` (22 PPTX) liegen im statisch ausgelieferten `public/`-Ordner
   und sind über direkte URLs **ohne Login** abrufbar. Die Login-Prüfung auf `/trainer` ist reine
   UI-Kosmetik. **Fix:** Dateien in geschützten Storage (z.B. R2/S3/Vercel Blob) verschieben und
   über eine API-Route mit Rollen-Check ausliefern.

### Hoch
3. **Veraltete/verwundbare Dependencies.** `npm audit` meldet 4 Schwachstellen
   (1 hoch, 3 moderat): Next.js 14.2.35 (mehrere DoS/Cache-Poisoning/XSS-Advisories),
   `postcss <8.5.10`, `uuid <11.1.1` (über `next-auth`). Update planen und Regressionstest fahren.
4. **`.env.example` falsch/irreführend.** Enthält Supabase-Variablen
   (`NEXT_PUBLIC_SUPABASE_*`), obwohl der Code **Neon/Postgres** (`DATABASE_URL`) und
   `NEXTAUTH_SECRET`, `RESEND_API_KEY`, `NOTIFY_EMAIL` nutzt. Wer das Beispiel befolgt, bekommt
   kein lauffähiges Setup.
5. **Schwache Input-Validierung in `app/api/suggestions/route.ts`.** `type` wird nicht gegen die
   erlaubten Werte geprüft, `message` hat keine Längenbegrenzung (Spam/Storage-DoS). *(Klarstellung:
   Auth ist vorhanden — die Route prüft `getServerSession`. Der Erstbefund „fehlende Auth" war falsch.)*

### Mittel / Niedrig
6. **Repository-Hygiene.** Eingecheckt, sollte ignoriert werden: `tsconfig.tsbuildinfo`,
   `scripts/__pycache__/` (`.pyc`), und die Build-Log-Datei
   `fkakademie.production.4f1e8b36-…build.log`. *(Klarstellung: Die Build-Log enthält bei Prüfung
   **keine** Secrets — Risiko ist Hygiene, nicht Leak.)* `.gitignore` entsprechend ergänzen.
7. **Privat-Mail als Fallback.** `app/api/suggestions/route.ts:34` nutzt
   `NOTIFY_EMAIL ?? "kreisel-sendung7x@icloud.com"`. Fallback entfernen / durch offizielle
   Adresse ersetzen.
8. **Fehlende Sicherheits-Header.** `next.config.mjs` setzt keine CSP/HSTS/X-Frame-Options.
9. **Kein Rate-Limiting** auf den API-Routen (`/api/suggestions`).
10. **Kein CI / keine Tests.** Kein `.github/`-Workflow, keine Test-Suite. Empfehlung:
    GitHub Action mit `npm ci`, `next lint`, `tsc --noEmit`, `npm audit`.
11. **`lib/users.ts` ist toter Code mit Default-Passwörtern.** *(Klarstellung wichtig:)* Die Datei
    enthält 4 Accounts mit Klartext-kommentierten Default-Passwörtern (`Admin2026!` etc.), wird
    aber **nirgends importiert** — der Login läuft über `lib/db.ts`. Trotzdem entfernen: Falls die
    Produktiv-DB ursprünglich aus diesen Werten geseedet wurde, sind die Default-Passwörter bekannt
    und müssen sicher zurückgesetzt sein.

### Architektur-/Deployment-Diskrepanzen
12. **Doku passt nicht mehr zum Code.**
    - `ARCHITECTURE.md` sagt „Datenbank: Keine – rein dateibasiert" und „Deployment: Vercel" —
      tatsächlich gibt es **Neon-Postgres** (User, Progress, Feedback, Quiz, Suggestions,
      Assessment) und **NextAuth**.
    - `README.md` beschreibt **statischen Export** (`out/`) ohne Env-Variablen für Cloudflare
      Pages — das ist mit Auth/DB/dynamischen Routen **nicht mehr möglich**. Der Build bricht ohne
      `DATABASE_URL` ab (verifiziert).
    - Es existieren **gleichzeitig** `vercel.json` und `wrangler.toml` — Ziel-Plattform klären und
      die nicht genutzte Konfiguration entfernen.
    - **Verifiziert:** `tsc --noEmit` läuft sauber; `next build` ist mit gesetztem `DATABASE_URL`
      + `NEXTAUTH_SECRET` erfolgreich.

---

## 4. Perspektive Trainer: PPTX-Präsentationen & Trainerhandbücher (Nachtrag)

**Geprüft:** Alle 22 Trainerhandbücher (PDF, Text extrahiert) und alle 22 Präsentationen
(PPTX, Folientexte + Notizen extrahiert), abgeglichen mit Modul-Frontmatter und
Teilnehmerunterlagen. Leitfrage: Ist das Material logisch für einen Workshop aufgebaut?

### 4.1 Gesamturteil

**Die Handbücher sind die Stärke des Pakets, die Foliensätze die Schwäche.**
Alle 22 Handbücher folgen einem konsistenten, professionellen Aufbau: detaillierter
Phasen-Ablaufplan mit Uhrzeiten (Einstieg → Aktivierung → Input → Übung → Auswertung →
Transfer), konkrete Moderationshinweise inkl. typischer Teilnehmer-Einwände mit
Trainer-Antworten, Differenzierung nach Erfahrungsstand, Materiallisten mit Stückzahlen
sowie vollständige Kirkpatrick-Instrumente (L1-Feedbackbogen, L2-Wissenstest mit
Musterlösungen, L3-Beobachtungsbogen für Führungskräfte). Die didaktische Dramaturgie ist
durchgängig schlüssig (Kolb-Zyklus, problembasiertes Lernen, Rollenspiele mit
Beobachterrollen und strukturiertem Debriefing).

Die Foliensätze sind dagegen erkennbar automatisch aus den Modultexten generiert
(`scripts/generate_praesentation.py` + YAML) und in vier Punkten nicht workshop-reif
(Details unten): keine Trainer-Notizen, gebrochene Folienverweise, Theorie-Textwüsten
und einkopierte Arbeitsblätter.

### 4.2 Befunde pro Modul

| Modul | Dauer FM → HB | Folien real (HB-Verweis) | Zeitsumme HB | Urteil | Kernbefund |
|---|---|---|---|---|---|
| M01 | 90 → **95 Min.** | 9 (**HB: „13 Folien", „Folie 7–12", „Folie 13 Musterlösung"**) | ✓ 95 | eingeschränkt | Folienverweise zeigen ins Leere; Musterlösungsfolie fehlt; AB-Nummerierung HB ≠ Workbook (s. 4.3) |
| M02 | 180 → 180 | 8 (keine Nummern-Verweise) | ✓ | **ja** | Rollenspiel-Design stark (Freeze-Technik, 4-Schritt-Debriefing, Varianten A/B); Pause eingeplant |
| M03 | „ca. 7 Std." → 420 netto + 90 Pause | 9 | ✓ 510 | **ja** | Ganztag sauber strukturiert; referenziertes XLSX-Kennzahlen-Dashboard existiert nicht im Repo — klären |
| M04 | 90 → 90 | 10 (**HB: „Folie 13–14 Musterlösung", „ca. 15 Folien"**) | ✓ 90 | eingeschränkt | Musterlösungsfolien fehlen → Auswertungsphase (65–80 Min.) ohne geplante Visualisierung |
| M05 | 1 Tag (8 Std.) → 480 | 9 (HB: „Backup-Folien max. 10" ✓) | ✓ 480 exakt | **ja** | Bester Ganztagsplan: 6 Bausteine, Pausen korrekt (15+45+15), 4 Fallstudien + Musterlösungen; Vorlauf: Branchenreports 2 Werktage vorher, Creditreform via BVR-Zugang |
| M06 | 90–120 → ~100 | 9 | ✓ | **ja** | Blended: 30-Min.-E-Learning als Pflicht-Vorarbeit, mit dokumentiertem Fallback wenn TN unvorbereitet |
| M07 | 3,5–4 Std. → 240 | 10 (HB nutzt eigene Zählung „T-1…T-3") | ✓ 240 | eingeschränkt | **Nur 10 Min. Pause auf 4 Stunden** — überladen; dichte Theoriefolien; Taschenrechner zwingend |
| M08 | **„360 Min." → Plan 08:30–17:00 (≈435 netto)** | 10 | ⚠️ Widerspruch im HB selbst | eingeschränkt | Größte Zeitdiskrepanz: HB-Kopf sagt „360 Min. Nettozeit", eigener Ablaufplan ergibt ~435 Min. netto |
| M09 | 1 Tag + 3 Monatsrunden → 371 + 3×90 | 12 | ✓ | **ja** | Hybrid-Format vollständig beschrieben (Monatsrunden-Agenda, Modell FK-geleitet vs. Peer-Rotation); L2 clever als Online-Hausaufgabe 48 h danach |
| M10 | 90 → 90 | 7 | ✓ | eingeschränkt | **Einziges Modul: L2-Wissenstest ohne Musterlösungen** (3 offene Fragen, kein Erwartungshorizont); dichtestes 90-Min.-Format |
| M11 | 90 → 90 | 10 | ✓ | **ja** | Sehr gutes Schweigen-/Rollenspiel-Design; HB empfiehlt explizit „kein Folieneinsatz" — Spannungsfeld zur existierenden PPTX dokumentieren |
| M12 | 1 Tag (8 Std.) → 450 netto + 90 Pause | 10 | ✓ | eingeschränkt | Setzt **externen Coach** voraus (Kosten/Verfügbarkeit, kein Fallback beschrieben); Folien 3+5 textlastig; hoher Vorbereitungsaufwand (Kuverts, Laminate) |
| M13 | 90 → 90 | 14 | ✓ | **ja** | 4-Schritte-Prozess klar; Verbundpartner-Matrix als zentrales Schaubild |
| M14 | 90 → 90 | 14 | ✓ | eingeschränkt | Sehr dicht (2 Rechenübungen + Rollenspiel in 90 Min.), keine Pausen-Option notiert; Musterlösungen nur Trainer-Set ✓ |
| M15 | 1 Tag → 480 | 13 | ✓ 480 | **ja** | Didaktisch herausragend: 3 Einzelarbeitsphasen, Peer-Präsentation mit Feedback-Regeln („I like / I wish / What if"), Galerie-Alternative bei >8 TN |
| M16 | 90 → **95** | 12 | ✓ 95 | **ja** | agree-Demo mit Fallback-Datensatz vorbereitet; +5 Min. FM-Abweichung |
| M17 | 90 → **95** | 11 | ✓ 95 | **ja** | Live-Demos mit Fallback; Hinweis auf bankindividuelle Menüpfade — praxisnah |
| M18 | 90 → 90 | 14 | ✓ | **ja** | DSGVO-/Einwilligungs-Check als eigene Folien; Screenshot-Fallback falls agree ausfällt |
| M19 | 90 → 90 | 13 | ✓ | **ja** | SECI/Kolb sauber eingesetzt; Praxiscase „Team Ostbayern" |
| M20 | 90 → 90 | 14 | ✓ | **ja** | Sensible Moderationshinweise („Ich bin kein Selbstdarsteller"-Einwand antizipiert) |
| M21 | Halbtag (4 Std.) → 240 | 13 | ✓ 240 exakt | **ja** | Bestes Halbtagsmodul: Kolb-Zyklus vollständig, Timeboxing-Regie, Musterlösung bewusst als „eine mögliche Entscheidung" gerahmt |
| M22 | **„90 Min." → HB plant 120 Min.** | 14 (kein YAML-Quellskript) | ⚠️ +30 Min. | **nein (draft)** | Dreifacher Widerspruch: Dauer FM 90 vs. HB 120; Version FM v0.2 vs. HB/Folie v0.1; **HB-Methode sagt „max. 3 Flip-Seiten, keine Folien" — trotzdem existiert eine 14-Folien-PPTX** |

**Bilanz:** 13 von 22 Modulen sind aus Trainersicht direkt einsetzbar, 8 eingeschränkt
(behebbar mit kleinen Korrekturen), M22 als Draft nicht einsetzbar.

### 4.3 Modulübergreifende Befunde (Foliensätze)

1. **Keine einzige der 22 PPTX enthält Trainer-Notizen** (programmatisch geprüft: 0 von 22).
   Die exzellenten Moderationshinweise stehen nur im Handbuch — der Trainer muss parallel
   in zwei Dokumenten arbeiten. Empfehlung: Generator um Notizen-Feld erweitern und die
   Phasen-/Moderationshinweise je Folie in den Notes-Bereich übernehmen.
2. **Gebrochene Folienverweise (M01, M04):** Die Handbücher beschreiben größere Foliensätze
   (M01: „13 Folien", M04: „ca. 15 Folien" inkl. Musterlösungsfolien 13–14), als real
   existieren (9 bzw. 10). Vermutlich wurden die Handbücher vor der Generator-Kürzung
   geschrieben (Commit „Modulseiten auf Überblicks-Modus"). Folge im Seminar: Der Trainer
   sucht in der Auswertungsphase eine Folie, die es nicht gibt. → Entweder Folien ergänzen
   oder Handbuch-Verweise korrigieren; idealerweise Verweise automatisiert gegen die
   YAML-Skripte prüfen.
3. **Arbeitsblätter auf Folien:** 14 von 22 Decks enthalten Ausfüllfelder (`____`) auf
   Folien (z.B. M01 Folie 6 „Ihre Rechnung: ___", M16 Folie 11/12). Auf dem Beamer ist das
   nicht bearbeitbar und dupliziert das Workbook. → Entscheidung dokumentieren: Folien nur
   als visueller Anker (Schaubild + Aufgabenstellung), Ausfüll-Versionen ausschließlich im
   Workbook.
4. **AB-Nummerierung inkonsistent (Handbuch ↔ Workbook):** Beispiel M01 — im Handbuch ist
   „AB-3" der Selbstcheck; im Teilnehmer-Workbook ist AB-3 das Kennzahlen-Referenzblatt und
   AB-4 die Checkliste; ein Selbstcheck kommt im Workbook gar nicht vor (0 Treffer).
   Im Seminar führt das zu „Bitte nehmen Sie AB-3" — und die Hälfte blättert falsch.
   → Nummerierung über alle drei Artefakte (HB, Workbook, Folien) synchronisieren.
5. **Theorie-Textwüsten:** Einzelne Inhaltsfolien übernehmen ganze Theorieabschnitte aus dem
   Modul (M01 Folie 3, M06 Folie 5/6, M07 Folie 7/8, M12 Folie 3/5). Für die Projektion
   sind das Lesetexte, keine Präsentationsfolien. Auffällig: Der Generator kennt
   Agenda-/Abschnittsfolien (`s_agenda`, `s_section`), nutzt sie aber nicht — kein einziges
   Deck hat eine Agenda, auch die Ganztagsmodule nicht.

### 4.4 Modulübergreifende Befunde (Handbücher)

6. **Dauer-Diskrepanzen Frontmatter ↔ Handbuch:** gravierend bei M08 (360 vs. ~435 Min.
   netto, Widerspruch sogar innerhalb des HB) und M22 (90 vs. 120 Min.); geringfügig
   (+5 Min.) bei M01, M16, M17. → Frontmatter als führende Quelle definieren und abgleichen.
7. **Pausenplanung:** Ganztagsmodule sind vorbildlich (M05: 75 Min., M12/M15: 90 Min.),
   aber **M07 plant nur 10 Min. Pause auf 4 Stunden** — unrealistisch; M10/M14 (90 Min.,
   sehr dicht) ohne Mikropausen-Hinweis.
8. **Einzelne Lücke im sonst flächendeckenden Kirkpatrick-Setup:** M10-Wissenstest ohne
   Musterlösungen (alle anderen 21 Module haben sie).
9. **Operative Abhängigkeiten sind dokumentiert, aber nicht zentral gesammelt:**
   agree-Zugang inkl. IT-Freigabe (M13, M16–M18), externer Coach (M12, ohne Fallback),
   Branchenreports mit 2 Tagen Vorlauf (M05), Taschenrechner-Sätze (M07, M08, M14),
   XLSX-Dashboard (M03, Existenz ungeklärt). → Eine „Trainer-Logistik-Übersicht" je Modul
   (1 Seite) würde Planungsfehler vermeiden.
10. **M22 vor Freigabe harmonisieren:** Dauer, Version, Methode (Flipchart-Konzept vs.
    generierte PPTX — eine der beiden Welten streichen), YAML-Skript ergänzen, Quiz erstellen.

### 4.5 Trainer-Aufgabenliste (priorisiert)

**Vor dem nächsten Seminareinsatz**
- [ ] M01/M04: Folienverweise im Handbuch korrigieren oder fehlende Folien (insb. Musterlösungen) ergänzen.
- [ ] M08: Dauerangabe klären (Frontmatter + HB-Kopf vs. realer Ablaufplan).
- [ ] M10: Musterlösungen/Erwartungshorizont für den L2-Wissenstest ergänzen.
- [ ] M07: Pausenplan überarbeiten (mind. 2×10–15 Min. auf 4 Stunden).
- [ ] M01: AB-Nummerierung Handbuch ↔ Workbook synchronisieren; fehlenden Selbstcheck ins Workbook aufnehmen.

**Nächste Überarbeitungsrunde**
- [ ] Trainer-Notizen in alle PPTX generieren (Generator erweitern; Quelle: Moderationshinweise des HB).
- [ ] Agenda-/Abschnittsfolien aktivieren (mind. für Halbtags-/Ganztagsmodule M03, M05, M07, M08, M12, M15, M21).
- [ ] Arbeitsblatt-Folien auf „Anker-Format" reduzieren (Aufgabe + Verweis aufs Workbook statt Ausfüllfelder).
- [ ] M12: Fallback ohne externen Coach beschreiben (z.B. Video-Demo).
- [ ] M03: XLSX-Kennzahlen-Dashboard erstellen oder Referenz entfernen.
- [ ] Zentrale Logistik-Übersicht je Modul (Systeme, Geräte, Vorlaufzeiten, externe Personen).

**Mit M22-Finalisierung**
- [ ] M22: Dauer (90 vs. 120), Version (v0.1 vs. v0.2) und Methode (Flipchart vs. PPTX) entscheiden, YAML-Skript + Quiz ergänzen, dann Status „freigegeben".

---

## 5. Priorisierte Aufgabenliste fürs Team

**Sofort (Blocker, vor jedem echten Nutzerzugang)**
- [ ] B1: Auth-Check (`role === "admin"`) in alle vier `app/admin/users/actions.ts`-Funktionen.
- [ ] B2: Trainer-PDF/PPTX aus `public/` entfernen, über geschützte API-Route mit Rollen-Check ausliefern.
- [ ] B3: Impressum & Datenschutz mit rechtlich geprüften Inhalten füllen.
- [ ] B4: `stufe`-Werte in allen Modulen auf `Berater` / `Sparringspartner` / `Stratege` normalisieren.

**Diese Woche (Hoch)**
- [ ] Kompetenzfeld-Bezeichnungen (K-01, K-05) vereinheitlichen; M05-Frontmatter quoten.
- [ ] Modulzahl-Entscheidung (M22 freigeben + Quiz, oder „21" bewusst belassen).
- [ ] Bereichsleiter-Sicht definieren: Team-Fortschritt, Quiz-Auswertung, Export, Zertifikat.
- [ ] Dependencies aktualisieren (`next`, `postcss`, `uuid`/`next-auth`), Regressionstest.
- [ ] `.env.example` korrigieren; Privat-Mail-Fallback entfernen.

**Danach (Mittel)**
- [ ] Input-Validierung `api/suggestions` (Enum-Check `type`, Längenlimit `message`), Rate-Limiting.
- [ ] Sicherheits-Header in `next.config.mjs`.
- [ ] Repo-Hygiene: `tsconfig.tsbuildinfo`, `__pycache__`, `*.build.log` in `.gitignore`.
- [ ] CI-Workflow (lint, typecheck, audit).
- [ ] Quellen `[Q-XXX]` an Kernaussagen der Module verankern.
- [ ] `ARCHITECTURE.md`/`README.md` an realen Stand (DB, Auth, Deployment-Ziel) anpassen.
- [ ] Video-Platzhalter-Strategie; Alt-Text-Fallback verbessern; `/lernreise` klären.

**Optional (Curriculum)**
- [ ] Kompetenzfelder K-05 (Digital, 2 Module) und K-06 (Führung, 2 Module) ausbauen.
- [ ] Voraussetzungs-/Folgemodul-Ketten spiegelbildlich konsistent pflegen.

---

## 6. Lokale Repository- & Ordnerstruktur (Befunde aus Struktur-Audit, 2026-06-10)

Zusätzlich zum inhaltlichen Review wurde die lokale Projekt- und Repo-Struktur
untersucht. Folgende Auffälligkeiten (A1–A9) sind unabhängig vom Content-Review
und überwiegend Hygiene-/Datenschutz-Themen. **A1 ist sicherheits- und
urheberrechtskritisch und hat höchste Priorität.**

### A1 — KRITISCH: `referenzmaterial/` ist trotz `.gitignore` getrackt und auf GitHub
- **Befund:** 198 Dateien (~400 MB) im Ordner `referenzmaterial/` sind im Haupt-Repo
  versioniert **und bereits auf GitHub gepusht**, obwohl `.gitignore` den Ordner listet.
  Ursache: `.gitignore` greift nicht für bereits getrackte Dateien.
- **Schwere 1 – Urheberrecht:** Enthält die EuroFH-Studienbriefe. CLAUDE.md verbietet
  ausdrücklich, dieses Material zu verbreiten/pushen.
- **Schwere 2 – Personenbezogene Daten (DSGVO):** Enthält private Dokumente, u.a.
  Studienausweis (`Studienausweis_910077028.pdf`), Online-Anmeldung mit Klarnamen,
  Buchungsbestätigung, Teilnahmebescheinigung, Expertise/Zoller, Ulm HRA 727243.
- **Fix:** `git rm -r --cached referenzmaterial/` + Commit (entfernt aus Tracking,
  Dateien bleiben lokal). Da bereits gepusht: **History-Bereinigung** mit
  `git filter-repo` + Force-Push nötig, sonst bleibt das Material in der GitHub-Historie
  abrufbar. Repo-Sichtbarkeit (public/private) prüfen.
- [ ] `referenzmaterial/` aus Tracking entfernen, History purgen, Force-Push, Repo-Privacy prüfen.

### A2 — `Backup - Don't touch/` (473 MB Voll-Duplikat des Projekts)
- **Befund:** Vollständige Projektkopie im Arbeitsverzeichnis (gitignored, also nicht im Repo,
  aber lokaler Ballast und Verwechslungsgefahr).
- [ ] Außerhalb des Projektordners archivieren.

### A3 — Online-Repo: getrackte Build-Artefakte
- **Befund:** `tsconfig.tsbuildinfo`, `scripts/__pycache__/*.pyc`, `fkakademie.production.*.build.log`
  sind im Online-Repo versioniert.
- [ ] `git rm --cached` + `.gitignore`-Einträge ergänzen (vgl. §5 Repo-Hygiene).

### A4 — Online-Repo: doppelte Deployment-Konfiguration
- **Befund:** Sowohl `vercel.json` als auch `wrangler.toml` (Cloudflare) vorhanden.
  Deploy-Ziel ist Vercel.
- [ ] `wrangler.toml` entfernen (Querverweis §3 IT).

### A5 — Online-Repo: `lib/users.ts` Dead Code mit Default-Passwörtern
- **Befund:** Ungenutzte User-/Passwort-Liste im Klartext.
- [ ] Datei entfernen (Querverweis §3 IT-Befund Dead Code).

### A6 — `.env.example` zeigt Supabase statt Neon
- **Befund:** Beispiel-Umgebungsvariablen passen nicht zur tatsächlichen DB (Neon).
- [ ] `.env.example` korrigieren (Querverweis §3 IT).

### A7 — OS-/Office-Artefakte getrackt
- **Befund:** `.DS_Store` und `~$`-Office-Lock-Dateien in `referenzmaterial/` versioniert.
- [ ] Aus Tracking entfernen, in `.gitignore` aufnehmen (entfällt mit A1, falls History-Purge).

### A8 — Veraltete Dokumentations-Referenzen auf „Online-Akademie - Codex/"
- **Befund:** MEMORY.md und CLAUDE.md verweisen auf einen Codex-Ordner, der nicht mehr existiert.
- [ ] Verweise in CLAUDE.md/MEMORY.md aktualisieren oder entfernen.

### A9 — Haupt-Repo: generierte Präsentationen getrackt
- **Befund:** `output/Praesentation/*.pptx` (generierte Artefakte) sind versioniert.
- [ ] Bewusst entscheiden: tracken (für Übergabe) oder ignorieren (regenerierbar). Geringe Priorität.

---

*Erstellt zur Übergabe an das Entwicklungs- und Redaktionsteam. Alle technischen Befunde sind
am Code verifiziert; korrigierte Erstbefunde sind als „Klarstellung" gekennzeichnet.*
