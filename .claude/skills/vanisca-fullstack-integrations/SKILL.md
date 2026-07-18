---
name: vanisca-fullstack-integrations
description: >-
  Backend, APIs and integrations for Vanisca Restaurant.
  Use whenever working with Next.js server actions, API routes,
  Google Sheets, Activepieces workflows, Gmail, WhatsApp Business,
  reservations, contact forms, environment variables,
  deployment or security.
---

# Vanisca — Backend, APIs & Integrations

Reflects the code as built (`src/app/api/**`, `src/lib/**`). The pipeline is
**live and E2E-tested in production**. Treat this layer as load-bearing:
enhance carefully, never break a working integration, never weaken validation.

---

## Request pipeline (both forms)

Website form → `POST /api/reservation` (or `/api/contact`) → Activepieces webhook →
Google Sheets (+ Drive / Gmail / WhatsApp) → `{ ok: true }` → success/fallback UI.

Both routes: `runtime = "nodejs"`, `dynamic = "force-dynamic"`. Order of
operations in `route.ts` (do not reorder — each step guards the next):

1. **Rate limit** per IP (`rateLimit(\`reservation:${ip}\`)`) → 429 + `Retry-After` on trip.
2. **Parse JSON** (400 `bad_json` on failure).
3. **Zod validate** (`reservationSchema` / `contactSchema`) → 400 `validation` with `flatten()`.
4. **Honeypot**: if `company` is non-empty, return `{ ok: true }` (fake success so bots learn nothing).
5. **Server-side attachment re-validation** (never trust the client).
6. **Sanitize** every free-text field.
7. **Forward to Activepieces** with the shared secret.

`GET` is rejected 405.

---

## Validation contract (`src/lib/validation.ts`)

**Reservation:** `name` 2–80 · `phone` (regex `^[+]?[\d\s().-]{6,20}$`) ·
`whatsapp?` · `email?` · `date` · `time` · `guests` coerced int 1–50 ·
`occasion?` ≤120 · `message?` ≤1000 · `company` honeypot (must be empty) ·
`menuItems?` ≤30 (Sheets-ready, no UI collects it yet) · `attachments?`.

**Attachments:** `MAX_FILE_BYTES = 5MB` per file, `MAX_TOTAL_ATTACH_BYTES = 3MB`
total, `MAX_ATTACHMENTS = 4`, types = jpeg/png/webp/heic/pdf. The 3MB total is
deliberate: Vercel serverless bodies cap ~4.5MB and base64 inflates ~4/3.
Re-validated server-side in the route regardless of client checks.

**Contact:** `name` 2–80 · `email` required · `subject` 2–150 · `message` 5–2000 · honeypot.

`sanitize()` strips ASCII control chars (`<32`, `127`) via a loop (never embed
control chars in source) and trims. Add new fields to the schema **and** the
sanitized `clean` object.

---

## Automation forwarding (`src/lib/automation.ts`)

`forwardToAutomation(webhookUrl, payload)`:
- Missing URL → `503` (logged).
- `POST` JSON with header `X-Webhook-Secret: process.env.ACTIVEPIECES_WEBHOOK_SECRET`.
- 12s `AbortController` timeout, `cache: "no-store"`.
- Non-2xx or throw → `502`. The UI shows a graceful fallback on any non-ok.

The shared secret lets the workflow verify origin — keep sending it.

---

## Rate limiter (`src/lib/rateLimit.ts`)

In-memory fixed window, per serverless instance. `RATE_LIMIT_WINDOW_MS`
(default 60000) / `RATE_LIMIT_MAX` (default 5). Slows single-instance bursts;
**not** distributed. For strict global limits, back with Upstash Redis / Vercel
KV — keep the `rateLimit(key)` interface. `clientIp()` reads
`x-forwarded-for` → `x-real-ip` → `cf-connecting-ip`.

---

## Activepieces workflows (cloud.activepieces.com, project `iSXJXfefZWD2nhpB9nmjl`)

Both flows **live** (published + enabled):

- **Vanisca — Reservation** (flow `0oq7M0Sn0FJiS4G8KqFB0`): Catch Webhook →
  Verify Secret + Build Row (code; secret gate active only when `expectedSecret`
  set) → **Google Sheets** Add Row (`Status=Pending`; columns: Submitted At,
  Name, Phone, WhatsApp, Email, Date, Time, Guests, Menu Items, Occasion,
  Message, Attachments, Status) → Respond `{ok:true}`.
- **Vanisca — Contact** (flow `55MAKgW2843RvXuTnTnPQ`): Catch Webhook → Verify
  Secret + Build Row → **Google Sheets** Add Row to "Contacts" (`Status=New`) →
  Respond `{ok:true}`.

Live webhook URL format: `https://cloud.activepieces.com/api/v1/webhooks/<FLOW_ID>`.
**Gotcha:** the Sheets Add Row `values` object is keyed by **column letter** (`A`,
`B`, `C`…), not header name — header-name keys crash (`Invalid array length`) or
silently write nothing. Reservation = A–M in column order; Contact = A–F.
**Owner-gated TODO:** create the Google Sheets connection
(`vanisca.booking@gmail.com`) in Activepieces, assign it to both Add Row steps
(point the Contact flow's `sheetId` at the "Contacts" tab), publish both flows;
optionally add Gmail / WhatsApp notification steps (fail-safe).

- **Sheets:** spreadsheet "Vanisca Reservations"
  (`1JPUhZp_V4Ac8OT_FveLBHABME9VBw5dv0qfz8vuCB6E`), tabs "Feuille 1" + "Contacts".

---

## Environment variables (Vercel dashboard — never commit)

- Public: `NEXT_PUBLIC_SITE_URL/NAME`, `NEXT_PUBLIC_CONTACT_EMAIL`,
  `NEXT_PUBLIC_PHONE` (`0528202202`), `NEXT_PUBLIC_WHATSAPP` (`212611700033`),
  `NEXT_PUBLIC_INSTAGRAM`, `NEXT_PUBLIC_FACEBOOK`. All have safe fallbacks in `src/lib/site.ts`.
- Server-only: `ACTIVEPIECES_RESERVATION_WEBHOOK_URL`, `ACTIVEPIECES_CONTACT_WEBHOOK_URL`,
  `ACTIVEPIECES_WEBHOOK_SECRET`, `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`.
- Setting the two `ACTIVEPIECES_*_WEBHOOK_URL` vars is what connects the live forms to the pipeline.

---

## Rules

- Never log or expose secrets; keep them server-only. Robots disallows `/api/`.
- Any new payload field: schema → sanitize → Activepieces → Sheets column, in that order.
- Preserve fail-safe behavior — a downstream node outage must not 500 the form;
  it degrades to the graceful fallback message.
- Contact numbers: **call `0528202202`**, **WhatsApp `0611700033`**. Public email
  `vanisca.restaurant@gmail.com`; all infra/automation uses `vanisca.booking@gmail.com`.
- Only authentic, verifiable content — never invent hours, addresses, chefs, or awards.
