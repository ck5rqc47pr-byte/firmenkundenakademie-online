import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getWerkzeugBySlug, getModuleById } from "@/lib/modules";
import { WerkzeugFrame } from "@/components/WerkzeugFrame";

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
    <div className="mx-auto max-w-content px-6 lg:px-14 pt-6 pb-16">
      {/* Schmale Kontext-/Zurück-Zeile – der Titel kommt aus dem Werkzeug selbst */}
      <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3 mb-2">
        <Link href="/werkzeuge" className="hover:text-primary transition">Werkzeuge</Link>
        {modul && (
          <>
            <span aria-hidden>·</span>
            <Link href={`/module/${modul.id}`} className="hover:text-primary transition">
              {modul.id} {modul.title}
            </Link>
          </>
        )}
      </div>
      <WerkzeugFrame slug={params.slug} title={werkzeug.label} />
    </div>
  );
}
