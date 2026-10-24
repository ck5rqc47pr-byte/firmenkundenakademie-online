import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Interaktive FKB-Campus-Werkzeuge (eigenständige HTML-Tools, Daten nur im Browser).
// Rollengeschützt wie Teilnehmerunterlagen: jede angemeldete Rolle. Ablage:
// protected-downloads/werkzeug/<slug>.html. Verlinkt von den zugehörigen Modulseiten.
const ALLOWED_ROLES = ["teilnehmer", "teamleiter", "trainer", "admin"];
const WERKZEUG_DIR = path.join(process.cwd(), "protected-downloads", "werkzeug");

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  // Slug streng validieren (Buchstaben/Ziffern/Bindestrich) – traversal-sicher.
  if (!/^[a-z][a-z0-9-]{1,80}$/.test(params.slug)) {
    return NextResponse.json({ error: "Ungültiges Werkzeug" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? "";
  if (!role) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }
  if (!ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
  }

  const absolutePath = path.join(WERKZEUG_DIR, `${params.slug}.html`);
  if (!absolutePath.startsWith(WERKZEUG_DIR + path.sep) || !fs.existsSync(absolutePath)) {
    return NextResponse.json({ error: "Werkzeug nicht gefunden" }, { status: 404 });
  }

  const html = await fs.promises.readFile(absolutePath, "utf-8");
  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}
