# Firmenkundenakademie - Online-Akademie

Dateibasierte Next.js-Plattform für wissenschaftlich fundierte Weiterbildungsmodule der Firmenkundenakademie.

## Lokale Entwicklung

```bash
npm install
npm run dev
```

## Kostenloses Deployment

Diese Phase-1-Version ist als statische Website vorbereitet. Der Build erzeugt den Ordner `out/`, der ohne Server, Datenbank oder Authentifizierung gehostet werden kann.

```bash
npm run build
```

Empfohlener Null-Euro-Weg:

1. Repository zu GitHub pushen.
2. Cloudflare Pages öffnen und das Repository verbinden.
3. Build command: `npm run build`
4. Output directory: `out`
5. Keine Environment Variables eintragen.

Damit entstehen keine laufenden Serverkosten. Wenn die kostenlosen Limits erreicht werden, pausiert der Anbieter typischerweise statt automatisch Kosten zu verursachen.

## Neues Modul hinzufügen

```bash
./scripts/sync-modules.sh
```

Danach:

1. Frontmatter in `content/modules/MXX.md` prüfen oder ergänzen.
2. Änderung committen und pushen.
3. Cloudflare Pages deployed die Plattform automatisch.

Es ist kein Code-Eingriff nötig, solange das Modul als neue `.md`-Datei in `content/modules/` liegt.

## Teilnehmerunterlagen als PDF

Teilnehmerunterlagen werden pro Modul als eigene PDF-Datei öffentlich aus `public/downloads/teilnehmerunterlagen/` ausgeliefert.

Ablageort:

```bash
public/downloads/teilnehmerunterlagen/
```

Benennung:

```bash
M01.pdf
M06.pdf
M08.pdf
```

Regel:

1. Der Dateiname muss exakt der Modul-ID aus dem Frontmatter entsprechen.
2. Die Datei muss als `.pdf` im Ordner `public/downloads/teilnehmerunterlagen/` liegen.
3. Beispiel: Für Modul `M06` erwartet die Plattform die Datei `public/downloads/teilnehmerunterlagen/M06.pdf`.

Wenn keine PDF vorhanden ist, zeigt die Modulseite automatisch an, dass die Teilnehmerunterlagen noch nicht hinterlegt sind.
