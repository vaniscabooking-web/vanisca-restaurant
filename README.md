# 🍽️ Vanisca Restaurant — Agadir

Premium, production-ready website for **Vanisca Restaurant Agadir** — a trilingual
(Français / English / العربية) restaurant site with an online reservation system
wired into n8n → Google Sheets → Google Drive → Gmail, ready to deploy on Vercel.

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
- **n8n automation**: webhook → secret check → Google Sheets + Google Drive + Gmail.
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
| `N8N_RESERVATION_WEBHOOK_URL` | 🔒 | n8n production webhook for reservations |
| `N8N_CONTACT_WEBHOOK_URL` | 🔒 | n8n production webhook for contact messages |
| `N8N_WEBHOOK_SECRET` | 🔒 | Shared secret sent as `X-Webhook-Secret`; must match n8n |
| `RATE_LIMIT_WINDOW_MS` | 🔒 | Rate-limit window (default 60000) |
| `RATE_LIMIT_MAX` | 🔒 | Max requests per window per IP (default 5) |

> **Account separation rule:** the public website email is
> `vanisca.restaurant@gmail.com`. The automation account
> `vanisca.booking@gmail.com` is used **only** inside n8n (Sheets / Drive / Gmail)
> and never appears as a public contact.

---

## 🤖 n8n automation setup

Two workflows have already been created in the connected n8n instance:

- **Vanisca — Reservation** (`vanisca-reservation` webhook path)
- **Vanisca — Contact** (`vanisca-contact` webhook path)

To finish wiring them (one-time, requires the `vanisca.booking@gmail.com` Google login):

1. In n8n, create **Google Sheets**, **Google Drive**, and **Gmail** credentials by
   signing in with `vanisca.booking@gmail.com`. Assign them to the nodes that ask for them.
2. Create a Google Sheet (e.g. *Vanisca Reservations*) with two tabs:
   - `Reservations` — header row: `Submitted At, Name, Phone, WhatsApp, Email, Date, Time, Guests, Occasion, Message, Attachment`
   - `Contacts` — header row: `Submitted At, Name, Email, Subject, Message`
   Paste the **Spreadsheet ID** into the *Append* nodes.
3. Create the Drive folder structure (below) and paste the **Reservations Uploads**
   folder ID into the *Upload Attachment to Drive* node.
4. In each workflow's **Verify Secret** node, paste the same value you set for
   `N8N_WEBHOOK_SECRET`.
5. **Activate** both workflows and copy their **Production** webhook URLs into
   `N8N_RESERVATION_WEBHOOK_URL` and `N8N_CONTACT_WEBHOOK_URL` in Vercel.

Suggested Google Drive structure:

```
Vanisca Restaurant/
├── Reservations Uploads/
├── Restaurant Images/
├── Menu Media/
└── Future Content/
```

**Reservation data flow:**

```
Website form → /api/reservation (validate, sanitize, rate-limit, honeypot)
            → n8n webhook (verify secret)
            → Normalize → [Drive upload if file] → Google Sheets → Gmail → respond
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
│   ├── api/                      # reservation & contact API routes (validate → n8n)
│   ├── sitemap.ts / robots.ts    # SEO
│   ├── manifest.ts / icon.svg    # PWA + favicon
│   └── opengraph-image.tsx       # dynamic OG image
├── components/                   # UI (Navbar, Hero, MenuList, forms, Gallery…)
├── data/menu.ts                  # single source of truth for the menu (FR/EN/AR)
├── i18n/                         # next-intl routing + request config
├── lib/                          # site config, validation, rate limit, n8n forwarding
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
