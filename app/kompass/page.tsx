import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProgressForUser, getAssessmentForUser } from "@/lib/db";
import { getAllModules } from "@/lib/modules";
import type { Module } from "@/lib/modules";

export const dynamic = "force-dynamic";

type Status = "abgeschlossen" | "empfehlung" | "offen";

const ETAPPEN = [
  {
    nr: 1,
    stufe: "Berater" as const,
    titel: "Beraterhandwerk",
    versprechen:
      "Du beherrschst dein Werkzeug. Bilanzen lesen, Risiken früh erkennen, KMU-Strukturen verstehen — die handwerkliche Grundlage, auf der alles Weitere aufbaut.",
    dark: false,
  },
  {
    nr: 2,
    stufe: "Sparringspartner" as const,
    titel: "Sparringspartner",
    versprechen:
      "Du wirst gefragt, nicht beauftragt. Der Kunde sucht das Gespräch, weil du Strukturen erkennst, die andere übersehen — und Optionen aufzeigst, die er selbst nicht gesehen hätte.",
    dark: false,
  },
  {
    nr: 3,
    stufe: "Strategischer Partner" as const,
    titel: "Strategischer Partner",
    versprechen:
      "Du gestaltest mit — bei deinem Kunden und in deinem Haus. Nachfolge, Kapitalstruktur, Marktbearbeitung: Themen, in denen aus Beratung Partnerschaft wird.",
    dark: true,
  },
];

function Station({
  m,
  status,
  dark,
}: {
  m: Module;
  status: Status;
  dark: boolean;
}) {
  const dotBase =
    "w-10 h-10 rounded-full flex items-center justify-center font-mono text-[10px] font-medium transition-transform group-hover:scale-110 flex-shrink-0 relative z-10";

  let dotClass = "";
  if (status === "abgeschlossen") {
    dotClass = dark
      ? "bg-white text-primary border border-white"
      : "bg-primary text-white border border-primary";
  } else if (status === "empfehlung") {
    dotClass =
      "bg-accent text-white border border-accent/70 ring-2 ring-accent/20 ring-offset-1";
  } else {
    dotClass = dark
      ? "bg-transparent border border-dotted border-white/30 text-white/30"
      : "bg-transparent border border-dotted border-ink-3 text-ink-3 opacity-40";
  }

  const shortTitle =
    m.title.length > 16 ? m.title.slice(0, 14).trimEnd() + "…" : m.title;

  return (
    <Link
      href={`/module/${m.id}`}
      className="group relative flex flex-col items-center gap-2 text-center focus:outline-none"
    >
      <div className={`${dotBase} ${dotClass}`}>{m.id}</div>
      <div
        className={`hidden sm:block font-mono text-[9px] uppercase tracking-[0.05em] leading-tight max-w-[72px] ${
          dark ? "text-white/40" : "text-ink-3"
        }`}
      >
        {shortTitle}
      </div>

      {/* Tooltip – nur Desktop */}
      <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-60 bg-bg border border-line p-3.5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-30 shadow-lg text-left">
        <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-3 mb-1.5">
          {m.id} · {m.stufe} · {m.dauer}
        </div>
        <div className="font-serif text-sm font-medium text-ink mb-2.5 leading-snug">
          {m.title}
        </div>
        {m.lernziele.slice(0, 3).map((lz, i) => (
          <div key={i} className="flex gap-2 text-[11px] text-ink-2 leading-snug mb-1">
            <span className="text-ink-3 shrink-0">—</span>
            <span className="line-clamp-1">{lz.text}</span>
          </div>
        ))}
        {status === "abgeschlossen" && (
          <div className="mt-2.5 pt-2 border-t border-line font-mono text-[9px] uppercase tracking-[0.06em] text-emerald-600">
            ✓ Abgeschlossen
          </div>
        )}
        {status === "empfehlung" && (
          <div className="mt-2.5 pt-2 border-t border-line font-mono text-[9px] uppercase tracking-[0.06em] text-accent">
            → Empfohlener nächster Schritt
          </div>
        )}
      </div>
    </Link>
  );
}

export default async function KompassPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/kompass");

  const userId = (session.user as { id?: string }).id!;
  const userName = session.user?.name ?? "Teilnehmer";

  const allModules = getAllModules().filter((m) => m.status === "freigegeben");
  const [progress, assessment] = await Promise.all([
    getProgressForUser(userId),
    getAssessmentForUser(userId),
  ]);
  const completedIds = new Set(progress.map((p) => p.module_id));
  const assessmentMap: Record<string, number> = {};
  for (const e of assessment) assessmentMap[e.field_slug] = e.self_score;

  const completedCount = allModules.filter((m) => completedIds.has(m.id)).length;

  // Empfehlung: erstes nicht abgeschlossenes Modul (nach Etappen-Reihenfolge)
  const empfehlungId = ETAPPEN.flatMap((e) =>
    allModules.filter((m) => m.stufe === e.stufe)
  ).find((m) => !completedIds.has(m.id))?.id ?? null;

  function getStatus(m: Module): Status {
    if (completedIds.has(m.id)) return "abgeschlossen";
    if (m.id === empfehlungId) return "empfehlung";
    return "offen";
  }

  return (
    <div className="min-h-screen bg-bg">

      {/* HERO */}
      <section className="border-b border-line px-6 lg:px-14 py-12 lg:py-20 max-w-[1240px] mx-auto">
        <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3 mb-7 flex items-center gap-3">
          <span className="w-6 h-px bg-ink-3 inline-block" />
          FKB Campus · Kompass
        </div>
        <h1 lang="de" className="font-serif text-[clamp(36px,8vw,88px)] font-normal leading-[1.05] tracking-[-0.03em] mb-8 max-w-3xl hyphens-auto">
          Der{" "}
          <em className="italic" style={{ color: "var(--ink-2)" }}>
            Firmenkundenkompass
          </em>
          .
        </h1>
        <p className="font-serif text-lg text-ink-2 leading-relaxed max-w-xl mb-12">
          In drei Etappen vom Berater zum strategischen Sparringspartner. Der
          Kompass zeigt deinen Standort, markiert den nächsten Schritt und hält
          fest, was du bereits gelernt hast.
        </p>
        <div className="grid grid-cols-2 sm:flex sm:gap-10 gap-6 pt-8 border-t border-line">
          {[
            { num: allModules.length, label: "Module" },
            { num: 3, label: "Etappen" },
            { num: completedCount, label: "Abgeschlossen" },
            {
              num: allModules.length - completedCount,
              label: "Noch offen",
            },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <span className="font-serif text-4xl font-normal tracking-[-0.02em] leading-none">
                {item.num}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* STANDORTBESTIMMUNG */}
      <section className="border-b border-line max-w-[1240px] mx-auto px-6 lg:px-14 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-5 flex items-center gap-2">
              <span className="w-4 h-px inline-block bg-ink-3" />
              Standort
            </div>
            <h2 className="font-serif text-4xl font-normal tracking-[-0.02em] leading-tight mb-4">
              Wo stehst du{" "}
              <em className="italic text-ink-2">heute?</em>
            </h2>
            <p className="font-serif text-base text-ink-2 leading-relaxed mb-8">
              {assessment.length > 0
                ? "Deine persönliche Kompetenzkarte — basierend auf deiner Selbsteinschätzung. Du kannst sie jederzeit aktualisieren."
                : "Bevor du losziehst, eine ehrliche Selbsteinschätzung über deine Kompetenzen in allen sechs Feldern. Dauer: rund fünf Minuten. Ergebnis: deine persönliche Kompetenzkarte."}
            </p>
            <Link
              href="/kompass/einschaetzung"
              className="inline-flex items-center gap-3 border border-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.06em] text-primary hover:bg-primary hover:text-white transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
              {assessment.length > 0 ? "Einschätzung aktualisieren →" : "Kompetenzkarte erstellen →"}
            </Link>
          </div>

          {/* Heatmap */}
          <div>
            <div className="border border-line overflow-hidden">
              <div className="grid grid-cols-[100px_repeat(3,1fr)] sm:grid-cols-[180px_repeat(3,1fr)] border-b border-line">
                {["", "Berater", "Sparringspartner", "Strategischer Partner"].map((h) => (
                  <div
                    key={h}
                    className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3 bg-bg-2"
                  >
                    {h}
                  </div>
                ))}
              </div>
              {[
                { label: "Finanzanalyse", slug: "finanzanalyse" },
                { label: "Branchenwissen", slug: "branchenwissen" },
                { label: "Gesprächsführung", slug: "gespraechsfuehrung" },
                { label: "Vertrieb", slug: "vertrieb" },
                { label: "Digital", slug: "digital" },
                { label: "Führung", slug: "fuehrung" },
              ].map((row) => {
                const score = assessmentMap[row.slug] ?? 0;
                const fill = [1, 2, 3].map((s) => (score >= s ? score : 0));
                const hasData = score > 0;
                return (
                  <div
                    key={row.slug}
                    className="grid grid-cols-[100px_repeat(3,1fr)] sm:grid-cols-[180px_repeat(3,1fr)] border-b border-line last:border-b-0"
                  >
                    <div className="px-2 py-3 font-sans text-[10px] sm:text-[12px] font-medium text-ink bg-bg flex items-center leading-tight">
                      {row.label}
                    </div>
                    {fill.map((f, i) => (
                      <div
                        key={i}
                        className={`px-3 py-3 flex items-center justify-center font-mono text-[10px] transition-colors ${
                          !hasData
                            ? "bg-bg text-ink-3/20"
                            : f === 3
                            ? "bg-primary text-white"
                            : f === 2
                            ? "bg-primary/20 text-primary"
                            : f === 1
                            ? "bg-primary/8 text-ink-3"
                            : "bg-bg text-ink-3/20"
                        }`}
                      >
                        {hasData ? (f > 0 ? "●" : "·") : "·"}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <p className="font-mono text-[10px] text-ink-3 mt-3 uppercase tracking-[0.06em]">
              {assessment.length > 0
                ? "Deine Kompetenzkarte · zuletzt aktualisiert"
                : "Noch keine Einschätzung · Karte ist leer"}
            </p>
          </div>
        </div>
      </section>

      {/* ETAPPEN */}
      <div className="border-b border-line">
        {ETAPPEN.map((etappe, etappeIdx) => {
          const etappeModule = allModules.filter(
            (m) => m.stufe === etappe.stufe
          );
          const etappeDone = etappeModule.filter((m) =>
            completedIds.has(m.id)
          ).length;

          const bgClass = etappe.dark
            ? "bg-primary"
            : etappeIdx % 2 === 0
            ? "bg-bg"
            : "bg-bg-2";

          const textClass = etappe.dark ? "text-white" : "text-ink";
          const mutedClass = etappe.dark ? "text-white/50" : "text-ink-3";
          const borderClass = etappe.dark ? "border-white/15" : "border-line";

          return (
            <section
              key={etappe.nr}
              className={`${bgClass} border-b ${borderClass} px-6 lg:px-14 py-10 lg:py-14`}
            >
              <div className="max-w-[1240px] mx-auto">

                {/* Etappen-Header */}
                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 lg:gap-16 mb-12">
                  <div>
                    <div
                      className={`font-mono text-[10px] uppercase tracking-[0.1em] mb-5 flex items-center gap-2 ${mutedClass}`}
                    >
                      <span className="w-4 h-px inline-block bg-current" />
                      Etappe {etappe.nr}
                    </div>
                    <h2
                      className={`font-serif text-2xl font-medium tracking-[-0.01em] mb-2 ${textClass}`}
                    >
                      {etappe.titel}
                    </h2>
                    <div className={`font-mono text-[10px] uppercase tracking-[0.06em] ${mutedClass}`}>
                      {etappeModule.length} Module · {etappeDone} abgeschlossen
                    </div>
                  </div>
                  <p
                    className={`font-serif text-lg italic leading-relaxed self-center max-w-xl ${
                      etappe.dark ? "text-white/60" : "text-ink-2"
                    }`}
                  >
                    „{etappe.versprechen}"
                  </p>
                </div>

                {/* Stationen */}
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
                  {etappeModule.map((m) => (
                    <Station
                      key={m.id}
                      m={m}
                      status={getStatus(m)}
                      dark={etappe.dark}
                    />
                  ))}
                </div>

                {/* Legende */}
                <div
                  className={`mt-10 pt-6 border-t ${borderClass} flex flex-wrap gap-6`}
                >
                  {[
                    {
                      symbol: "●",
                      color: etappe.dark ? "text-white" : "text-primary",
                      label: "Abgeschlossen",
                    },
                    {
                      symbol: "●",
                      color: "text-accent",
                      label: "Empfohlener nächster Schritt",
                    },
                    {
                      symbol: "○",
                      color: mutedClass,
                      label: "Noch offen",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2"
                    >
                      <span className={`text-xs ${item.color}`}>
                        {item.symbol}
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.06em] ${mutedClass}`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>


    </div>
  );
}
