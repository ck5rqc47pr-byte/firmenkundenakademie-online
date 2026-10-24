import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getWerkzeugBySlug, getModuleById } from "@/lib/modules";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const w = getWerkzeugBySlug(params.slug);
  return { title: w ? `${w.label} · FKB Campus` : "Werkzeug · FKB Campus" };
}

export default async function WerkzeugPage({ params }: { params: { slug: string } }) {
  const werkzeug = getWerkzeugBySlug(params.slug);
  if (!werkzeug) notFound();

  const session = await getServerSession(authOptions);
  if (!session) redirect(`/login?callbackUrl=/werkzeuge/${params.slug}`);

  const modul = getModuleById(werkzeug.moduleId);

  return (
    <div className="mx-auto max-w-content px-6 lg:px-14 py-8 lg:py-12">
      <div className="flex flex-wrap items-baseline justify-between gap-3 pb-5 border-b border-ink">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
            FKB Campus · Werkzeug{modul ? ` · ${modul.id}` : ""}
          </div>
          <h1 className="font-serif text-2xl text-ink mt-1">{werkzeug.label}</h1>
        </div>
        {modul && (
          <Link
            href={`/module/${modul.id}`}
            className="font-mono text-[10px] uppercase tracking-[0.06em] border border-line text-ink-2 px-3 py-2 hover:border-primary hover:text-primary transition"
          >
            ← zu {modul.id}
          </Link>
        )}
      </div>

      <p className="text-ink-2 text-sm mt-4 mb-4 max-w-prose">
        Interaktives Werkzeug – alle Eingaben bleiben nur in Ihrem Browser und werden nicht gespeichert.
      </p>

      <iframe
        src={`/werkzeuge/${params.slug}/raw`}
        title={werkzeug.label}
        className="w-full rounded border border-line bg-white"
        style={{ height: "calc(100vh - 220px)", minHeight: "640px" }}
      />
    </div>
  );
}
