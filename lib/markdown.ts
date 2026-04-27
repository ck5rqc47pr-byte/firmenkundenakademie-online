import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { ReactElement } from "react";

const SOURCE_SECTION_HEADING = /\n## Quellen[\s\S]*$/;
const SOURCE_ITEM_REGEX = /^\s*-\s+(.+)$/gm;
const SOURCE_REF_REGEX = /\[(Q-\d{3})\]/g;

function extractSourceTitles(markdown: string): Record<string, string> {
  const sourceSection = markdown.match(SOURCE_SECTION_HEADING)?.[0] ?? "";
  const items = Array.from(sourceSection.matchAll(SOURCE_ITEM_REGEX)).map(
    (match) => match[1].trim(),
  );

  return items.reduce<Record<string, string>>((acc, item, index) => {
    const ref = `Q-${String(index + 1).padStart(3, "0")}`;
    acc[ref] = item.replace(/\*/g, "");
    return acc;
  }, {});
}

function injectSourceTooltips(markdown: string): string {
  const sources = extractSourceTitles(markdown);

  return markdown.replace(SOURCE_REF_REGEX, (_, ref: string) => {
    const title = sources[ref];
    if (!title) {
      return `[${ref}]`;
    }

    return `<sup title="${title.replace(/"/g, "&quot;")}">${ref}</sup>`;
  });
}

function escapeMdxTextComparisons(markdown: string): string {
  return markdown.replace(/<(?=\d)/g, "&lt;");
}

export async function renderMarkdown(
  markdown: string,
  components: Record<string, (props: any) => ReactElement>,
): Promise<ReactElement> {
  const processedMarkdown = injectSourceTooltips(escapeMdxTextComparisons(markdown));
  const { content } = await compileMDX({
    source: processedMarkdown,
    components,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  return content;
}
