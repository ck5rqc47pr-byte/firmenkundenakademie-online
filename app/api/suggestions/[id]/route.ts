import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateSuggestionStatus, type SuggestionStatus } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? "";
  if (!session || role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { status, adminNote } = body as { status: SuggestionStatus; adminNote?: string };

  await updateSuggestionStatus(params.id, status, adminNote);
  return NextResponse.json({ ok: true });
}
