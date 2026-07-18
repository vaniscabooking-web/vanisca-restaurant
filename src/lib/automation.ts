/**
 * Forward a validated payload to the automation platform (Activepieces).
 * The shared secret lets the workflow verify the request origin.
 *
 * Failure contract: missing URL → 503, 12s timeout, non-OK → 502 — the API
 * routes translate any failure into the form's graceful fallback, so a
 * workflow outage never 500s the site.
 */
export async function forwardToAutomation(
  webhookUrl: string | undefined,
  payload: unknown,
): Promise<{ ok: boolean; status: number }> {
  if (!webhookUrl) {
    console.error("[automation] Webhook URL is not configured.");
    return { ok: false, status: 503 };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": process.env.ACTIVEPIECES_WEBHOOK_SECRET ?? "",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`[automation] Webhook responded ${res.status}`);
      return { ok: false, status: 502 };
    }
    return { ok: true, status: 200 };
  } catch (err) {
    console.error("[automation] Forwarding failed:", err);
    return { ok: false, status: 502 };
  }
}
