import type { ReactNode } from "react";
import { renderMarkdown } from "@/lib/markdown";

type Props = { content: string };

function getFirstText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(getFirstText).join("");
  if (node && typeof node === "object" && "props" in (node as object)) {
    return getFirstText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

const ACCENT_TRIGGERS = ["Tipp", "Wichtig", "Hinweis", "Merksatz"];

const components = {
  h2: (props: { children: ReactNode }) => (
    <div className="chapter-break">
      <div className="chapter-eyebrow">Abschnitt</div>
      <h2
        className="font-serif text-2xl font-normal leading-tight tracking-[-0.02em] text-ink mt-2"
        {...props}
      />
    </div>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 className="font-serif text-xl font-[500] leading-tight tracking-[-0.01em] text-ink mt-8 mb-3">
      {children}
    </h3>
  ),
  h4: ({ children }: { children: ReactNode }) => (
    <h4 className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 mt-6 mb-2">
      {children}
    </h4>
  ),
  blockquote: ({ children }: { children: ReactNode }) => {
    const text = getFirstText(children);
    const isAccent = ACCENT_TRIGGERS.some((t) => text.startsWith(t));
    return isAccent ? (
      <blockquote className="blockquote-accent">{children}</blockquote>
    ) : (
      <blockquote>{children}</blockquote>
    );
  },
  sup: (props: { children: ReactNode; title?: string }) => (
    <sup
      className="font-mono text-[0.65em] text-primary cursor-help font-[500] px-px"
      title={props.title}
    >
      {props.children}
    </sup>
  ),
};

export async function MarkdownRenderer({ content }: Props) {
  const rendered = await renderMarkdown(content, components);
  return <div className="prose-academy">{rendered}</div>;
}
