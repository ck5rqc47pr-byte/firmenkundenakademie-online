type Props = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
};

export function BloomBadge({ level }: Props) {
  return (
    <span
      className="inline-flex h-6 min-w-6 items-center justify-center font-mono text-[10px] font-[500] uppercase tracking-[0.04em] text-primary border border-line px-1.5"
      title={`Bloom-Stufe ${level}`}
    >
      B{level}
    </span>
  );
}
