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

## 4. Priorisierte Aufgabenliste fürs Team

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

*Erstellt zur Übergabe an das Entwicklungs- und Redaktionsteam. Alle technischen Befunde sind
am Code verifiziert; korrigierte Erstbefunde sind als „Klarstellung" gekennzeichnet.*
