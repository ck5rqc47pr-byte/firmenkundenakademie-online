import type { ReactNode } from "react";
import { renderMarkdown } from "@/lib/markdown";

type Props = {
  content: string;
};

const components = {
  h2: (props: { children: ReactNode }) => (
    <div className="handout-chapter">
      <span className="handout-kicker">Kapitel</span>
      <h2 className="mt-3 scroll-mt-24 text-3xl font-semibold" {...props} />
    </div>
  ),
  h3: (props: { children: ReactNode }) => <h3 className="mt-8 text-2xl font-semibold" {...props} />,
  sup: (props: { children: ReactNode; title?: string }) => (
    <sup
      className="cursor-help rounded bg-slate-100 px-1 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-primary"
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
