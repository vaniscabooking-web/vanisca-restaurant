/**
 * Lightweight in-memory rate limiter (per-IP, fixed window).
 *
 * Note: in-memory state is per-serverless-instance. It meaningfully slows
 * abusive bursts on a single instance but is not a distributed limiter.
 * For strict, global limits across instances, back this with Upstash Redis
 * or Vercel KV — the interface below stays the same.
 */

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const MAX = Number(process.env.RATE_LIMIT_MAX ?? 5);

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

export function rateLimit(key: string): {
  ok: boolean;
  remaining: number;
  retryAfter: number;
} {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX - 1, retryAfter: 0 };
  }

  if (entry.count >= MAX) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { ok: true, remaining: MAX - entry.count, retryAfter: 0 };
}

/** Periodically clear expired entries to bound memory. */
function sweep() {
  const now = Date.now();
  for (const [k, v] of store) if (v.resetAt <= now) store.delete(k);
}
if (typeof setInterval !== "undefined") {
  const timer = setInterval(sweep, WINDOW_MS);
  // Don't keep the process alive solely for the sweeper.
  if (typeof timer === "object" && "unref" in timer) timer.unref();
}

/** Best-effort client IP from common proxy headers. */
export function clientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return (
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip") ??
    "unknown"
  );
}
