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
  return order.map((s) => ({
    status: s,
    items: suggestions.filter((sg) => sg.status === s),
  })).filter((g) => g.items.length > 0);
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
    <div className="mx-auto max-w-content px-6 lg:px-14 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-1">Admin</p>
          <h1 className="font-serif text-3xl text-ink">Verbesserungsvorschläge</h1>
        </div>
        <div className="text-right">
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">Gesamt</span>
          <p className="font-serif text-2xl text-ink">{suggestions.length}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {(["offen", "in_bearbeitung", "umgesetzt", "abgelehnt"] as SuggestionStatus[]).map((s) => {
          const count = suggestions.filter((sg) => sg.status === s).length;
          return (
            <div key={s} className="border border-line p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3 mb-1">
                {STATUS_LABELS[s]}
              </p>
              <p className="font-serif text-2xl text-ink">{count}</p>
            </div>
          );
        })}
      </div>

      {openCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 px-5 py-3 mb-8 flex items-center gap-3">
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
                  <div key={sg.id} className="border border-line p-5 space-y-4">
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.06em] bg-ink/8 text-ink-2 px-2 py-0.5">
                        {sg.module_id}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">
                        {TYPE_LABELS[sg.type] ?? sg.type}
                      </span>
                      <span className={`font-mono text-[9px] uppercase tracking-[0.06em] px-2 py-0.5 ${STATUS_COLORS[sg.status as SuggestionStatus]}`}>
                        {STATUS_LABELS[sg.status as SuggestionStatus]}
                      </span>
                      <span className="font-mono text-[10px] text-ink-3 ml-auto">
                        {new Date(sg.created_at).toLocaleDateString("de-DE")} · {sg.user_name ?? sg.user_id}
                      </span>
                    </div>
                    {/* Nachricht */}
                    <p className="font-serif text-sm text-ink leading-relaxed">{sg.message}</p>
                    {/* Admin-Notiz */}
                    {sg.admin_note && (
                      <p className="font-mono text-[10px] text-ink-3 border-l-2 border-accent pl-3">
                        {sg.admin_note}
                      </p>
                    )}
                    {/* Status ändern */}
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
  );
}
