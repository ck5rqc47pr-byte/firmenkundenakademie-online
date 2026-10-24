import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllWerkzeuge } from "@/lib/modules";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Werkzeuge · FKB Campus",
  description:
    "Interaktive Werkzeuge für den Beratungsalltag – Prüf- und Entscheidungshilfen, die das Modulwissen in die Praxis übersetzen.",
};

export default async function WerkzeugeIndex() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/werkzeuge");

  const werkzeuge = getAllWerkzeuge();

  return (
    <div className="mx-auto max-w-content px-6 lg:px-14 py-12 lg:py-20">
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
        FKB Campus · Werkzeuge
      </span>
      <h1 className="font-serif text-3xl lg:text-4xl text-ink mt-2">Werkzeuge für den Beratungsalltag</h1>
      <p className="text-ink-2 mt-4 max-w-prose">
        Interaktive Prüf- und Entscheidungshilfen, die das Modulwissen in die Praxis übersetzen.
        Alle Eingaben bleiben nur im Browser und werden nicht gespeichert.
      </p>

      {werkzeuge.length === 0 ? (
        <p className="text-ink-3 mt-10">Zurzeit sind keine Werkzeuge verfügbar.</p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {werkzeuge.map((w) => (
            <Link
              key={w.slug}
              href={`/werkzeuge/${w.slug}`}
              className="group flex flex-col justify-between gap-6 border border-line p-6 hover:border-primary transition min-h-[160px]"
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">
                  zu {w.moduleId} · {w.moduleTitle}
                </div>
                <h2 className="font-serif text-xl text-ink mt-2 group-hover:text-primary transition">
                  {w.label}
                </h2>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 group-hover:text-primary transition">
                Werkzeug öffnen →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
