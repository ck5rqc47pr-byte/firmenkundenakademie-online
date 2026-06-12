# Claude Usage Widget für iPhone

Ein Homescreen-Widget, das die aktuelle Nutzung der Anthropic/Claude API anzeigt —
umgesetzt mit der kostenlosen iOS-App [Scriptable](https://scriptable.app)
(kein eigener App-Store-Build nötig).

![Widget-Größen: Small, Medium, Large werden unterstützt]()

## Was wird angezeigt?

| Größe | Inhalt |
|---|---|
| **Small** | Kosten heute, Tokens heute, Monatskosten |
| **Medium** | Kosten heute + Monat, Tokens heute, 7-Tage-Balkendiagramm |
| **Large** | Zusätzlich Token-Aufschlüsselung (Input / Output / Cache-Read / Cache-Write) |

Datenquelle ist die offizielle **Usage & Cost Admin API** von Anthropic:

- `GET /v1/organizations/usage_report/messages` (Token-Verbrauch, Tages-Buckets)
- `GET /v1/organizations/cost_report` (Kosten in USD, Tages-Buckets)

Das Widget aktualisiert sich ca. alle 15 Minuten (iOS entscheidet final über das
Timing). Bei Netz- oder API-Fehlern zeigt es den letzten erfolgreichen Stand mit
einem ⚠︎-offline-Hinweis. Ein Tipp auf das Widget öffnet die Usage-Seite der
Claude Console.

## Voraussetzungen

1. **Anthropic Admin API Key** (`sk-ant-admin...`)
   - Erstellen in der [Claude Console](https://platform.claude.com/settings/admin-keys)
     unter *Settings → Admin Keys*.
   - ⚠️ Die Admin API ist **nur für Organisationen** verfügbar, nicht für
     Einzel-Accounts. Falls *Settings → Organization* noch nicht eingerichtet ist,
     dort zuerst eine Organisation anlegen.
   - Ein normaler API-Key (`sk-ant-api...`) funktioniert **nicht**.
2. **Scriptable** aus dem App Store (kostenlos).

> **Hinweis:** Das Widget zeigt die Nutzung der **Claude API** (Pay-per-Token).
> Für die Limits eines Claude-Pro/Max-**Abos** (z. B. das 5-Stunden-Fenster in der
> Claude-App) gibt es derzeit keine offizielle öffentliche API — diese Werte kann
> das Widget daher nicht anzeigen.

## Einrichtung (ca. 3 Minuten)

1. **Script anlegen:** Scriptable öffnen → `+` → den kompletten Inhalt von
   [`claude-usage-widget.js`](./claude-usage-widget.js) einfügen → Script z. B.
   `Claude Usage` nennen.
2. **Key hinterlegen:** Script einmal in der App ausführen (▶︎). Es erscheint ein
   Dialog zur Eingabe des Admin-Keys. Der Key wird **im iOS-Schlüsselbund**
   gespeichert — nicht im Script und nicht in iCloud-Klartext.
3. **Widget hinzufügen:** Homescreen lange drücken → `+` → *Scriptable* →
   gewünschte Größe wählen → Widget antippen → unter *Script* `Claude Usage`
   auswählen → *When Interacting: Run Script*.

Fertig — das Widget lädt beim nächsten Refresh die Daten.

## Key ändern oder entfernen

In der Scriptable-App eine neue Datei mit folgendem Einzeiler ausführen:

```javascript
Keychain.remove("anthropic-admin-api-key");
```

Beim nächsten Start des Widget-Scripts in der App wird der Key neu abgefragt.

## Sicherheit

- Der Admin-Key liegt ausschließlich im iOS-Schlüsselbund des Geräts.
- Der Key hat **Lesezugriff auf Organisationsdaten** (Mitglieder, Workspaces,
  Usage/Kosten). Er kann keine Inferenz-Anfragen stellen, sollte aber trotzdem
  wie ein Geheimnis behandelt werden.
- Das Script sendet Anfragen ausschließlich an `api.anthropic.com`.

## Troubleshooting

| Problem | Lösung |
|---|---|
| „Kein API-Key hinterlegt" | Script einmal in der Scriptable-App ausführen |
| HTTP 401 / `authentication_error` | Key prüfen — muss mit `sk-ant-admin` beginnen |
| „This API is unavailable for individual accounts" | In der Console eine Organisation anlegen (Settings → Organization) |
| Widget zeigt $0.00 trotz Nutzung | Daten erscheinen mit bis zu ~5 Minuten Verzögerung; Buckets sind UTC-Tage |
| Widget aktualisiert selten | iOS drosselt Widget-Refreshes systemseitig; in der App ausführen erzwingt einen Abruf |
