import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getTurso } from "@/lib/turso";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  message: z.string().trim().min(3).max(1000),
  email: z.string().trim().email().max(254).optional().or(z.literal("")),
  honeypot: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { message, email, honeypot } = parsed.data;

  if (honeypot) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    await getTurso().execute({
      sql: "INSERT INTO feedback (message, email) VALUES (?, ?)",
      args: [message, email && email.length > 0 ? email : null],
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
