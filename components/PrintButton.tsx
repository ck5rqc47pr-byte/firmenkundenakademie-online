"use client";

type Props = {
  label?: string;
};

export function PrintButton({ label = "Als PDF speichern / drucken" }: Props) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 print:hidden"
    >
      {label}
    </button>
  );
}
