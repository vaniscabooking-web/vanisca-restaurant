/**
 * Forward a validated payload to an n8n webhook.
 * The shared secret lets the n8n workflow verify the request origin.
 */
export async function forwardToN8n(
  webhookUrl: string | undefined,
  payload: unknown,
): Promise<{ ok: boolean; status: number }> {
  if (!webhookUrl) {
    console.error("[n8n] Webhook URL is not configured.");
    return { ok: false, status: 503 };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET ?? "",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`[n8n] Webhook responded ${res.status}`);
      return { ok: false, status: 502 };
    }
    return { ok: true, status: 200 };
  } catch (err) {
    console.error("[n8n] Forwarding failed:", err);
    return { ok: false, status: 502 };
  }
}
