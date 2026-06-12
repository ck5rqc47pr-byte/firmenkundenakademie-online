import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllModules } from "@/lib/modules";
import { getProgressForUser } from "@/lib/db";
import { createZertifikatPdf, STUFEN_SLUGS } from "@/lib/zertifikat";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { stufe: string } },
) {
  const stufeName = STUFEN_SLUGS[params.stufe];
  if (!stufeName) {
    return NextResponse.json({ error: "Unbekannte Stufe" }, { status: 404 });
  }

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  const userName = session?.user?.name ?? "";
  if (!session || !userId) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  // Anspruch prüfen: alle freigegebenen Module der Stufe abgeschlossen?
  const stufenModule = getAllModules().filter(
    (m) => m.stufe === stufeName && m.status === "freigegeben",
  );
  const progress = await getProgressForUser(userId);
  const completed = new Set(progress.map((p) => p.module_id));
  const missing = stufenModule.filter((m) => !completed.has(m.id));
  if (stufenModule.length === 0 || missing.length > 0) {
    return NextResponse.json(
      { error: "Stufe noch nicht abgeschlossen",
        fehlend: missing.map((m) => m.id) },
      { status: 403 },
    );
  }

  const pdf = await createZertifikatPdf({
    name: userName || "Teilnehmer:in",
    stufe: stufeName,
    moduleCount: stufenModule.length,
    moduleTitles: stufenModule.map((m) => `${m.id} ${m.title}`),
  });

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        `inline; filename="FKB-Campus-Zertifikat-${params.stufe}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
