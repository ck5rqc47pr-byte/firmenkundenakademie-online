// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: gauge;
//
// ─────────────────────────────────────────────────────────────────────────────
//  Claude Abo-Widget für iPhone (Scriptable)
//
//  Zeigt die aktuelle Auslastung deines Claude-Abos (Pro/Max):
//    • 5-Stunden-Fenster (Auslastung in % + Reset-Zeitpunkt)
//    • Wochenlimit (alle Modelle)
//    • Modell-spezifische Wochenlimits (z. B. Opus), falls vorhanden
//    • Extra-Nutzung (Credits), falls aktiviert
//
//  Datenquelle ist der OAuth-Usage-Endpoint, den auch Claude Code für den
//  /usage-Befehl verwendet (inoffiziell, nicht öffentlich dokumentiert):
//    GET https://api.anthropic.com/api/oauth/usage
//
//  Authentifizierung: OAuth-Tokens deines Claude-Logins (aus Claude Code).
//  Das Widget erneuert den Access-Token automatisch über den Refresh-Token.
//  Einrichtung siehe README.md im selben Ordner.
// ─────────────────────────────────────────────────────────────────────────────

const K_ACCESS = "claude-abo-access-token";
const K_REFRESH = "claude-abo-refresh-token";
const K_EXPIRES = "claude-abo-token-expires";

const USAGE_URL = "https://api.anthropic.com/api/oauth/usage";
const TOKEN_URL = "https://console.anthropic.com/v1/oauth/token";
// Öffentliche OAuth-Client-ID von Claude Code (kein Geheimnis)
const CLIENT_ID = "9d1c250a-e61b-44d9-88ed-5944d1962f5e";
// Der Endpoint drosselt unbekannte Clients aggressiv — Claude-Code-UA verwenden
const USER_AGENT = "claude-code/2.0.0";

const CACHE_FILE = "claude-abo-widget-cache.json";
const REFRESH_MINUTES = 15;

// ── Farben (Hell-/Dunkelmodus) ──────────────────────────────────────────────
const COLOR_BG_TOP = Color.dynamic(new Color("#faf9f5"), new Color("#1f1d1a"));
const COLOR_BG_BOTTOM = Color.dynamic(new Color("#f0eee6"), new Color("#141312"));
const COLOR_ACCENT = new Color("#d97757");
const COLOR_TEXT = Color.dynamic(new Color("#1f1d1a"), new Color("#faf9f5"));
const COLOR_SUBTLE = Color.dynamic(new Color("#6e6a60"), new Color("#a8a396"));
const COLOR_TRACK = Color.dynamic(new Color("#1f1d1a", 0.08), new Color("#faf9f5", 0.12));
const COLOR_OK = new Color("#5a8a5e");
const COLOR_WARN = new Color("#d99a3d");
const COLOR_CRIT = new Color("#c64f38");

// ─────────────────────────────────────────────────────────────────────────────
//  Einstieg
// ─────────────────────────────────────────────────────────────────────────────

if (!config.runsInWidget && !Keychain.contains(K_ACCESS)) {
  await setupTokens();
}

const widget = await buildWidget();
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentMedium();
}
Script.complete();

// ─────────────────────────────────────────────────────────────────────────────
//  Token-Verwaltung
// ─────────────────────────────────────────────────────────────────────────────

async function setupTokens() {
  const alert = new Alert();
  alert.title = "Claude-Abo verbinden";
  alert.message =
    "Tokens aus Claude Code eintragen (siehe README):\n\n" +
    "1. Access-Token (sk-ant-oat01-…)\n" +
    "2. Refresh-Token (sk-ant-ort01-…) — empfohlen, sonst läuft der Zugang nach wenigen Stunden ab.";
  alert.addSecureTextField("sk-ant-oat01-…");
  alert.addSecureTextField("sk-ant-ort01-… (optional)");
  alert.addAction("Speichern");
  alert.addCancelAction("Abbrechen");
  const choice = await alert.present();
  if (choice === -1) return;

  const access = alert.textFieldValue(0).trim();
  const refresh = alert.textFieldValue(1).trim();
  if (!access.startsWith("sk-ant-oat")) {
    const warn = new Alert();
    warn.title = "Ungültiger Access-Token";
    warn.message = "Der Access-Token muss mit \"sk-ant-oat\" beginnen.";
    warn.addAction("OK");
    await warn.present();
    return;
  }
  Keychain.set(K_ACCESS, access);
  if (refresh) Keychain.set(K_REFRESH, refresh);
  // Ablauf unbekannt → konservativ 30 Minuten annehmen, Refresh regelt den Rest
  Keychain.set(K_EXPIRES, String(Date.now() + 30 * 60 * 1000));
}

async function getAccessToken() {
  if (!Keychain.contains(K_ACCESS)) return null;
  const access = Keychain.get(K_ACCESS);
  const expires = Keychain.contains(K_EXPIRES)
    ? parseInt(Keychain.get(K_EXPIRES), 10)
    : 0;

  // Noch mindestens 5 Minuten gültig → direkt verwenden
  if (access && Date.now() < expires - 5 * 60 * 1000) return access;

  const refreshed = await refreshAccessToken();
  return refreshed || access;
}

async function refreshAccessToken() {
  if (!Keychain.contains(K_REFRESH)) return null;
  try {
    const req = new Request(TOKEN_URL);
    req.method = "POST";
    req.headers = {
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
    };
    req.body = JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: Keychain.get(K_REFRESH),
      client_id: CLIENT_ID,
    });
    const res = await req.loadJSON();
    if (!res.access_token) return null;
    Keychain.set(K_ACCESS, res.access_token);
    if (res.refresh_token) Keychain.set(K_REFRESH, res.refresh_token);
    const ttlMs = (res.expires_in || 3600) * 1000;
    Keychain.set(K_EXPIRES, String(Date.now() + ttlMs));
    return res.access_token;
  } catch (e) {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Datenbeschaffung
// ─────────────────────────────────────────────────────────────────────────────

async function fetchUsage(token) {
  const req = new Request(USAGE_URL);
  req.headers = {
    Authorization: `Bearer ${token}`,
    "anthropic-beta": "oauth-2025-04-20",
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT,
  };
  const res = await req.loadJSON();
  if (res.error) {
    const err = new Error(res.error.message || res.error.type || "API-Fehler");
    err.apiType = res.error.type;
    throw err;
  }
  return res;
}

async function loadData() {
  let token = await getAccessToken();
  if (!token) throw new Error("setup");

  let usage;
  try {
    usage = await fetchUsage(token);
  } catch (e) {
    // Token evtl. gerade abgelaufen → einmal hart refreshen und erneut versuchen
    if (e.apiType === "authentication_error") {
      const fresh = await refreshAccessToken();
      if (!fresh) throw new Error("Token abgelaufen — bitte neu einrichten (Script in der App öffnen).");
      usage = await fetchUsage(fresh);
    } else {
      throw e;
    }
  }

  const windows = [];
  if (usage.five_hour) windows.push(makeWindow("5-Std-Fenster", usage.five_hour));
  if (usage.seven_day) windows.push(makeWindow("Woche (alle Modelle)", usage.seven_day));
  if (usage.seven_day_opus) windows.push(makeWindow("Woche (Opus)", usage.seven_day_opus));
  if (usage.seven_day_sonnet) windows.push(makeWindow("Woche (Sonnet)", usage.seven_day_sonnet));

  let extra = null;
  if (usage.extra_usage?.is_enabled) {
    extra = {
      used: usage.extra_usage.used_credits,
      limit: usage.extra_usage.monthly_limit,
      utilization: usage.extra_usage.utilization,
    };
  }

  return { fetchedAt: new Date().toISOString(), windows, extra };
}

function makeWindow(label, w) {
  return {
    label,
    utilization: Math.max(0, Math.min(100, w.utilization || 0)),
    resetsAt: w.resets_at || null,
  };
}

// ── Cache: letzter erfolgreicher Abruf als Fallback ─────────────────────────
function readCache() {
  try {
    const fm = FileManager.local();
    const path = fm.joinPath(fm.cacheDirectory(), CACHE_FILE);
    if (!fm.fileExists(path)) return null;
    return JSON.parse(fm.readString(path));
  } catch (e) {
    return null;
  }
}

function writeCache(data) {
  try {
    const fm = FileManager.local();
    const path = fm.joinPath(fm.cacheDirectory(), CACHE_FILE);
    fm.writeString(path, JSON.stringify(data));
  } catch (e) {
    // Cache ist optional
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Widget-Aufbau
// ─────────────────────────────────────────────────────────────────────────────

async function buildWidget() {
  const widget = new ListWidget();
  const gradient = new LinearGradient();
  gradient.colors = [COLOR_BG_TOP, COLOR_BG_BOTTOM];
  gradient.locations = [0, 1];
  widget.backgroundGradient = gradient;
  widget.refreshAfterDate = new Date(Date.now() + REFRESH_MINUTES * 60 * 1000);
  widget.url = "https://claude.ai/settings/usage";

  if (!Keychain.contains(K_ACCESS)) {
    renderHint(
      widget,
      "Kein Token hinterlegt.\nÖffne das Script einmal in der Scriptable-App, um dein Claude-Abo zu verbinden."
    );
    return widget;
  }

  let data;
  let stale = false;
  try {
    data = await loadData();
    writeCache(data);
  } catch (e) {
    data = readCache();
    stale = true;
    if (!data) {
      renderHint(widget, `Fehler beim Abruf:\n${e.message || e}`);
      return widget;
    }
  }

  const family = config.runsInWidget ? config.widgetFamily : "medium";
  if (family === "small") {
    renderSmall(widget, data, stale);
  } else if (family === "large") {
    renderLarge(widget, data, stale);
  } else {
    renderMedium(widget, data, stale);
  }
  return widget;
}

function renderHint(widget, message) {
  widget.setPadding(14, 14, 14, 14);
  addHeader(widget);
  widget.addSpacer(8);
  const text = widget.addText(message);
  text.font = Font.systemFont(12);
  text.textColor = COLOR_SUBTLE;
  widget.addSpacer();
}

function addHeader(widget, stale) {
  const row = widget.addStack();
  row.centerAlignContent();
  const dot = row.addText("●");
  dot.font = Font.systemFont(10);
  dot.textColor = COLOR_ACCENT;
  row.addSpacer(5);
  const title = row.addText("Claude-Abo");
  title.font = Font.semiboldSystemFont(13);
  title.textColor = COLOR_TEXT;
  row.addSpacer();
  if (stale) {
    const warn = row.addText("⚠︎ offline");
    warn.font = Font.systemFont(9);
    warn.textColor = COLOR_SUBTLE;
  }
}

function renderSmall(widget, data, stale) {
  widget.setPadding(13, 13, 13, 13);
  addHeader(widget, stale);
  widget.addSpacer();

  const session = data.windows[0];
  if (!session) {
    const text = widget.addText("Keine Daten");
    text.font = Font.systemFont(12);
    text.textColor = COLOR_SUBTLE;
    widget.addSpacer();
    return;
  }

  const pct = widget.addText(`${Math.round(session.utilization)} %`);
  pct.font = Font.boldSystemFont(28);
  pct.textColor = utilColor(session.utilization);
  pct.minimumScaleFactor = 0.6;
  pct.lineLimit = 1;

  const label = widget.addText(session.label);
  label.font = Font.systemFont(10);
  label.textColor = COLOR_SUBTLE;

  widget.addSpacer(6);
  const bar = widget.addImage(drawProgressBar(session.utilization, 120, 8));
  bar.imageSize = new Size(120, 8);

  widget.addSpacer(5);
  const reset = widget.addText(formatReset(session.resetsAt));
  reset.font = Font.systemFont(9);
  reset.textColor = COLOR_SUBTLE;

  const week = data.windows.find((w) => w.label.startsWith("Woche (alle"));
  if (week) {
    widget.addSpacer(3);
    const weekText = widget.addText(`Woche: ${Math.round(week.utilization)} %`);
    weekText.font = Font.mediumSystemFont(10);
    weekText.textColor = COLOR_TEXT;
  }
}

function renderMedium(widget, data, stale) {
  widget.setPadding(14, 16, 12, 16);
  addHeader(widget, stale);
  widget.addSpacer(8);

  for (const w of data.windows.slice(0, 2)) {
    addWindowRow(widget, w, 250);
    widget.addSpacer(8);
  }

  widget.addSpacer();
  addFooter(widget, data);
}

function renderLarge(widget, data, stale) {
  widget.setPadding(16, 16, 14, 16);
  addHeader(widget, stale);
  widget.addSpacer(12);

  for (const w of data.windows) {
    addWindowRow(widget, w, 280);
    widget.addSpacer(12);
  }

  if (data.extra) {
    const row = widget.addStack();
    row.centerAlignContent();
    const label = row.addText("Extra-Nutzung");
    label.font = Font.systemFont(11);
    label.textColor = COLOR_SUBTLE;
    row.addSpacer();
    const used = (data.extra.used ?? 0).toFixed(2);
    const limit = data.extra.limit != null ? ` / $${data.extra.limit}` : "";
    const value = row.addText(`$${used}${limit}`);
    value.font = Font.mediumSystemFont(11);
    value.textColor = COLOR_TEXT;
    widget.addSpacer(12);
  }

  widget.addSpacer();
  addFooter(widget, data);
}

function addWindowRow(widget, w, barWidth) {
  const head = widget.addStack();
  head.centerAlignContent();
  const label = head.addText(w.label);
  label.font = Font.systemFont(11);
  label.textColor = COLOR_SUBTLE;
  head.addSpacer();
  const pct = head.addText(`${Math.round(w.utilization)} %`);
  pct.font = Font.boldSystemFont(13);
  pct.textColor = utilColor(w.utilization);

  widget.addSpacer(3);
  const bar = widget.addImage(drawProgressBar(w.utilization, barWidth, 8));
  bar.imageSize = new Size(barWidth, 8);

  widget.addSpacer(2);
  const reset = widget.addText(formatReset(w.resetsAt));
  reset.font = Font.systemFont(8);
  reset.textColor = COLOR_SUBTLE;
}

function addFooter(widget, data) {
  const updated = new Date(data.fetchedAt);
  const df = new DateFormatter();
  df.dateFormat = "HH:mm";
  const footer = widget.addText(`Stand ${df.string(updated)} Uhr`);
  footer.font = Font.systemFont(8);
  footer.textColor = COLOR_SUBTLE;
}

// ── Fortschrittsbalken ───────────────────────────────────────────────────────
function drawProgressBar(utilization, width, height) {
  const ctx = new DrawContext();
  ctx.size = new Size(width, height);
  ctx.opaque = false;
  ctx.respectScreenScale = true;

  const track = new Path();
  track.addRoundedRect(new Rect(0, 0, width, height), height / 2, height / 2);
  ctx.addPath(track);
  ctx.setFillColor(COLOR_TRACK);
  ctx.fillPath();

  const w = Math.max(height, (utilization / 100) * width);
  if (utilization > 0) {
    const fill = new Path();
    fill.addRoundedRect(new Rect(0, 0, w, height), height / 2, height / 2);
    ctx.addPath(fill);
    ctx.setFillColor(utilColor(utilization));
    ctx.fillPath();
  }
  return ctx.getImage();
}

function utilColor(utilization) {
  if (utilization >= 90) return COLOR_CRIT;
  if (utilization >= 70) return COLOR_WARN;
  return COLOR_OK;
}

// ── Formatierung ─────────────────────────────────────────────────────────────
function formatReset(iso) {
  if (!iso) return "kein aktives Fenster";
  const reset = new Date(iso);
  const diffMs = reset.getTime() - Date.now();
  if (diffMs <= 0) return "Reset jetzt";

  const totalMin = Math.round(diffMs / 60000);
  if (totalMin < 60) return `Reset in ${totalMin} min`;
  if (totalMin < 24 * 60) {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return m > 0 ? `Reset in ${h} h ${m} min` : `Reset in ${h} h`;
  }
  const df = new DateFormatter();
  df.dateFormat = "EEE HH:mm";
  return `Reset ${df.string(reset)} Uhr`;
}
