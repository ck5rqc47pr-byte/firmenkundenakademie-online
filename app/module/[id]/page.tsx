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
  getTrainerHandbuchPdfUrl,
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
  const trainerPdfUrl = getTrainerHandbuchPdfUrl(module.id);

  // Content in Abschnitte aufteilen (sync_akademie.py trennt mit \n\n---\n\n)
  const [sec4Content = "", sec5Content = "", sec7Content = ""] =
    module.content.split("\n\n---\n\n");

  return (
    <div>
      <ModuleHeader module={module} />
      <div className="mx-auto max-w-content px-6 lg:px-14">
        <div className="grid gap-16 py-12 lg:grid-cols-[260px_1fr] lg:py-20 min-w-0">
          <MetaBox
            module={module}
            pdfUrl={pdfUrl}
            trainerPdfUrl={trainerPdfUrl}
            hasTheorie={!!module.content_theorie}
            isTrainerOrAdmin={isTrainerOrAdmin}
            className="order-2 min-w-0 lg:order-1 lg:sticky lg:top-28 lg:self-start"
          />
          <div className="order-1 min-w-0 space-y-12 lg:order-2">
            {/* Mobile Chapter-Nav – nur auf kleinen Screens, Desktop hat MetaBox-Sidebar */}
            <nav className="lg:hidden flex flex-wrap gap-3 pt-2">
              {module.content_theorie && (
                <a href="#einordnung" className="font-mono text-[10px] uppercase tracking-[0.06em] border border-line text-ink-2 px-3 py-2 hover:border-primary hover:text-primary transition">
                  Einordnung
                </a>
              )}
              <a href="#inhalte" className="font-mono text-[10px] uppercase tracking-[0.06em] border border-line text-ink-2 px-3 py-2 hover:border-primary hover:text-primary transition">
                Inhalte
              </a>
              <a href="#transfer" className="font-mono text-[10px] uppercase tracking-[0.06em] border border-line text-ink-2 px-3 py-2 hover:border-primary hover:text-primary transition">
                Praxistransfer
              </a>
              <a href="#quellen" className="font-mono text-[10px] uppercase tracking-[0.06em] border border-line text-ink-2 px-3 py-2 hover:border-primary hover:text-primary transition">
                Quellen
              </a>
              {isTrainerOrAdmin && (
                <a href="#trainerbereich" className="font-mono text-[10px] uppercase tracking-[0.06em] border border-accent text-accent px-3 py-2 hover:bg-accent hover:text-primary-ink transition">
                  Trainerbereich
                </a>
              )}
            </nav>
            <VideoEmbed youtubeId={module.youtube_id} title={module.title} />

            {/* Wissenschaftliche Einordnung */}
            {module.content_theorie && (
              <div id="einordnung" className="min-w-0 overflow-hidden scroll-mt-28">
                <MarkdownRenderer content={module.content_theorie} />
              </div>
            )}

            {/* Sec 4: Modulinhalte */}
            <div id="inhalte" className="min-w-0 overflow-hidden scroll-mt-28">
              <MarkdownRenderer content={sec4Content} />
            </div>

            {/* Sec 5: Praxistransfer */}
            {sec5Content && (
              <div id="transfer" className="min-w-0 overflow-hidden scroll-mt-28">
                <MarkdownRenderer content={sec5Content} />
              </div>
            )}

            {/* Sec 7: Quellen */}
            {sec7Content && (
              <div id="quellen" className="min-w-0 overflow-hidden scroll-mt-28">
                <MarkdownRenderer content={sec7Content} />
              </div>
            )}

            {/* Trainerbereich – nur für Trainer und Admin */}
            {isTrainerOrAdmin && module.content_trainer && (
              <div id="trainerbereich" className="min-w-0 overflow-hidden border-t-2 border-accent pt-10 scroll-mt-28">
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
