import { NextResponse } from "next/server";
import { contactSchema, sanitize } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { forwardToAutomation } from "@/lib/automation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`contact:${ip}`);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  if (data.company && data.company.length > 0) {
    return NextResponse.json({ ok: true }); // honeypot
  }

  const clean = {
    type: "contact" as const,
    name: sanitize(data.name),
    email: sanitize(data.email),
    subject: sanitize(data.subject),
    message: sanitize(data.message),
    meta: {
      submittedAt: new Date().toISOString(),
      ip,
      userAgent: request.headers.get("user-agent") ?? "",
      source: "website",
    },
  };

  const result = await forwardToAutomation(
    process.env.ACTIVEPIECES_CONTACT_WEBHOOK_URL,
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

export async function GET() {
  return NextResponse.json({ ok: false, error: "method_not_allowed" }, { status: 405 });
}
