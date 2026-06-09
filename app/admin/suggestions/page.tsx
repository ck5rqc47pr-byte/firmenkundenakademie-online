import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllSuggestions, ensureSuggestionsTable, type Suggestion, type SuggestionStatus } from "@/lib/db";
import { SuggestionStatusForm } from "./SuggestionStatusForm";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  fehler:    "Fachlicher Fehler",
  inhalt:    "Inhaltliche Ergänzung",
  beispiel:  "Praxisbeispiel",
  sonstiges: "Sonstiges",
};

const STATUS_COLORS: Record<SuggestionStatus, string> = {
  offen:          "bg-amber-100 text-amber-800",
  in_bearbeitung: "bg-blue-100 text-blue-800",
  umgesetzt:      "bg-emerald-100 text-emerald-800",
  abgelehnt:      "bg-ink/10 text-ink-3",
};

const STATUS_LABELS: Record<SuggestionStatus, string> = {
  offen:          "Offen",
  in_bearbeitung: "In Bearbeitung",
  umgesetzt:      "Umgesetzt",
  abgelehnt:      "Abgelehnt",
};

function groupByStatus(suggestions: Suggestion[]) {
  const order: SuggestionStatus[] = ["offen", "in_bearbeitung", "umgesetzt", "abgelehnt"];
  return order
    .map((s) => ({ status: s, items: suggestions.filter((sg) => sg.status === s) }))
    .filter((g) => g.items.length > 0);
}

export default async function SuggestionsAdminPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? "";
  if (!session || role !== "admin") redirect("/login?callbackUrl=/admin/suggestions");

  await ensureSuggestionsTable();
  const suggestions = await getAllSuggestions();
  const groups = groupByStatus(suggestions);
  const openCount = suggestions.filter((s) => s.status === "offen").length;

  return (
    <div className="min-h-screen bg-bg-2">
      {/* Header */}
      <div className="bg-primary border-b border-ink">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 mb-1">
              Admin-Konsole
            </div>
            <h1 className="font-serif text-2xl font-normal text-white tracking-[-0.02em]">
              Verbesserungsvorschläge
            </h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin" className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors">
              ← Modulübersicht
            </Link>
            <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors">
              Akademie →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["offen", "in_bearbeitung", "umgesetzt", "abgelehnt"] as SuggestionStatus[]).map((s) => {
            const count = suggestions.filter((sg) => sg.status === s).length;
            return (
              <div key={s} className="bg-white border border-line p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3 mb-1 leading-snug">
                  {STATUS_LABELS[s]}
                </div>
                <div className="font-serif text-2xl text-ink">{count}</div>
              </div>
            );
          })}
        </div>

        {openCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 px-5 py-3 flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-amber-800 font-semibold">
              {openCount} offene{openCount === 1 ? "r" : ""} Hinweis{openCount !== 1 ? "e" : ""} · Bitte innerhalb von 5 Werktagen prüfen
            </span>
          </div>
        )}

        {suggestions.length === 0 ? (
          <p className="font-serif text-ink-3 text-center py-16">Noch keine Verbesserungsvorschläge eingegangen.</p>
        ) : (
          <div className="space-y-10">
            {groups.map(({ status, items }) => (
              <div key={status}>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2 mb-4 pb-2 border-b border-line">
                  {STATUS_LABELS[status as SuggestionStatus]} · {items.length}
                </h2>
                <div className="space-y-4">
                  {items.map((sg) => (
                    <div key={sg.id} className="bg-white border border-line p-4 sm:p-5 space-y-4">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.06em] bg-ink/8 text-ink-2 px-2 py-0.5">
                          {sg.module_id}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">
                          {TYPE_LABELS[sg.type] ?? sg.type}
                        </span>
                        <span className={`font-mono text-[9px] uppercase tracking-[0.06em] px-2 py-0.5 ${STATUS_COLORS[sg.status as SuggestionStatus]}`}>
                          {STATUS_LABELS[sg.status as SuggestionStatus]}
                        </span>
                        <span className="font-mono text-[10px] text-ink-3 sm:ml-auto w-full sm:w-auto">
                          {new Date(sg.created_at).toLocaleDateString("de-DE")} · {sg.user_name ?? sg.user_id}
                        </span>
                      </div>
                      <p className="font-serif text-sm text-ink leading-relaxed">{sg.message}</p>
                      {sg.admin_note && (
                        <p className="font-mono text-[10px] text-ink-3 border-l-2 border-accent pl-3">
                          {sg.admin_note}
                        </p>
                      )}
                      <SuggestionStatusForm
                        id={sg.id}
                        currentStatus={sg.status as SuggestionStatus}
                        currentNote={sg.admin_note ?? ""}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
