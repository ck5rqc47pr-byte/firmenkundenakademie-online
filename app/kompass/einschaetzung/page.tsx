import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAssessmentForUser } from "@/lib/db";
import { AssessmentForm } from "./AssessmentForm";
import { getAssessmentFields } from "./fields";

export const dynamic = "force-dynamic";

export default async function EinschaetzungPage({
  searchParams,
}: {
  searchParams?: { track?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/kompass/einschaetzung");

  const track = searchParams?.track === "assistenz" ? "assistenz" : "berater";
  const fields = getAssessmentFields(track);

  const userId = (session.user as { id?: string }).id!;
  const existing = await getAssessmentForUser(userId);

  const initial: Record<string, number> = {};
  for (const e of existing) {
    initial[e.field_slug] = e.self_score;
  }

  // „Aktualisieren" nur, wenn für diesen Track bereits Werte vorliegen
  const isUpdate = fields.some((f) => initial[f.slug] !== undefined);

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-[900px] mx-auto px-6 lg:px-14 py-20">

        {/* Header */}
        <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3 mb-7 flex items-center gap-3">
          <span className="w-6 h-px bg-ink-3 inline-block" />
          FKB Campus · Kompass · Selbsteinschätzung{track === "assistenz" ? " · Vertriebsassistenz" : ""}
        </div>

        <h1 className="font-serif text-[clamp(36px,6vw,64px)] font-normal leading-[1.05] tracking-[-0.03em] mb-6 max-w-2xl">
          {isUpdate ? (
            <>Einschätzung <em className="italic text-ink-2">aktualisieren</em>.</>
          ) : (
            <>Wo stehst du <em className="italic text-ink-2">heute?</em></>
          )}
        </h1>

        <p className="font-serif text-lg text-ink-2 leading-relaxed max-w-xl mb-4">
          Schätze dich in jedem der {fields.length} Kompetenzfelder ehrlich ein. Es gibt
          keine richtige oder falsche Antwort — nur deinen aktuellen Standpunkt.
          Dauer: rund fünf Minuten.
        </p>

        <div className="flex items-center gap-3 mb-14 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          {fields.length} Kompetenzfelder · Je 3 Stufen · Ergebnis sofort sichtbar im Kompass
        </div>

        <AssessmentForm initial={initial} fields={fields} track={track} />
      </div>
    </div>
  );
}
