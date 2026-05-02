type Props = {
  stufe: "Berater" | "Sparringspartner" | "Stratege";
  inverted?: boolean;
};

export function StufenBadge({ stufe, inverted = false }: Props) {
  return (
    <span
      className={`inline-flex items-center font-mono text-[10px] uppercase tracking-[0.06em] px-2.5 py-1 border ${
        inverted
          ? "border-primary-ink text-primary-ink"
          : "border-line text-ink-2"
      }`}
    >
      {stufe}
    </span>
  );
}
