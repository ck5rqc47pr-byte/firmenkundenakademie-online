"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  kompetenzfelder: { slug: string; name: string }[];
};

const stufen = ["Alle", "Berater", "Sparringspartner", "Stratege"] as const;
const statuses = [
  { value: "alle", label: "Alle Status" },
  { value: "freigegeben", label: "Verfügbar" },
  { value: "draft", label: "In Vorbereitung" },
  { value: "coming-soon", label: "Demnächst" },
] as const;

export function FilterBar({ kompetenzfelder }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeStufe = searchParams.get("stufe") ?? "Alle";
  const activeStatus = searchParams.get("status") ?? "alle";
  const activeField = searchParams.get("kompetenzfeld") ?? "alle";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "alle" || value === "Alle") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const selectCls =
    "border border-line bg-bg font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 px-3 py-2 outline-none focus:border-ink transition w-full";

  return (
    <div className="flex flex-wrap items-end gap-6">
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">Kompetenzfeld</span>
        <select
          value={activeField}
          onChange={(e) => updateParam("kompetenzfeld", e.target.value)}
          className={selectCls}
        >
          <option value="alle">Alle Felder</option>
          {kompetenzfelder.map((field) => (
            <option key={field.slug} value={field.slug}>
              {field.name}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">Stufe</span>
        <div className="flex flex-wrap gap-1">
          {stufen.map((stufe) => {
            const active = activeStufe === stufe;
            return (
              <button
                key={stufe}
                type="button"
                onClick={() => updateParam("stufe", stufe)}
                className={`font-mono text-[11px] uppercase tracking-[0.08em] px-3 py-2 border transition ${
                  active
                    ? "bg-ink text-bg border-ink"
                    : "border-line text-ink-2 hover:border-ink-2 hover:text-ink"
                }`}
              >
                {stufe}
              </button>
            );
          })}
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
