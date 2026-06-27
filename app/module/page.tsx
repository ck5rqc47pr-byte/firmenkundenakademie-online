import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FilterBar } from "@/components/FilterBar";
import { ModuleGrid } from "@/components/ModuleGrid";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { getAllModules, getKompetenzfelder, TRACKS } from "@/lib/modules";

export default async function ModulesPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? "";
  // Willkommens-/Onboarding-Sicht gezielt für Teilnehmer (nicht für Verwaltungsrollen).
  const showWelcome = role === "teilnehmer";

  const modules = getAllModules();
  const kompetenzfelder = getKompetenzfelder();

  // Track-Struktur für den Filter: nur Tracks/Felder zeigen, die Module haben.
  const usedSlugs = new Set(modules.map((m) => m.kompetenzfeld_slug));
  const tracks = Object.values(TRACKS)
    .map((track) => ({
      id: track.id,
      label: track.label,
      stufen: track.stufen as string[],
      felder: track.felder.filter((f) => usedSlugs.has(f.slug)),
    }))
    .filter((track) => modules.some((m) => m.zielrolle === track.id));

  return (
    <div>
      {/* Willkommens-/Onboarding-Sicht „Warum dieser Campus?" (nur Teilnehmer, dismissbar) */}
      {showWelcome && <WelcomeBanner />}

      {/* Heading block */}
      <section className="border-b border-ink px-6 lg:px-14 py-20 mx-auto max-w-content">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 mb-6">
          § Curriculum · {modules.length} Module · {kompetenzfelder.length} Kompetenzfelder · {tracks.length} Tracks
        </div>
        <h1 className="font-serif text-7xl lg:text-[96px] font-normal tracking-[-0.04em] leading-[0.92]">
          Programm.
        </h1>
      </section>

      {/* FilterBar */}
      <div className="border-b border-line bg-bg-2">
        <div className="mx-auto max-w-content px-6 lg:px-14 py-4">
          <Suspense fallback={null}>
            <FilterBar tracks={tracks} />
          </Suspense>
        </div>
      </div>

      {/* Module grid */}
      <div className="mx-auto max-w-content border-t border-l border-ink">
        <Suspense fallback={null}>
          <ModuleGrid modules={modules} />
        </Suspense>
      </div>
    </div>
  );
}
