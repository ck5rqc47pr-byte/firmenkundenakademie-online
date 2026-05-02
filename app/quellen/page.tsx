import fs from "fs";
import path from "path";
import { QuellenRenderer } from "@/components/QuellenRenderer";

export const metadata = {
  title: "Quellenverzeichnis – FKB Campus",
};

function getQuellenContent(): string {
  const filePath = path.join(process.cwd(), "content", "quellen.md");
  return fs.readFileSync(filePath, "utf-8");
}

export default function QuellenPage() {
  const content = getQuellenContent();

  return (
    <div className="mx-auto max-w-content px-6 lg:px-14 py-16 lg:py-24">
      <div className="mb-12 border-b border-ink pb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 mb-4">
          Wissenschaftliche Grundlagen
        </div>
        <h1 className="font-serif text-5xl lg:text-6xl font-normal leading-[0.95] tracking-[-0.03em] text-ink">
          Quellenverzeichnis
        </h1>
        <p className="mt-6 font-serif text-xl leading-relaxed text-ink-2 max-w-2xl">
          Alle in der Firmenkundenakademie zitierten wissenschaftlichen Quellen,
          Fachliteratur und Branchenstudien – zusammengeführt im zentralen Literaturverzeichnis.
        </p>
      </div>
      <QuellenRenderer content={content} />
    </div>
  );
}
