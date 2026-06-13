import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getSessionRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Welche Rolle darf welchen geschützten Download-Typ abrufen.
const ACCESS: Record<string, string[]> = {
  trainerhandbuch:      ["trainer", "admin"],
  praesentation:        ["trainer", "admin"],
  beobachtungsbogen:    ["teamleiter", "trainer", "admin"],
  "teamleiter-leitfaden": ["teamleiter", "trainer", "admin"],
  // Workbooks: jede angemeldete Rolle; M01 liegt als öffentliches
  // Schaufenster-Exemplar weiterhin unter public/downloads/.
  teilnehmerunterlagen: ["teilnehmer", "teamleiter", "trainer", "admin"],
  // Arbeitsmaterial (z. B. XLSX-Planungsmodell): jede angemeldete Rolle.
  arbeitsmaterial: ["teilnehmer", "teamleiter", "trainer", "admin"],
};

const CONTENT_TYPE: Record<string, string> = {
  pdf:  "application/pdf",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const PROTECTED_DIR = path.join(process.cwd(), "protected-downloads");

export async function GET(
  _req: NextRequest,
  { params }: { params: { type: string; file: string } },
) {
  const { type, file } = params;

  const allowedRoles = ACCESS[type];
  if (!allowedRoles) {
    return NextResponse.json({ error: "Unbekannter Download-Typ" }, { status: 404 });
  }

  // Dateiname streng validieren (verhindert Path-Traversal): nur MXX.pdf/.pptx/.xlsx
  const match = /^(M\d{2})\.(pdf|pptx|xlsx)$/.exec(file);
  if (!match) {
    return NextResponse.json({ error: "Ungültiger Dateiname" }, { status: 400 });
  }
  const ext = match[2];

  const role = await getSessionRole();
  if (!role) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }
  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
  }

  const absolutePath = path.join(PROTECTED_DIR, type, file);
  // Doppelt absichern: aufgelöster Pfad muss im erlaubten Verzeichnis bleiben.
  if (!absolutePath.startsWith(path.join(PROTECTED_DIR, type) + path.sep)) {
    return NextResponse.json({ error: "Ungültiger Pfad" }, { status: 400 });
  }
  if (!fs.existsSync(absolutePath)) {
    return NextResponse.json({ error: "Datei nicht gefunden" }, { status: 404 });
  }

  const data = await fs.promises.readFile(absolutePath);
  const disposition = ext === "pptx" ? "attachment" : "inline";

  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      "Content-Type": CONTENT_TYPE[ext],
      "Content-Disposition": `${disposition}; filename="${file}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
