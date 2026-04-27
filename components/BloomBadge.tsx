import clsx from "clsx";

type Props = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
};

const bloomTone = {
  1: "bg-sky-100 text-sky-700",
  2: "bg-blue-100 text-blue-700",
  3: "bg-orange-100 text-accent",
  4: "bg-orange-200 text-orange-800",
  5: "bg-rose-100 text-rose-800",
  6: "bg-red-100 text-red-800",
};

export function BloomBadge({ level }: Props) {
  return (
    <span
      className={clsx(
        "inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-bold",
        bloomTone[level],
      )}
      title={`Bloom-Stufe ${level}`}
    >
      B{level}
    </span>
  );
}
