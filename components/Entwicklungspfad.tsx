const SERIF = "'Source Serif 4', Georgia, serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const STUFEN = [
  {
    x: 150, y: 230,
    name: "Berater",
    dreyfus: "DREYFUS-STUFE 2",
    sub: "Handwerk & Grundlagen",
    nameColor: "var(--ink)",
    dot: { fill: "var(--bg)", stroke: "var(--ink-2)" },
  },
  {
    x: 460, y: 162,
    name: "Sparringspartner",
    dreyfus: "DREYFUS-STUFE 3",
    sub: "erkennt Strukturen, priorisiert",
    nameColor: "var(--accent-ink)",
    dot: { fill: "var(--accent)", stroke: "var(--accent-ink)" },
  },
  {
    x: 770, y: 95,
    name: "Strategischer Partner",
    dreyfus: "DREYFUS-STUFE 4",
    sub: "begleitet Entscheidungen",
    nameColor: "var(--primary)",
    dot: { fill: "var(--primary)", stroke: "var(--primary)" },
  },
];

export function Entwicklungspfad({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 920 330"
      className={className}
      role="img"
      aria-label="Entwicklungspfad: vom Berater (Dreyfus-Stufe 2) über den Sparringspartner (Stufe 3) zum Strategischen Partner (Stufe 4)."
    >
      <defs>
        <marker id="ep-ah" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--ink-3)" />
        </marker>
      </defs>

      {/* Aufsteigende Pfad-Linie */}
      <line x1="80" y1="245" x2="838" y2="80" stroke="var(--ink-3)" strokeWidth="1.5" markerEnd="url(#ep-ah)" />
      <text x="838" y="60" textAnchor="end" style={{ fontFamily: MONO }} fontSize="10" letterSpacing="1.5" fill="var(--ink-3)">
        STEIGENDE KOMPETENZ
      </text>

      {STUFEN.map((s) => (
        <g key={s.name}>
          {/* Verbinder Punkt → Label */}
          <line x1={s.x} y1={s.y + 11} x2={s.x} y2={258} stroke="var(--line-2)" strokeWidth="1" strokeDasharray="2 3" />
          {/* Knotenpunkt */}
          <circle cx={s.x} cy={s.y} r="9" fill={s.dot.fill} stroke={s.dot.stroke} strokeWidth="2" />
          {/* Labels */}
          <text x={s.x} y={282} textAnchor="middle" style={{ fontFamily: SERIF }} fontSize="19" fill={s.nameColor}>
            {s.name}
          </text>
          <text x={s.x} y={300} textAnchor="middle" style={{ fontFamily: MONO }} fontSize="9" letterSpacing="1" fill="var(--ink-3)">
            {s.dreyfus}
          </text>
          <text x={s.x} y={316} textAnchor="middle" style={{ fontFamily: MONO }} fontSize="10" fill="var(--ink-2)">
            {s.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}
