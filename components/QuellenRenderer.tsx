import type { ReactNode } from "react";
import { renderMarkdown } from "@/lib/markdown";

type Props = {
  content: string;
};

/** Stripped-down renderer for bibliography pages — no KAPITEL boxes, no H1. */
const components = {
  // H1 in quellen.md is the page title — skip it; the page header already shows it
  h1: () => null as unknown as React.ReactElement,
  h2: (props: { children: ReactNode }) => (
    <h2
      className="mt-10 border-b border-slate-200 pb-2 text-lg font-semibold uppercase tracking-wide text-primary first:mt-0"
      {...props}
    />
  ),
  h3: (props: { children: ReactNode }) => (
    <h3 className="mt-6 text-base font-semibold text-slate-700" {...props} />
  ),
  p: (props: { children: ReactNode }) => (
    <p className="mt-2 text-sm leading-6 text-slate-600" {...props} />
  ),
};

export async function QuellenRenderer({ content }: Props) {
  const rendered = await renderMarkdown(content, components as any);
  return <div className="space-y-1">{rendered}</div>;
}
