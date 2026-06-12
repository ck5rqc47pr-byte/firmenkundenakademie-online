import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllModules } from "@/lib/modules";
import { getProgressForUser } from "@/lib/db";

export const dynamic = "force-dynamic";

const STUFEN: { slug: string; name: string; beschreibung: string }[] = [
  { slug: "berater", name: "Berater",
    beschreibung: "Das Beraterhandwerk: Bilanzen lesen, Risiken erkennen, Systeme effizient nutzen." },
  { slug: "sparringspartner", name: "Sparringspartner",
    beschreibung: "Situativ und proaktiv: Strukturen erkennen, Bedarfe heben, Entscheidungen vertreten." },
  { slug: "strategischer-partner", name: "Strategischer Partner",
    beschreibung: "Auf Augenhöhe mit der Geschäftsführung: Strategie, Nachfolge, Marktbearbeitung." },
];

export default async function ZertifikatePage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!session || !userId) redirect("/login?callbackUrl=/zertifikate");

  const alleModule = getAllModules().filter((m) => m.status === "freigegeben");
  const progress = await getProgressForUser(userId);
  const completed = new Set(progress.map((p) => p.module_id));

  return (
    <div className="mx-auto max-w-content px-6 lg:px-14 py-12 lg:py-20">
      <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-4 flex items-center gap-2">
        <span className="w-4 h-px bg-ink-3 inline-block" />
        Ihr Entwicklungspfad
      </div>
      <h1 className="font-serif text-4xl font-normal tracking-[-0.02em] mb-3">Zertifikate</h1>
      <p className="font-serif text-base text-ink-2 leading-relaxed max-w-2xl mb-12">
        Für jede abgeschlossene Kompetenzstufe erhalten Sie ein Zertifikat des FKB Campus.
        Eine Stufe gilt als abgeschlossen, wenn alle zugehörigen Module als abgeschlossen
        markiert sind.
      </p>

      <div className="space-y-5">
        {STUFEN.map((s) => {
          const stufenModule = alleModule.filter((m) => m.stufe === s.name);
          const done = stufenModule.filter((m) => completed.has(m.id));
          const complete = stufenModule.length > 0 && done.length === stufenModule.length;
          const pct = stufenModule.length
            ? Math.round((done.length / stufenModule.length) * 100) : 0;
          return (
            <div key={s.slug} className="border border-line bg-white p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-1.5">
                    Kompetenzstufe
                  </div>
                  <h2 className="font-serif text-2xl text-ink mb-2">{s.name}</h2>
                  <p className="font-serif text-sm text-ink-2 leading-relaxed mb-4">
                    {s.beschreibung}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-1.5 bg-bg-2 border border-line flex-1 max-w-xs">
                      <div className={`h-full ${complete ? "bg-emerald-600" : "bg-primary"}`}
                           style={{ width: `${pct}%` }} />
                    </div>
                    <span className="font-mono text-[11px] text-ink-2 whitespace-nowrap">
                      {done.length} / {stufenModule.length} Module
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  {complete ? (
                    <a href={`/api/zertifikat/${s.slug}`} target="_blank" rel="noreferrer"
                       className="inline-flex items-center gap-3 bg-primary text-white px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] hover:opacity-90 transition">
                      Zertifikat laden (PDF) ↓
                    </a>
                  ) : (
                    <div className="text-right">
                      <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3 block mb-2">
                        Noch {stufenModule.length - done.length} Modul(e) offen
                      </span>
                      <Link href="/module"
                            className="font-mono text-[10px] uppercase tracking-[0.06em] text-primary hover:underline">
                        Zu den Modulen →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-10 font-mono text-[9px] uppercase tracking-[0.06em] text-ink-3">
        Grundlage: Selbstmarkierung „Modul abschließen" auf den Modulseiten ·
        Dreyfus-Kompetenzmodell · Bloom-Taxonomie
      </p>
    </div>
  );
}
