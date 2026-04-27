import Link from "next/link";
import { notFound } from "next/navigation";
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

type Props = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return getAllModules().map((module) => ({ id: module.id }));
}

export default function ModuleDetailPage({ params }: Props) {
  const module = getModuleById(params.id);
  if (!module) {
    notFound();
  }

  const adjacent = getAdjacentModules(module.id);
  const participantHandoutPdfUrl = getParticipantHandoutPdfUrl(module.id);

  return (
    <div className="space-y-8">
      <ModuleHeader module={module} />
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.5fr]">
        <MetaBox module={module} />
        <div className="space-y-8">
          <VideoEmbed youtubeId={module.youtube_id} title={module.title} />
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card lg:p-10">
            <MarkdownRenderer content={module.content} />
          </div>
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-2xl font-semibold text-primary">Downloads</h2>
            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              {participantHandoutPdfUrl ? (
                <a
                  href={participantHandoutPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                  Teilnehmerunterlagen (PDF)
                </a>
              ) : (
                <span className="rounded-full bg-slate-100 px-5 py-3 text-center text-sm font-semibold text-slate-500">
                  Teilnehmerunterlagen noch nicht hinterlegt
                </span>
              )}
              <a
                href="/downloads/selbstcheck-bogen.pdf"
                className="rounded-full border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
              >
                Selbstcheck-Bogen (PDF)
              </a>
            </div>
          </section>
        </div>
      </section>
      <nav className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
            {adjacent.previous ? (
              <Link href={`/module/${adjacent.previous.id}`} className="text-sm font-semibold text-primary">
                ← Voriges Modul
              </Link>
            ) : (
              <span className="text-sm text-slate-400">← Voriges Modul</span>
            )}
            {adjacent.next ? (
              <Link href={`/module/${adjacent.next.id}`} className="text-sm font-semibold text-primary">
                Nächstes Modul →
              </Link>
            ) : (
              <span className="text-sm text-slate-400">Nächstes Modul →</span>
            )}
          </div>
          <Link href="/module" className="text-sm font-semibold text-accent">
            Zurück zur Modulübersicht
          </Link>
        </div>
      </nav>
    </div>
  );
}
