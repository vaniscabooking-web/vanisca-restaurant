---
name: vanisca-seo-performance-deployment
description: >-
  SEO, accessibility, performance optimization and deployment workflow
  for Vanisca Restaurant. Use whenever optimizing Lighthouse scores,
  metadata, schema, image loading, caching, deployment or production QA.
---

# Vanisca — SEO, Performance, Accessibility & Deployment

Reflects the code as built (`next.config.mjs`, `src/app/**`, `src/i18n/**`).
Targets: **Lighthouse 90+**, **CLS 0**, fast Core Web Vitals — without ever
sacrificing the luxury experience.

---

## SEO & metadata

- **Per-locale metadata** in `src/app/[locale]/layout.tsx` via
  `generateMetadata` + `getTranslations("meta")`: title template
  `%s · Vanisca`, description, keywords, `metadataBase`, OpenGraph + Twitter,
  `robots {index,follow}`.
- **hreflang / alternates:** `languages` map over all locales +
  `x-default → /fr`. Keep this in sync when adding routes or locales.
- **i18n** (`src/i18n/routing.ts`): locales `fr` (default) / `en` / `ar`,
  `localePrefix: "always"`, `ar` is RTL (Cairo). Every URL is locale-prefixed.
- **JSON-LD** `Restaurant` in `src/app/[locale]/page.tsx` (name, image, url,
  telephone `+212…`, `servesCuisine`, address `Agadir/MA`, `sameAs`
  [facebook, instagram, whatsapp], `acceptsReservations`). Server-generated from
  `siteConfig` — keep it to **verified fields only**, no invented data.
- **`sitemap.ts`** — every locale × `["","/menu","/gallery","/contact","/reservation"]`
  with per-URL `alternates.languages`; home `priority 1` weekly, others `0.8` monthly.
- **`robots.ts`** — allow all, **disallow `/api/`**, sitemap + host from `siteConfig`.
- **OG image** — edge route `opengraph-image.tsx`.
- Add a new page → add it to `sitemap.ts` paths and confirm its `generateMetadata`.

---

## Performance

- **3D is lazy** (`dynamic(ssr:false)` for the R3F `Background3D`) → three.js off
  the critical path; **First Load JS ~103 kB**. Keep the 3D chunk out of the
  initial bundle.
- **GSAP is dynamically `import()`-ed** inside effects (Hero, etc.) — never a
  static top-level import in a component that renders above the fold.
- **Images:** `next/image` only, via `LuxeImage` (AVIF/WebP from `next.config.mjs`,
  responsive `sizes`, lazy by default, `priority` only on the first hero panel).
  Remote hosts are allowlisted: `images.unsplash.com`, `images.pexels.com`,
  `lh3.googleusercontent.com`, `drive.google.com` — add hosts there before using them.
- **3D perf gates:** DPR caps, mobile particle/shadow/light reduction, HDR env
  desktop-only, refs+rAF (zero re-renders), reduced-motion → static frame,
  no-WebGL → skipped; idle rAF loops sleep.
- **CLS 0:** fixed-height hero/nav stages, sized images, motion initial-states in
  JS so the static paint is already the final layout.
- `next.config.mjs`: `compress: true`, `poweredByHeader: false`, `reactStrictMode`.

---

## Security headers (`next.config.mjs`)

Applied to `/:path*`: HSTS (`max-age=63072000; includeSubDomains; preload`),
`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy: camera=(), microphone=(), geolocation=(self)`,
`X-DNS-Prefetch-Control: on`. No `X-Powered-By`. Preserve these.

---

## Accessibility

Skip-to-content link, visible gold `:focus-visible`, semantic landmarks,
`aria-current`/`aria-expanded`, keyboard paths in overlays (Esc + arrows),
decorative images `alt=""`, `prefers-reduced-motion` honored globally and
per-animation. Verify contrast of gold-on-charcoal for any new text.

---

## Deployment & QA

- **Flow:** `git push main` → GitHub (`vaniscabooking-web/vanisca-restaurant`)
  → **Vercel auto-deploys** (team `vanisca`, project `vanisca-restaurant`,
  Next.js preset). Domains incl. `vanisca-restaurant.vercel.app`.
- **Quality gate before every push** (all must be green):
  `npx tsc --noEmit` → `npx next lint` → `npm run build`.
- **Verify in preview** (dev server) before committing anything observable —
  screenshots / console / real interactions; then verify the **live URL** after
  deploy (poll for a marker unique to the change; check `/fr`, `/en`, `/ar`).
- Commit style: descriptive body, `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Only commit/push when the user asks. Branch from `main` for redesign work;
  fast-forward into `main` when approved.
- Custom domain (`www.vanisca.ma`) is configured in code but not yet attached in
  Vercel — only `.vercel.app` is live today. Cloudflare DNS is a future step.

---

## Rule

Every visual upgrade ships **with** its performance budget intact. If an effect
costs Lighthouse points or introduces CLS, gate it (lazy, reduced-motion,
desktop-only) rather than dropping it — or find a cheaper technique.
