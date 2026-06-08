"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SuggestionStatus } from "@/lib/db";

const STATUS_OPTIONS: { value: SuggestionStatus; label: string }[] = [
  { value: "offen",          label: "Offen" },
  { value: "in_bearbeitung", label: "In Bearbeitung" },
  { value: "umgesetzt",      label: "Umgesetzt" },
  { value: "abgelehnt",      label: "Abgelehnt" },
];

export function SuggestionStatusForm({
  id,
  currentStatus,
  currentNote,
}: {
  id: string;
  currentStatus: SuggestionStatus;
  currentNote: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote]     = useState(currentNote);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function save() {
    setSaving(true);
    await fetch(`/api/suggestions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNote: note }),
    });
    setSaving(false);
    router.refresh();
  }

  const changed = status !== currentStatus || note !== currentNote;

  return (
    <div className="flex flex-wrap items-end gap-3 pt-2 border-t border-line/50">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-3">Status</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as SuggestionStatus)}
          className="border border-line px-2 py-1.5 font-mono text-[11px] text-ink bg-white focus:outline-none focus:border-primary"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-40">
        <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-3">Interne Notiz (optional)</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="z. B. wird in v0.4 umgesetzt"
          className="border border-line px-2 py-1.5 font-mono text-[11px] text-ink bg-white focus:outline-none focus:border-primary"
        />
      </div>
      <button
        onClick={save}
        disabled={saving || !changed}
        className="font-mono text-[10px] uppercase tracking-[0.06em] px-4 py-2 bg-ink text-bg hover:opacity-80 transition disabled:opacity-30"
      >
        {saving ? "…" : "Speichern"}
      </button>
    </div>
  );
}
