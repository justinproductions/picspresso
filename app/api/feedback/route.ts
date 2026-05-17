import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getTurso } from "@/lib/turso";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

const schema = z.object({
  message: z
    .string()
    .trim()
    .min(3)
    .max(1000)
    .transform((s) => s.replace(CONTROL_CHARS, "")),
  email: z.string().trim().email().max(254).optional().or(z.literal("")),
  honeypot: z.string().optional(),
  turnstileToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 8192) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  const ip = getClientIp(req.headers);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests, please try again shortly" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetIn / 1000)) } },
    );
  }

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

  const { message, email, honeypot, turnstileToken } = parsed.data;

  if (honeypot) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const isHuman = await verifyTurnstile(turnstileToken ?? "", ip);
  if (!isHuman) {
    return NextResponse.json({ error: "Verification failed" }, { status: 403 });
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
