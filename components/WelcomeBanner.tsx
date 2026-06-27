"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "fkb-welcome-dismissed-v1";

/**
 * „Warum dieser Campus?" – kurze, TN-perspektivische Willkommens-/Onboarding-Sicht
 * auf der Campus-Übersicht. Verhält sich wie ein Erst-Login-Hinweis: bleibt sichtbar,
 * bis der/die Teilnehmer:in ihn schließt (Merker in localStorage, keine Server-Daten).
 */
export function WelcomeBanner() {
  // Erst nach dem Mounten entscheiden, um Hydration-Mismatch zu vermeiden.
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(STORAGE_KEY) !== "1");
    } catch {
      setVisible(true);
    }
    setReady(true);
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* localStorage nicht verfügbar – Banner schließt für diese Sitzung */
    }
    setVisible(false);
  }

  if (!ready || !visible) return null;

  return (
    <div className="border-b border-ink bg-bg-2">
      <div className="mx-auto max-w-content px-6 lg:px-14 py-8 relative">
        <button
          onClick={dismiss}
          aria-label="Schließen"
          className="absolute top-5 right-6 lg:right-14 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 hover:text-ink transition"
        >
          Schließen ✕
        </button>

        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary mb-2">
          Willkommen am FKB Campus
        </div>
        <h2 className="font-serif text-2xl lg:text-3xl font-normal tracking-[-0.02em] text-ink mb-3 max-w-2xl">
          Warum dieser Campus – für dich
        </h2>
        <p className="text-sm lg:text-base text-ink-2 leading-relaxed max-w-2xl mb-6">
          Firmenkunden erwarten heute einen Sparringspartner auf Augenhöhe – keinen
          Produktverkäufer. Genau das baust du hier aus: an echten Fällen aus dem
          VR-Umfeld, nicht in der Theorie.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mb-7">
          {[
            { k: "Sofort nutzbar", v: "Jedes Modul bringt etwas, das du im nächsten Kundengespräch anwendest." },
            { k: "In deinem Tempo", v: "Reihenfolge und Geschwindigkeit bestimmst du selbst." },
            { k: "Ohne Prüfungsdruck", v: "Selbstcheck und Quiz sind für dich – nicht fürs Reporting." },
          ].map((c) => (
            <div key={c.k} className="border-l-2 border-accent pl-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink mb-1">
                {c.k}
              </div>
              <div className="text-xs text-ink-2 leading-relaxed">{c.v}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <button
            onClick={dismiss}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] bg-primary text-white px-5 py-3 hover:bg-primary/90 transition"
          >
            Los geht&apos;s →
          </button>
          <Link
            href="/leitbild"
            className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary hover:underline"
          >
            Unser Leitbild →
          </Link>
        </div>
      </div>
    </div>
  );
}
