const SERIF = "'Source Serif 4', Georgia, serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const STEPS = [
  { n: "1", titel: "Hinweis", sub: "aus der Praxis" },
  { n: "2", titel: "Prüfung", sub: "geprüft & eingeordnet" },
  { n: "3", titel: "Inhalt", sub: "in Modul übersetzt" },
  { n: "4", titel: "Campus", sub: "zurück im Campus" },
];

// x-Startkante der vier Boxen (Breite 190, Abstand 48)
const BOX_X = [16, 254, 492, 730];

export function FeedbackKreislauf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 920 300"
      className={className}
      role="img"
      aria-label="Feedback-Kreislauf: Hinweis aus der Praxis, Prüfung, Übersetzung in Inhalt, zurück in den Campus."
    >
      <defs>
        <marker id="fk-ah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--ink-3)" />
        </marker>
        <marker id="fk-ah-accent" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent-ink)" />
        </marker>
      </defs>

      {/* Rückfluss-Schleife */}
      <path
        d="M 825 166 C 825 240, 825 268, 770 268 L 166 268 C 111 268, 111 240, 111 168"
        fill="none"
        stroke="var(--accent-ink)"
        strokeWidth="1.4"
        strokeDasharray="2 4"
        markerEnd="url(#fk-ah-accent)"
      />
      <text x="468" y="262" textAnchor="middle" style={{ fontFamily: MONO }} fontSize="10" letterSpacing="1" fill="var(--ink-3)">
        HINWEISE FLIESSEN GEPRÜFT ZURÜCK — LEBENDIGES PROGRAMM
      </text>

      {/* Vorwärts-Pfeile zwischen den Schritten */}
      {[206, 444, 682].map((x) => (
        <path key={x} d={`M ${x} 118 L ${x + 44} 118`} stroke="var(--ink-3)" strokeWidth="1.4" markerEnd="url(#fk-ah)" />
      ))}

      {/* Boxen */}
      {STEPS.map((s, i) => {
        const x = BOX_X[i];
        return (
          <g key={s.n}>
            <rect x={x} y={70} width={190} height={96} rx={2} fill="var(--bg)" stroke="var(--line-2)" strokeWidth={1} />
            <text x={x + 20} y={104} style={{ fontFamily: SERIF, fontStyle: "italic" }} fontSize="30" fill="var(--primary)">
              {s.n}
            </text>
            <text x={x + 20} y={132} style={{ fontFamily: SERIF }} fontSize="18" fill="var(--ink)">
              {s.titel}
            </text>
            <text x={x + 20} y={152} style={{ fontFamily: MONO }} fontSize="10" fill="var(--ink-3)">
              {s.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
