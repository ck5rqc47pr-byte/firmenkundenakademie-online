# Claude Usage Widget für iPhone

Homescreen-Widgets, die die aktuelle Claude-Nutzung anzeigen — umgesetzt mit der
kostenlosen iOS-App [Scriptable](https://scriptable.app) (kein eigener
App-Store-Build nötig).

Es gibt **zwei Varianten** in diesem Ordner:

| Script | Für wen | Zeigt |
|---|---|---|
| [`claude-abo-widget.js`](./claude-abo-widget.js) | **Claude-Abo (Pro/Max)** ← die meisten | 5-Stunden-Fenster, Wochenlimits, Extra-Nutzung |
| [`claude-usage-widget.js`](./claude-usage-widget.js) | API-Kunden (Pay-per-Token, Organisation) | Kosten heute/Monat, Token-Verbrauch, 7-Tage-Chart |

---

## Variante 1: Abo-Widget (Pro/Max) — empfohlen

Zeigt dieselben Werte wie der `/usage`-Befehl in Claude Code bzw. die
Usage-Seite in den Claude-Einstellungen:

- **5-Stunden-Fenster:** Auslastung in % mit Farbampel (grün/orange/rot),
  Fortschrittsbalken und Reset-Zeitpunkt („Reset in 2 h 15 min")
- **Wochenlimit** (alle Modelle) und modell-spezifische Wochenlimits
  (z. B. Opus), falls dein Plan welche hat
- **Extra-Nutzung** (Credits), falls aktiviert — nur im großen Widget
- Ein Tipp aufs Widget öffnet `claude.ai/settings/usage`

### ⚠️ Wichtig: inoffizielle Schnittstelle

Für Abo-Limits gibt es **keine offizielle öffentliche API**. Das Widget nutzt
den internen OAuth-Endpoint (`api.anthropic.com/api/oauth/usage`), den auch
Claude Code selbst verwendet — derselbe Weg wie bekannte Community-Tools
(ccusage, Claude Usage Monitor u. a.). Das funktioniert zuverlässig, kann sich
aber jederzeit ohne Ankündigung ändern.

### Voraussetzungen

1. **Claude-Abo** (Pro oder Max)
2. **Claude Code** einmalig auf einem Rechner installiert und per Abo eingeloggt
   (`claude` → `/login`) — daher kommen die OAuth-Tokens
3. **Scriptable** aus dem App Store (kostenlos)

### Tokens auslesen

Das Widget braucht zwei Werte aus deinem Claude-Code-Login:

- **Access-Token** (`sk-ant-oat01-…`) — kurzlebig (Stunden)
- **Refresh-Token** (`sk-ant-ort01-…`) — damit erneuert das Widget den
  Access-Token automatisch; ohne ihn musst du nach ein paar Stunden neu einrichten

**macOS** — die Tokens liegen im Schlüsselbund:

```bash
security find-generic-password -s "Claude Code-credentials" -w
```

**Linux / Windows (WSL):**

```bash
cat ~/.claude/.credentials.json
```

Beides gibt ein JSON aus — du brauchst `accessToken` und `refreshToken` daraus.

### Einrichtung (ca. 3 Minuten)

1. **Script anlegen:** Scriptable öffnen → `+` → kompletten Inhalt von
   [`claude-abo-widget.js`](./claude-abo-widget.js) einfügen → Script z. B.
   `Claude Abo` nennen.
2. **Tokens hinterlegen:** Script einmal in der App ausführen (▶︎). Im Dialog
   Access- und Refresh-Token einfügen. Beide werden **im iOS-Schlüsselbund**
   gespeichert — nicht im Script.
3. **Widget hinzufügen:** Homescreen lange drücken → `+` → *Scriptable* →
   Größe wählen → Widget antippen → unter *Script* `Claude Abo` auswählen.

| Größe | Inhalt |
|---|---|
| **Small** | 5-Std-Fenster groß (% + Balken + Reset), Wochenwert klein |
| **Medium** | 5-Std-Fenster + Wochenlimit als Balken mit Reset-Zeiten |
| **Large** | Alle Fenster (inkl. Opus/Sonnet-Wochenlimits) + Extra-Nutzung |

### Tokens zurücksetzen

In Scriptable eine Datei mit diesem Inhalt ausführen, danach das Widget-Script
in der App neu starten:

```javascript
Keychain.remove("claude-abo-access-token");
Keychain.remove("claude-abo-refresh-token");
Keychain.remove("claude-abo-token-expires");
```

### Troubleshooting (Abo)

| Problem | Lösung |
|---|---|
| „Kein Token hinterlegt" | Script einmal in der Scriptable-App ausführen |
| „Token abgelaufen — bitte neu einrichten" | Refresh-Token fehlt oder ist ungültig → Tokens zurücksetzen und neu aus Claude Code auslesen (vorher dort einmal einloggen) |
| HTTP 429 / rate_limit | Der Endpoint drosselt stark; das Widget pollt deshalb nur ~alle 15 min und zeigt sonst den Cache (⚠︎ offline) |
| Werte weichen von der Claude-App ab | Daten kommen vom selben Endpoint wie Claude Code `/usage`; kurze Verzögerungen sind normal |
| Nach Claude-Code-Re-Login geht nichts mehr | Beim Re-Login werden neue Tokens ausgestellt → im Widget neu hinterlegen |

---

## Variante 2: API-Widget (Pay-per-Token)

Für Nutzung der **Claude API** mit einer Organisation. Datenquelle ist die
offizielle **Usage & Cost Admin API**:

- `GET /v1/organizations/usage_report/messages` (Token-Verbrauch, Tages-Buckets)
- `GET /v1/organizations/cost_report` (Kosten in USD, Tages-Buckets)

| Größe | Inhalt |
|---|---|
| **Small** | Kosten heute, Tokens heute, Monatskosten |
| **Medium** | Kosten heute + Monat, Tokens heute, 7-Tage-Balkendiagramm |
| **Large** | Zusätzlich Token-Aufschlüsselung (Input / Output / Cache) |

### Voraussetzungen

- **Anthropic Admin API Key** (`sk-ant-admin…`) aus der
  [Claude Console](https://platform.claude.com/settings/admin-keys)
  (*Settings → Admin Keys*). Nur für **Organisationen** verfügbar; ein normaler
  API-Key (`sk-ant-api…`) funktioniert nicht.

Einrichtung wie oben: Script [`claude-usage-widget.js`](./claude-usage-widget.js)
in Scriptable anlegen, einmal ausführen, Admin-Key eingeben (landet im
iOS-Schlüsselbund), Widget hinzufügen.

Key entfernen:

```javascript
Keychain.remove("anthropic-admin-api-key");
```

### Troubleshooting (API)

| Problem | Lösung |
|---|---|
| HTTP 401 / `authentication_error` | Key prüfen — muss mit `sk-ant-admin` beginnen |
| „This API is unavailable for individual accounts" | In der Console eine Organisation anlegen (Settings → Organization) |
| Widget zeigt $0.00 trotz Nutzung | Daten erscheinen mit bis zu ~5 min Verzögerung; Buckets sind UTC-Tage |

---

## Sicherheit (beide Varianten)

- Alle Tokens/Keys liegen ausschließlich im **iOS-Schlüsselbund** des Geräts —
  nie im Script, nie in iCloud-Klartext.
- Die Scripts senden Anfragen ausschließlich an `api.anthropic.com` bzw.
  `console.anthropic.com` (Token-Refresh).
- iOS entscheidet final über das Refresh-Timing von Widgets; angefragt sind
  ~15 Minuten. Bei Netz-/API-Fehlern zeigt das Widget den letzten erfolgreichen
  Stand mit ⚠︎-offline-Hinweis.
