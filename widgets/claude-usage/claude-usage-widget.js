// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: chart-bar;
//
// ─────────────────────────────────────────────────────────────────────────────
//  Claude Usage Widget für iPhone (Scriptable)
//
//  Zeigt die aktuelle Nutzung der Anthropic/Claude API:
//    • Kosten heute (USD)
//    • Kosten im laufenden Monat (Month-to-Date)
//    • Token-Verbrauch heute (Input / Output / Cache)
//    • 7-Tage-Verlauf als Balkendiagramm (Medium/Large)
//
//  Voraussetzung: Ein Anthropic Admin API Key (beginnt mit "sk-ant-admin...").
//  Diesen erhältst du in der Claude Console unter Settings → Admin Keys.
//  Hinweis: Die Admin API ist nur für Organisationen verfügbar, nicht für
//  Einzel-Accounts. Details siehe README.md im selben Ordner.
//
//  Einrichtung:
//    1. Dieses Script in Scriptable anlegen (Name z. B. "Claude Usage").
//    2. Script einmal in der Scriptable-App ausführen → Admin-Key eingeben
//       (wird sicher im iOS-Schlüsselbund gespeichert, nicht im Script).
//    3. Widget zum Homescreen hinzufügen und dieses Script auswählen.
// ─────────────────────────────────────────────────────────────────────────────

const KEYCHAIN_KEY = "anthropic-admin-api-key";
const API_BASE = "https://api.anthropic.com";
const ANTHROPIC_VERSION = "2023-06-01";
const CACHE_FILE = "claude-usage-widget-cache.json";
const REFRESH_MINUTES = 15;

// ── Farben (passen sich an Hell-/Dunkelmodus an) ────────────────────────────
const COLOR_BG_TOP = Color.dynamic(new Color("#faf9f5"), new Color("#1f1d1a"));
const COLOR_BG_BOTTOM = Color.dynamic(new Color("#f0eee6"), new Color("#141312"));
const COLOR_ACCENT = new Color("#d97757"); // Anthropic-Orange
const COLOR_TEXT = Color.dynamic(new Color("#1f1d1a"), new Color("#faf9f5"));
const COLOR_SUBTLE = Color.dynamic(new Color("#6e6a60"), new Color("#a8a396"));
const COLOR_BAR = new Color("#d97757", 0.85);
const COLOR_BAR_TODAY = new Color("#d97757");

// ─────────────────────────────────────────────────────────────────────────────
//  Einstieg
// ─────────────────────────────────────────────────────────────────────────────

const apiKey = await resolveApiKey();

if (config.runsInWidget) {
  const widget = await buildWidget(apiKey);
  Script.setWidget(widget);
} else {
  // In der App: Widget als Vorschau anzeigen
  const widget = await buildWidget(apiKey);
  await widget.presentMedium();
}
Script.complete();

// ─────────────────────────────────────────────────────────────────────────────
//  API-Key-Verwaltung (iOS-Schlüsselbund)
// ─────────────────────────────────────────────────────────────────────────────

async function resolveApiKey() {
  if (Keychain.contains(KEYCHAIN_KEY)) {
    return Keychain.get(KEYCHAIN_KEY);
  }
  if (config.runsInWidget) {
    // Kein Key hinterlegt — Widget zeigt Einrichtungshinweis
    return null;
  }
  const alert = new Alert();
  alert.title = "Claude Admin API Key";
  alert.message =
    "Bitte gib deinen Anthropic Admin API Key ein (sk-ant-admin...).\n\n" +
    "Du findest ihn in der Claude Console unter Settings → Admin Keys. " +
    "Der Key wird sicher im iOS-Schlüsselbund gespeichert.";
  alert.addSecureTextField("sk-ant-admin-...");
  alert.addAction("Speichern");
  alert.addCancelAction("Abbrechen");
  const choice = await alert.present();
  if (choice === -1) return null;
  const entered = alert.textFieldValue(0).trim();
  if (!entered.startsWith("sk-ant-admin")) {
    const warn = new Alert();
    warn.title = "Ungültiger Key";
    warn.message =
      "Der Key muss mit \"sk-ant-admin\" beginnen. Ein normaler API-Key " +
      "(sk-ant-api...) funktioniert für die Usage/Cost API nicht.";
    warn.addAction("OK");
    await warn.present();
    return null;
  }
  Keychain.set(KEYCHAIN_KEY, entered);
  return entered;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Datenbeschaffung
// ─────────────────────────────────────────────────────────────────────────────

async function loadData(key) {
  const now = new Date();

  // 7-Tage-Fenster für den Usage-Report (UTC-Tages-Buckets)
  const usageStart = new Date(now);
  usageStart.setUTCDate(usageStart.getUTCDate() - 6);
  usageStart.setUTCHours(0, 0, 0, 0);

  // Monatsanfang für den Cost-Report
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const [usage, cost] = await Promise.all([
    fetchAllPages(
      `${API_BASE}/v1/organizations/usage_report/messages` +
        `?starting_at=${usageStart.toISOString()}&bucket_width=1d&limit=7`,
      key
    ),
    fetchAllPages(
      `${API_BASE}/v1/organizations/cost_report` +
        `?starting_at=${monthStart.toISOString()}&bucket_width=1d&limit=31`,
      key
    ),
  ]);

  return summarize(usage, cost, now);
}

async function fetchAllPages(url, key) {
  const buckets = [];
  let page = null;
  for (let i = 0; i < 5; i++) {
    const req = new Request(page ? `${url}&page=${encodeURIComponent(page)}` : url);
    req.headers = {
      "x-api-key": key,
      "anthropic-version": ANTHROPIC_VERSION,
      "User-Agent": "claude-usage-scriptable-widget/1.0",
    };
    const res = await req.loadJSON();
    if (res.error) {
      throw new Error(res.error.message || "API-Fehler");
    }
    buckets.push(...(res.data || []));
    if (!res.has_more || !res.next_page) break;
    page = res.next_page;
  }
  return buckets;
}

function summarize(usageBuckets, costBuckets, now) {
  const todayKey = now.toISOString().slice(0, 10);

  // Token-Summen je Tag
  const days = usageBuckets.map((bucket) => {
    let input = 0, output = 0, cacheRead = 0, cacheWrite = 0;
    for (const r of bucket.results || []) {
      input += r.uncached_input_tokens || 0;
      output += r.output_tokens || 0;
      cacheRead += r.cache_read_input_tokens || 0;
      cacheWrite +=
        (r.cache_creation?.ephemeral_5m_input_tokens || 0) +
        (r.cache_creation?.ephemeral_1h_input_tokens || 0);
    }
    return {
      date: bucket.starting_at.slice(0, 10),
      input,
      output,
      cacheRead,
      cacheWrite,
      total: input + output + cacheRead + cacheWrite,
    };
  });

  const today = days.find((d) => d.date === todayKey) || {
    date: todayKey, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0,
  };

  // Kosten: Beträge sind Dezimal-Strings in Cent → durch 100 teilen
  let costToday = 0;
  let costMonth = 0;
  for (const bucket of costBuckets) {
    let bucketSum = 0;
    for (const r of bucket.results || []) {
      bucketSum += parseFloat(r.amount || "0") / 100;
    }
    costMonth += bucketSum;
    if (bucket.starting_at.slice(0, 10) === todayKey) costToday += bucketSum;
  }

  return {
    fetchedAt: now.toISOString(),
    today,
    days,
    costToday,
    costMonth,
  };
}

// ── Cache: letzter erfolgreicher Abruf als Fallback bei Netz-/API-Fehlern ───
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
    // Cache ist optional — Fehler ignorieren
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Widget-Aufbau
// ─────────────────────────────────────────────────────────────────────────────

async function buildWidget(key) {
  const widget = new ListWidget();
  const gradient = new LinearGradient();
  gradient.colors = [COLOR_BG_TOP, COLOR_BG_BOTTOM];
  gradient.locations = [0, 1];
  widget.backgroundGradient = gradient;
  widget.refreshAfterDate = new Date(Date.now() + REFRESH_MINUTES * 60 * 1000);
  widget.url = "https://platform.claude.com/usage";

  if (!key) {
    renderSetupHint(widget);
    return widget;
  }

  let data;
  let stale = false;
  try {
    data = await loadData(key);
    writeCache(data);
  } catch (e) {
    data = readCache();
    stale = true;
    if (!data) {
      renderError(widget, e.message || String(e));
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

function renderSetupHint(widget) {
  widget.setPadding(14, 14, 14, 14);
  addHeader(widget);
  widget.addSpacer(8);
  const text = widget.addText(
    "Kein API-Key hinterlegt.\nÖffne das Script einmal in der Scriptable-App, um deinen Admin-Key einzugeben."
  );
  text.font = Font.systemFont(12);
  text.textColor = COLOR_SUBTLE;
  widget.addSpacer();
}

function renderError(widget, message) {
  widget.setPadding(14, 14, 14, 14);
  addHeader(widget);
  widget.addSpacer(8);
  const text = widget.addText(`Fehler beim Abruf:\n${message}`);
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
  const title = row.addText("Claude-Nutzung");
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

  const costLabel = widget.addText("Heute");
  costLabel.font = Font.systemFont(10);
  costLabel.textColor = COLOR_SUBTLE;

  const cost = widget.addText(formatUsd(data.costToday));
  cost.font = Font.boldSystemFont(24);
  cost.textColor = COLOR_TEXT;
  cost.minimumScaleFactor = 0.6;
  cost.lineLimit = 1;

  widget.addSpacer(4);
  const tokens = widget.addText(`${formatTokens(data.today.total)} Tokens`);
  tokens.font = Font.systemFont(11);
  tokens.textColor = COLOR_SUBTLE;

  widget.addSpacer();
  const month = widget.addText(`Monat: ${formatUsd(data.costMonth)}`);
  month.font = Font.mediumSystemFont(11);
  month.textColor = COLOR_ACCENT;
}

function renderMedium(widget, data, stale) {
  widget.setPadding(14, 16, 14, 16);
  addHeader(widget, stale);
  widget.addSpacer(8);

  const body = widget.addStack();
  body.layoutHorizontally();
  body.centerAlignContent();

  // Linke Spalte: Zahlen
  const left = body.addStack();
  left.layoutVertically();

  addStat(left, "Heute", formatUsd(data.costToday), 20);
  left.addSpacer(6);
  addStat(left, "Monat", formatUsd(data.costMonth), 14);
  left.addSpacer(6);
  addStat(left, "Tokens heute", formatTokens(data.today.total), 14);

  body.addSpacer();

  // Rechte Spalte: 7-Tage-Chart
  const right = body.addStack();
  right.layoutVertically();
  const chart = right.addImage(drawBarChart(data.days, 150, 64));
  chart.imageSize = new Size(150, 64);
  right.addSpacer(3);
  const caption = right.addText("Tokens, letzte 7 Tage");
  caption.font = Font.systemFont(8);
  caption.textColor = COLOR_SUBTLE;
  caption.rightAlignText();

  widget.addSpacer();
  addFooter(widget, data);
}

function renderLarge(widget, data, stale) {
  widget.setPadding(16, 16, 16, 16);
  addHeader(widget, stale);
  widget.addSpacer(10);

  const row = widget.addStack();
  row.layoutHorizontally();
  addStat(row, "Heute", formatUsd(data.costToday), 24);
  row.addSpacer();
  addStat(row, "Monat (MTD)", formatUsd(data.costMonth), 24);

  widget.addSpacer(14);

  const chart = widget.addImage(drawBarChart(data.days, 300, 90));
  chart.imageSize = new Size(300, 90);
  widget.addSpacer(3);
  const caption = widget.addText("Tokens, letzte 7 Tage");
  caption.font = Font.systemFont(9);
  caption.textColor = COLOR_SUBTLE;

  widget.addSpacer(14);

  const t = data.today;
  const detail = widget.addStack();
  detail.layoutHorizontally();
  addStat(detail, "Input", formatTokens(t.input), 13);
  detail.addSpacer();
  addStat(detail, "Output", formatTokens(t.output), 13);
  detail.addSpacer();
  addStat(detail, "Cache-Read", formatTokens(t.cacheRead), 13);
  detail.addSpacer();
  addStat(detail, "Cache-Write", formatTokens(t.cacheWrite), 13);

  widget.addSpacer();
  addFooter(widget, data);
}

function addStat(stack, label, value, size) {
  const col = stack.addStack();
  col.layoutVertically();
  const l = col.addText(label);
  l.font = Font.systemFont(Math.max(9, size - 5));
  l.textColor = COLOR_SUBTLE;
  const v = col.addText(value);
  v.font = Font.boldSystemFont(size);
  v.textColor = COLOR_TEXT;
  v.minimumScaleFactor = 0.6;
  v.lineLimit = 1;
}

function addFooter(widget, data) {
  const updated = new Date(data.fetchedAt);
  const df = new DateFormatter();
  df.dateFormat = "HH:mm";
  const footer = widget.addText(`Stand ${df.string(updated)} Uhr`);
  footer.font = Font.systemFont(8);
  footer.textColor = COLOR_SUBTLE;
}

// ── 7-Tage-Balkendiagramm ────────────────────────────────────────────────────
function drawBarChart(days, width, height) {
  const ctx = new DrawContext();
  ctx.size = new Size(width, height);
  ctx.opaque = false;
  ctx.respectScreenScale = true;

  const max = Math.max(...days.map((d) => d.total), 1);
  const n = 7;
  const gap = 6;
  const barWidth = (width - gap * (n - 1)) / n;

  // Es kann weniger als 7 Buckets geben (z. B. Monatsanfang) — rechtsbündig auffüllen
  const padded = [...Array(Math.max(0, n - days.length)).fill(null), ...days.slice(-n)];

  padded.forEach((day, i) => {
    const x = i * (barWidth + gap);
    if (!day) return;
    const h = Math.max(3, (day.total / max) * (height - 4));
    const isLast = i === padded.length - 1;
    ctx.setFillColor(isLast ? COLOR_BAR_TODAY : COLOR_BAR);
    const rect = new Rect(x, height - h, barWidth, h);
    const path = new Path();
    path.addRoundedRect(rect, 3, 3);
    ctx.addPath(path);
    ctx.fillPath();
  });

  return ctx.getImage();
}

// ── Formatierung ─────────────────────────────────────────────────────────────
function formatUsd(value) {
  if (value >= 100) return `$${value.toFixed(0)}`;
  return `$${value.toFixed(2)}`;
}

function formatTokens(value) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} Mrd.`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} Mio.`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return `${value}`;
}
