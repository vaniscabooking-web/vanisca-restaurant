# 🍽️ Vanisca Restaurant — Agadir

Premium, production-ready website for **Vanisca Restaurant Agadir** — a trilingual
(Français / English / العربية) restaurant site with an online reservation system
wired into Activepieces → Google Sheets → Gmail, ready to deploy on Vercel.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**,
**next-intl** (i18n + RTL), and **Framer Motion**.

---

## ✨ Features

- **Trilingual** FR / EN / AR with full **RTL** support for Arabic and per-locale SEO.
- **Luxury UI/UX** — warm wood & copper palette inspired by the restaurant interior,
  smooth scroll-reveal animations, fully responsive, dark elegant theme.
- **Full menu** (entrées, pâtes, risotto, pizzas, viandes, poissons, jus, desserts…)
  driven by a single typed data file, with category navigation and dietary tags.
- **Reservation system** with date/time/guests, optional file upload, validation,
  honeypot spam protection, and rate limiting.
- **Contact form** with the same protections.
- **Activepieces automation**: webhook → secret check → Google Sheets + Gmail.
- **SEO**: per-locale metadata, `hreflang`, sitemap, robots, JSON-LD `Restaurant` schema,
  Open Graph image generated on the fly.
- **Security headers**, input sanitization, server-side re-validation, secret-protected webhooks.
- **Accessibility**: semantic HTML, skip link, focus states, `prefers-reduced-motion`.

---

## 🚀 Quick start (local)

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000  → redirects to /fr
```

Build & run production locally:

```bash
npm run build
npm start
```

---

## 🔐 Environment variables

Copy `.env.example` to `.env.local` (local) or add them in **Vercel → Project →
Settings → Environment Variables** (production). Never commit real secrets.

| Variable | Public? | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical site URL (e.g. `https://www.vanisca.ma`) |
| `NEXT_PUBLIC_SITE_NAME` | ✅ | Display name |
| `NEXT_PUBLIC_CONTACT_EMAIL` | ✅ | **Public** email — `vanisca.restaurant@gmail.com` |
| `NEXT_PUBLIC_PHONE` | ✅ | Phone shown on the site |
| `NEXT_PUBLIC_WHATSAPP` | ✅ | WhatsApp number (intl format, no `+`) |
| `NEXT_PUBLIC_INSTAGRAM` | ✅ | Instagram handle |
| `ACTIVEPIECES_RESERVATION_WEBHOOK_URL` | 🔒 | Activepieces webhook for reservations |
| `ACTIVEPIECES_CONTACT_WEBHOOK_URL` | 🔒 | Activepieces webhook for contact messages |
| `ACTIVEPIECES_WEBHOOK_SECRET` | 🔒 | Shared secret sent as `X-Webhook-Secret`; must match the flows |
| `RATE_LIMIT_WINDOW_MS` | 🔒 | Rate-limit window (default 60000) |
| `RATE_LIMIT_MAX` | 🔒 | Max requests per window per IP (default 5) |

> **Account separation rule:** the public website email is
> `vanisca.restaurant@gmail.com`. The automation account
> `vanisca.booking@gmail.com` is used **only** inside Activepieces (Sheets / Gmail)
> and never appears as a public contact.

---

## 🤖 Activepieces automation setup

Two flows already exist in the connected Activepieces project:

- **Vanisca — Reservation** (flow `0oq7M0Sn0FJiS4G8KqFB0`)
- **Vanisca — Contact** (flow `55MAKgW2843RvXuTnTnPQ`)

Each flow: **Catch Webhook → Verify Secret + Build Row (code) → Google Sheets
Add Row → Respond `{ok:true}`** — appending to the *Vanisca Reservations*
spreadsheet (`Feuille 1` with `Status=Pending`, `Contacts` with `Status=New`).

To finish wiring them (one-time, requires the `vanisca.booking@gmail.com` Google login):

1. In Activepieces, create a **Google Sheets** connection (and optionally
   **Gmail**) by signing in with `vanisca.booking@gmail.com`, then assign it to
   the *Add Row* step in both flows (the Contact flow's `sheetId` must point at
   the `Contacts` tab).
2. (Optional) Set the same secret in each flow's **Verify Secret + Build Row**
   step (`expectedSecret` input) and in `ACTIVEPIECES_WEBHOOK_SECRET` — empty
   disables the gate.
3. **Publish** both flows and set the webhook URLs
   (`https://cloud.activepieces.com/api/v1/webhooks/<FLOW_ID>`) in Vercel as
   `ACTIVEPIECES_RESERVATION_WEBHOOK_URL` / `ACTIVEPIECES_CONTACT_WEBHOOK_URL`.

**Reservation data flow:**

```
Website form → /api/reservation (validate, sanitize, rate-limit, honeypot)
            → Activepieces webhook (verify secret)
            → Build row → Google Sheets append → respond {ok:true}
```

---

## ☁️ Deploy to Vercel

1. Push this repository to GitHub (see below).
2. In Vercel, **Import** the GitHub repo. Framework preset: **Next.js** (auto-detected).
3. Add all environment variables (table above) for **Production** (and Preview).
4. Deploy. Every push to the default branch triggers an automatic production deploy.
5. Point your domain (e.g. `vanisca.ma`) to Vercel and set `NEXT_PUBLIC_SITE_URL`.

---

## 🧱 Project structure

```
src/
├── app/
│   ├── [locale]/                 # localized pages (home, menu, gallery, contact, reservation)
│   ├── api/                      # reservation & contact API routes (validate → Activepieces)
│   ├── sitemap.ts / robots.ts    # SEO
│   ├── manifest.ts / icon.svg    # PWA + favicon
│   └── opengraph-image.tsx       # dynamic OG image
├── components/                   # UI (Navbar, Hero, MenuList, forms, Gallery…)
├── data/menu.ts                  # single source of truth for the menu (FR/EN/AR)
├── i18n/                         # next-intl routing + request config
├── lib/                          # site config, validation, rate limit, automation forwarding
└── middleware.ts                 # locale routing
messages/                         # fr.json / en.json / ar.json (UI strings)
```

---

## 🖼️ Replacing placeholder images

The gallery and "about" visuals use tasteful gradient placeholders so the site is
never broken. To use real photos:

1. Drop image files in `public/gallery/` (e.g. `facade.jpg`).
2. In `src/components/Gallery.tsx`, set the `src` field on the matching tile
   (e.g. `src: "/gallery/facade.jpg"`).

---

## 🔮 Future admin dashboard

The architecture is intentionally ready for a future staff dashboard (view
reservations, manage menu/gallery, edit info) without major refactoring:
the menu is already a typed data layer, forms post to typed API routes, and
Google Sheets acts as the interim database — easy to migrate to Postgres/Supabase later.

---

## 📦 Tech & scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | Lint |

---

© Vanisca Restaurant Agadir. Built for easy ownership transfer.
