import { NextResponse } from "next/server";
import {
  reservationSchema,
  sanitize,
  ALLOWED_FILE_TYPES,
  MAX_FILE_BYTES,
  MAX_TOTAL_ATTACH_BYTES,
} from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { forwardToN8n } from "@/lib/n8n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // 1) Rate limit per IP
  const ip = clientIp(request.headers);
  const limit = rateLimit(`reservation:${ip}`);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  // 2) Parse + validate
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // 3) Honeypot: pretend success so bots don't learn they were blocked.
  if (data.company && data.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // 4) Server-side attachment re-validation (never trust the client)
  const attachments = data.attachments ?? [];
  let totalBytes = 0;
  for (const file of attachments) {
    totalBytes += file.size;
    if (
      !ALLOWED_FILE_TYPES.includes(file.type) ||
      file.size > MAX_FILE_BYTES ||
      totalBytes > MAX_TOTAL_ATTACH_BYTES
    ) {
      return NextResponse.json(
        { ok: false, error: "invalid_attachment" },
        { status: 400 },
      );
    }
  }

  // 5) Sanitize free-text fields
  const clean = {
    type: "reservation" as const,
    name: sanitize(data.name),
    phone: sanitize(data.phone),
    whatsapp: data.whatsapp ? sanitize(data.whatsapp) : "",
    email: data.email ? sanitize(data.email) : "",
    date: sanitize(data.date),
    time: sanitize(data.time),
    guests: data.guests,
    occasion: data.occasion ? sanitize(data.occasion) : "",
    message: data.message ? sanitize(data.message) : "",
    menuItems: (data.menuItems ?? []).map(sanitize),
    attachments: attachments.map((f) => ({
      name: sanitize(f.name),
      type: f.type,
      size: f.size,
      data: f.data,
    })),
    meta: {
      submittedAt: new Date().toISOString(),
      ip,
      userAgent: request.headers.get("user-agent") ?? "",
      source: "website",
    },
  };

  // 6) Forward to n8n
  const result = await forwardToN8n(
    process.env.N8N_RESERVATION_WEBHOOK_URL,
    clean,
  );

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "forwarding_failed" },
      { status: result.status },
    );
  }

  return NextResponse.json({ ok: true });
}

// Reject other methods cleanly.
export async function GET() {
  return NextResponse.json({ ok: false, error: "method_not_allowed" }, { status: 405 });
}
