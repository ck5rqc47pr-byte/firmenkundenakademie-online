import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { MetaBox } from "@/components/MetaBox";
import { ModuleHeader } from "@/components/ModuleHeader";
import { VideoEmbed } from "@/components/VideoEmbed";
import {
  getAdjacentModules,
  getAllModules,
  getModuleById,
  getParticipantHandoutPdfUrl,
} from "@/lib/modules";

export function generateStaticParams() {
  return getAllModules().map((m) => ({ id: m.id }));
}

export const dynamic = "force-dynamic";

export default async function ModuleDetailPage({ params }: { params: { id: string } }) {
  const module = getModuleById(params.id);
  if (!module) notFound();

  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? "teilnehmer";
  const isTrainerOrAdmin = role === "trainer" || role === "admin";

  const adjacent = getAdjacentModules(module.id);
  const pdfUrl = getParticipantHandoutPdfUrl(module.id);

  return (
    <div>
      <ModuleHeader module={module} />
      <div className="mx-auto max-w-content px-6 lg:px-14">
        <div className="grid gap-16 py-12 lg:grid-cols-[260px_1fr] lg:py-20 min-w-0">
          <MetaBox
            module={module}
            className="order-2 min-w-0 lg:order-1 lg:sticky lg:top-28 lg:self-start"
          />
          <div className="order-1 min-w-0 space-y-12 lg:order-2">
            <VideoEmbed youtubeId={module.youtube_id} title={module.title} />

            {/* Wissenschaftliche Einordnung – sichtbar für alle */}
            {module.content_theorie && (
              <div className="min-w-0 overflow-hidden">
                <MarkdownRenderer content={module.content_theorie} />
              </div>
            )}

            {/* Hauptinhalt (Sec 4 + 5 + 7) */}
            <div className="min-w-0 overflow-hidden">
              <MarkdownRenderer content={module.content} />
            </div>

            {/* Trainerbereich – nur für Trainer und Admin */}
            {isTrainerOrAdmin && module.content_trainer && (
              <div className="min-w-0 overflow-hidden border-t-2 border-accent pt-10">
                <div className="mb-6 inline-flex items-center gap-2 bg-accent/10 px-3 py-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent font-semibold">
                    Trainerbereich · Nur für {role === "admin" ? "Admin" : "Trainer"} sichtbar
                  </span>
                </div>
                <MarkdownRenderer content={module.content_trainer} />
              </div>
            )}

            {pdfUrl && (
              <div className="border-t border-ink pt-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 mb-4">
                  Downloads
                </div>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-primary border border-primary px-4 py-2 hover:bg-primary hover:text-primary-ink transition"
                >
                  Teilnehmerunterlagen (PDF) →
                </a>
              </div>
            )}
          </div>
        </div>
        <nav className="border-t border-ink py-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-8">
            {adjacent.previous ? (
              <Link
                href={`/module/${adjacent.previous.id}`}
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 hover:text-ink transition"
              >
                ← {adjacent.previous.id}
              </Link>
            ) : (
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                ← Voriges
              </span>
            )}
            {adjacent.next ? (
              <Link
                href={`/module/${adjacent.next.id}`}
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 hover:text-ink transition"
              >
                {adjacent.next.id} →
              </Link>
            ) : (
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                Nächstes →
              </span>
            )}
          </div>
          <Link
            href="/module"
            className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 hover:text-ink transition"
          >
            Alle Module
          </Link>
        </nav>
      </div>
    </div>
  );
}
