import clsx from "clsx";

type Props = {
  stufe: "Berater" | "Sparringspartner" | "Stratege";
  inverted?: boolean;
};

const toneByLevel = {
  Berater: "bg-blue-100 text-primary",
  Sparringspartner: "bg-orange-100 text-accent",
  Stratege: "bg-rose-100 text-rose-700",
};

export function StufenBadge({ stufe, inverted = false }: Props) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold",
        inverted ? "border border-white/20 bg-white/10 text-white" : toneByLevel[stufe],
      )}
    >
      {stufe}
    </span>
  );
}
