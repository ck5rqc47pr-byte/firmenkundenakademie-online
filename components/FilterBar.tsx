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

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-card">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1.4fr_1fr]">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Kompetenzfeld
          <select
            value={activeField}
            onChange={(event) => updateParam("kompetenzfeld", event.target.value)}
            className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary"
          >
            <option key="alle" value="alle">Alle Kompetenzfelder</option>
            {kompetenzfelder.map((field) => (
              <option key={field.slug} value={field.slug}>
                {field.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Stufe</span>
          <div className="flex flex-wrap gap-2">
            {stufen.map((stufe) => {
              const active = activeStufe === stufe;
              return (
                <button
                  key={stufe}
                  type="button"
                  onClick={() => updateParam("stufe", stufe)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active ? "bg-primary text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {stufe}
                </button>
              );
            })}
          </div>
        </div>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Status
          <select
            value={activeStatus}
            onChange={(event) => updateParam("status", event.target.value)}
            className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
