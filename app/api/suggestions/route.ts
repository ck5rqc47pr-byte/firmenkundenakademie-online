import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  createSuggestion,
  getAllSuggestions,
  ensureSuggestionsTable,
  type SuggestionType,
} from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string })?.id ?? "unknown";
  const userName = session.user?.name ?? session.user?.email ?? null;

  const body = await req.json();
  const { moduleId, type, message } = body as {
    moduleId: string;
    type: SuggestionType;
    message: string;
  };

  if (!moduleId || !type || !message?.trim()) {
    return NextResponse.json({ error: "Fehlende Felder" }, { status: 400 });
  }

  await ensureSuggestionsTable();
  await createSuggestion(userId, userName, moduleId, type, message.trim());

  // E-Mail-Benachrichtigung (optional – benötigt RESEND_API_KEY in Vercel env)
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL ?? "hello@fkb-campus.de";
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "FKB Campus <noreply@fkb-campus.de>",
          to: notifyEmail,
          subject: `Neuer Verbesserungsvorschlag · ${moduleId}`,
          text: `Modul: ${moduleId}\nTyp: ${type}\nVon: ${userName ?? userId}\n\n${message}`,
        }),
      });
    } catch {
      // E-Mail-Fehler nicht propagieren
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? "";
  if (!session || role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureSuggestionsTable();
  const suggestions = await getAllSuggestions();
  return NextResponse.json(suggestions);
}
