import Link from "next/link";
import { ModuleCard } from "@/components/ModuleCard";
import { getAllModules, getKompetenzfelder } from "@/lib/modules";

const featuredFieldDefinitions = [
  {
    slug: "finanzanalyse",
    shortName: "Finanzanalyse",
    title: "K-01 Finanzanalyse & Kreditexpertise",
    description: "Sicherer Umgang mit Abschlüssen, Kennzahlen und Kreditlogik.",
  },
  {
    slug: "branchenwissen",
    shortName: "Branchenwissen",
    title: "K-02 Branchenwissen",
    description: "Branchenspezifisches Wissen für fundierte Einordnung im Kundengespräch.",
  },
  {
    slug: "gespraechsfuehrung",
    shortName: "Gesprächsführung",
    title: "K-03 Gesprächsführung",
    description: "Beratungsarchitekturen für überzeugende, vertrauensstarke Gespräche.",
  },
] as const;

export default function HomePage() {
  const modules = getAllModules();
  const kompetenzfelder = getKompetenzfelder();
  const fieldLookup = new Map(kompetenzfelder.map((field) => [field.slug, field]));
  const featuredFields = featuredFieldDefinitions.map((field) => {
    const existing = fieldLookup.get(field.slug);

    return {
      ...field,
      name: existing?.name ?? field.title,
      count: existing?.count ?? 0,
    };
  });

  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-[2.5rem] border border-primary/10 bg-white shadow-card">
        <div className="grid gap-10 px-6 py-10 lg:grid-cols-[1.3fr_0.9fr] lg:px-10 lg:py-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
              Wissenschaftlich fundierte Weiterbildung
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-primary lg:text-6xl">
              Online-Lernplattform für exzellente Firmenkundenberatung
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              21 Module · 5 Kompetenzfelder · Akademie-Niveau. Die Firmenkundenakademie
              verbindet Fachwissen, Transfer in die Praxis und modulare Weiterbildung für
              Volksbanken und Raiffeisenbanken.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/module"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Alle Module ansehen
              </Link>
              <Link
                href="#akademie"
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
              >
                So funktioniert die Akademie
              </Link>
            </div>
          </div>
          <div className="grid gap-4 rounded-[2rem] bg-surface p-6">
            <div className="rounded-[1.75rem] bg-primary px-5 py-6 text-white">
              <p className="text-sm uppercase tracking-[0.2em] text-white/70">Module online</p>
              <p className="mt-2 text-4xl font-semibold">{modules.length}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-white p-5">
                <p className="text-sm text-slate-500">Freigegeben</p>
                <p className="mt-2 text-3xl font-semibold text-ink">
                  {modules.filter((module) => module.status === "freigegeben").length}
                </p>
              </div>
              <div className="rounded-[1.75rem] bg-white p-5">
                <p className="text-sm text-slate-500">Kompetenzfelder</p>
                <p className="mt-2 text-3xl font-semibold text-ink">{kompetenzfelder.length}</p>
              </div>
            </div>
            <p className="rounded-[1.75rem] border border-dashed border-primary/20 bg-white p-5 text-sm leading-7 text-slate-600">
              Neue Module werden automatisch aus <code>content/modules/</code> geladen. Die
              Plattform bleibt damit dateibasiert, wartungsarm und deploymentfreundlich.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Kompetenzfelder
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-primary">
              Lernen entlang echter Beratungssituationen
            </h2>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredFields.map((field) => (
            <Link
              key={field.slug}
              href={`/kompetenzfeld/${field.slug}`}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                {field.count} Module
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-ink">{field.shortName}</h3>
              <p className="mt-2 text-sm font-medium text-slate-500">{field.name}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{field.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="akademie" className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-card lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Wie die Akademie funktioniert
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {[
            ["1", "Modul wählen", "Wählen Sie ein Modul entlang von Kompetenzfeld, Stufe und Praxisbedarf."],
            ["2", "Video + Unterlagen", "Bearbeiten Sie Video, Inhalte und Unterlagen im eigenen Lerntempo."],
            ["3", "Transfer in die Praxis", "Übertragen Sie das Gelernte mit Cases und Transferaufgaben ins Kundengespräch."],
          ].map(([step, title, description]) => (
            <div key={step} className="rounded-[2rem] bg-surface p-6">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                {step}
              </span>
              <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Erste verfügbare Module
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-primary">Direkt einsteigen</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {modules.slice(0, 3).map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>
    </div>
  );
}
