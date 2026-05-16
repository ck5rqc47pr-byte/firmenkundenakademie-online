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
  getModuleById,
  getParticipantHandoutPdfUrl,
} from "@/lib/modules";

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
            pdfUrl={pdfUrl}
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

          </div>
        </div>
        <nav className="border-t border-ink py-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-1">
            {adjacent.previous ? (
              <Link
                href={`/module/${adjacent.previous.id}`}
                className="group flex flex-col gap-0.5 hover:text-ink transition"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                  ← {adjacent.previous.id}
                </span>
                <span className="font-serif text-base text-ink-2 group-hover:text-ink transition leading-snug">
                  {adjacent.previous.title}
                </span>
              </Link>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">← Voriges</span>
            )}
          </div>
          <Link
            href="/module"
            className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 hover:text-ink transition md:self-center"
          >
            Alle Module
          </Link>
          <div className="flex flex-col gap-0.5 md:text-right">
            {adjacent.next ? (
              <Link
                href={`/module/${adjacent.next.id}`}
                className="group flex flex-col gap-0.5 hover:text-ink transition md:items-end"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                  {adjacent.next.id} →
                </span>
                <span className="font-serif text-base text-ink-2 group-hover:text-ink transition leading-snug">
                  {adjacent.next.title}
                </span>
              </Link>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 md:self-end">Nächstes →</span>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
