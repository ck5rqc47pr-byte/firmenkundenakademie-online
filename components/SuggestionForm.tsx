"use client";

import { useState } from "react";

const TYPES = [
  { value: "fehler",    label: "Fachlicher Fehler" },
  { value: "inhalt",    label: "Inhaltliche Ergänzung" },
  { value: "beispiel",  label: "Besseres Praxisbeispiel" },
  { value: "sonstiges", label: "Sonstiges" },
];

export function SuggestionForm({ moduleId }: { moduleId: string }) {
  const [type, setType]       = useState("inhalt");
  const [message, setMessage] = useState("");
  const [status, setStatus]   = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, type, message }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="border border-emerald-200 bg-emerald-50 p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-emerald-700 mb-1">
          Vielen Dank für Ihr Feedback
        </p>
        <p className="font-serif text-sm text-emerald-800">
          Ihr Hinweis wurde erfasst und wird innerhalb von 5 Werktagen geprüft.
          Inhaltliche Anpassungen fließen im nächsten Revisionszyklus ein.
          Kritische Fehler werden sofort korrigiert.
        </p>
        <button
          onClick={() => { setStatus("idle"); setMessage(""); }}
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.06em] text-emerald-700 underline hover:text-emerald-900 transition"
        >
          Weiteres Feedback senden
        </button>
      </div>
    );
  }

  return (
    <div className="border border-line p-6 space-y-5">
      {/* Header mit Versprechen */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2 font-semibold mb-1">
            Inhalte verbessern
          </h3>
          <p className="font-serif text-sm text-ink-3 leading-snug">
            Jeder Hinweis wird geprüft. Kritische Fehler werden sofort korrigiert —
            alle anderen Anpassungen innerhalb von 5 Werktagen bestätigt.
          </p>
        </div>
        <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.06em] text-white bg-accent px-2 py-1">
          Versprochen
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Typ */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">
            Art des Hinweises
          </label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`font-mono text-[10px] uppercase tracking-[0.06em] px-3 py-1.5 border transition ${
                  type === t.value
                    ? "bg-ink text-bg border-ink"
                    : "border-line text-ink-2 hover:border-ink hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nachricht */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">
            Ihr Hinweis
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
            placeholder="Was genau sollte geändert, ergänzt oder korrigiert werden?"
            className="border border-line px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-primary resize-none"
          />
        </div>

        {status === "error" && (
          <p className="font-mono text-[10px] text-red-600 uppercase tracking-[0.06em]">
            Fehler beim Senden — bitte erneut versuchen.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending" || !message.trim()}
          className="font-mono text-[11px] uppercase tracking-[0.08em] px-5 py-2.5 bg-primary text-white hover:opacity-90 transition disabled:opacity-50"
        >
          {status === "sending" ? "Wird gesendet …" : "Hinweis senden →"}
        </button>
      </form>
    </div>
  );
}
