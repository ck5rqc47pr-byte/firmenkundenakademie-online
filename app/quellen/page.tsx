import fs from "fs";
import path from "path";
import { QuellenRenderer } from "@/components/QuellenRenderer";

export const metadata = {
  title: "Quellenverzeichnis – Firmenkundenakademie",
};

function getQuellenContent(): string {
  const filePath = path.join(process.cwd(), "content", "quellen.md");
  return fs.readFileSync(filePath, "utf-8");
}

export default function QuellenPage() {
  const content = getQuellenContent();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="overflow-hidden rounded-[2.5rem] border border-primary/10 bg-white px-8 py-10 shadow-card lg:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          Wissenschaftliche Grundlagen
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-primary">
          Quellenverzeichnis
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Alle in der Firmenkundenakademie zitierten wissenschaftlichen Quellen, Fachliteratur
          und Branchenstudien – zusammengeführt im zentralen Literaturverzeichnis.
        </p>
      </div>

      {/* Content */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card lg:p-10">
        <QuellenRenderer content={content} />
      </div>
    </div>
  );
}
