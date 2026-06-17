"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Track = {
  id: string;
  label: string;
  stufen: string[];
  felder: { slug: string; label: string }[];
};

type Props = {
  tracks: Track[];
};

const statuses = [
  { value: "alle", label: "Alle Status" },
  { value: "freigegeben", label: "Verfügbar" },
  { value: "draft", label: "In Vorbereitung" },
  { value: "coming-soon", label: "Demnächst" },
] as const;

export function FilterBar({ tracks }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTrack = searchParams.get("track") ?? "alle";
  const activeStufe = searchParams.get("stufe") ?? "Alle";
  const activeStatus = searchParams.get("status") ?? "alle";
  const activeField = searchParams.get("kompetenzfeld") ?? "alle";

  const showTrackFilter = tracks.length > 1;
  const selectedTrack = tracks.find((t) => t.id === activeTrack) ?? null;

  // Felder/Stufen abhängig vom gewählten Track
  const felder = selectedTrack ? selectedTrack.felder : null; // null = nach Track gruppieren
  const stufen = selectedTrack
    ? selectedTrack.stufen
    : tracks.flatMap((t) => t.stufen);

  function updateParam(key: string, value: string, opts?: { resetField?: boolean }) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "alle" || value === "Alle") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Track-Wechsel: Feld-/Stufenfilter zurücksetzen, damit keine fremden Slugs hängen bleiben
    if (opts?.resetField) {
      params.delete("kompetenzfeld");
      params.delete("stufe");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const selectCls =
    "border border-line bg-bg font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 px-3 py-2 outline-none focus:border-ink transition w-full";
  const chipCls = (active: boolean) =>
    `font-mono text-[11px] uppercase tracking-[0.08em] px-3 py-2 border transition ${
      active ? "bg-ink text-bg border-ink" : "border-line text-ink-2 hover:border-ink-2 hover:text-ink"
    }`;

  return (
    <div className="flex flex-wrap items-end gap-6">
      {showTrackFilter && (
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">Track</span>
          <div className="flex flex-wrap gap-1">
            <button type="button" onClick={() => updateParam("track", "alle", { resetField: true })} className={chipCls(activeTrack === "alle")}>
              Alle
            </button>
            {tracks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => updateParam("track", t.id, { resetField: true })}
                className={chipCls(activeTrack === t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">Kompetenzfeld</span>
        <select
          value={activeField}
          onChange={(e) => updateParam("kompetenzfeld", e.target.value)}
          className={selectCls}
        >
          <option value="alle">Alle Felder</option>
          {felder
            ? felder.map((field) => (
                <option key={field.slug} value={field.slug}>
                  {field.label}
                </option>
              ))
            : tracks.map((t) => (
                <optgroup key={t.id} label={t.label}>
                  {t.felder.map((field) => (
                    <option key={field.slug} value={field.slug}>
                      {field.label}
                    </option>
                  ))}
                </optgroup>
              ))}
        </select>
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">Stufe</span>
        <div className="flex flex-wrap gap-1">
          <button type="button" onClick={() => updateParam("stufe", "Alle")} className={chipCls(activeStufe === "Alle")}>
            Alle
          </button>
          {stufen.map((stufe) => (
            <button key={stufe} type="button" onClick={() => updateParam("stufe", stufe)} className={chipCls(activeStufe === stufe)}>
              {stufe}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">Status</span>
        <select
          value={activeStatus}
          onChange={(e) => updateParam("status", e.target.value)}
          className={selectCls}
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
