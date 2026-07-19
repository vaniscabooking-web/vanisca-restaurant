---
name: vanisca-luxury-uiux-motion
description: >-
  Luxury UI/UX system and motion design rules for Vanisca Restaurant.
  Use this skill whenever creating or improving layouts, animations,
  3D experiences, typography, colors, micro-interactions, page transitions,
  premium components, or visual storytelling.
---

# Vanisca — Luxury UI/UX & Motion System

The single source of truth for how Vanisca looks and moves. Everything below
reflects the code as built (`tailwind.config.ts`, `src/app/globals.css`,
`src/components/**`). Extend it; never regress it. The theme is **dark only** —
there is no light theme.

**Authority:** this skill owns *what Vanisca looks and moves like* — tokens,
type, surfaces, component vocabulary, canonical motion values, restraint. *How*
it is built and verified — the GSAP section pattern, motion gotchas, performance
gates, build/verify workflow — is owned by `vanisca-experience-engineering`.
When guidance overlaps: design values defer here; implementation mechanics defer
there.

---

## Palette (Tailwind tokens)

Charcoal base + brass/gold accent + Mediterranean support. Defined in
`tailwind.config.ts`; never hardcode hexes that duplicate a token.

- `charcoal`: DEFAULT `#161311`, 800 `#221d18`, 900 `#171310`, **950 `#0d0b09`** (page base)
- `gold`: DEFAULT `#c8a45c`, light `#e6cd93`, dark `#9c7c3e` (primary accent)
- `brass`: `#b08d57` / light `#caa972` / dark `#876a3c`
- `copper`: `#b5764a` / light `#d39a6e` / dark `#8a5733`
- `olive`: `#7c845a` / light `#9aa276` / dark `#565c3c`
- `sand`: `#d9caac` / light `#ece2cd` / dark `#b8a888`
- `cream`: `#f4eee2` (primary text)
- CSS vars: `--background:#0d0b09`, `--foreground:#f4eee2`
- Gold CTA fill: `bg-gold-gradient` (`linear-gradient(135deg,#e6cd93,#c8a45c,#9c7c3e)`)
- Shadows: `shadow-luxe`, `shadow-gold-glow`

Rules: gold is the one bold accent — spend it in a single place per view and
keep everything around it quiet. Dietary/marine tag hues stay inside the brand
family (gold / olive-light / copper-light + one restrained marine `#8aa9b4`);
never borrow generic UI red/green/blue.

---

## Typography

`next/font/google`, wired as CSS vars in the locale layout:

- **Display** — Cormorant Garamond (`--font-display`, `.heading-display`,
  `font-display`): all headings, brand word. Weights 400–700.
- **Body** — Inter (`--font-sans`, default `font-sans`).
- **Arabic** — Cairo (`--font-arabic`); applied automatically under
  `[dir="rtl"]` / `[lang="ar"]`.
- Uppercase eyebrows use `tracking-luxe` (0.32em) via `.eyebrow` (gold, with a
  hairline `::before` rule).
- Numbers that align in columns (prices, stats, counters) use `tabular-nums`.
- Headings get `text-balance`; body copy stays near a 60–65ch measure.

---

## Signature surfaces & utilities (globals.css)

- `.container-px` — page gutter (`max-w-7xl` + responsive px).
- `.glass` — the one glass recipe: `rgba(255,255,255,0.08)` + `blur(20px)` +
  `1px rgba(255,255,255,0.1)` border + 20px radius (`-webkit-` prefixed).
  Full-width bars override radius to `rounded-none`.
- `.btn-primary` — gold-gradient pill, uppercase 0.18em, hover lift +
  light-sweep `::after`, `active:scale-[0.98]` (press "mass").
- `.btn-outline` — gold hairline border, fills `gold/10` on hover.
- `.eyebrow`, `.rule-gold` (hairline gold divider), `.text-gradient-gold`.
- `.tilt-card` + `.tilt-sheen` — perspective tilt with cursor-following gold sheen.
- `.bg-marble` — charcoal + faint olive/gold radial + SVG grain (section grounds).
- `.text-shadow-luxe`, `.mask-fade-b`, `.hero-aurora*`, `.hero-dust`, custom gold scrollbar.

---

## Component vocabulary (reuse before inventing)

- **Hero** (`Hero.tsx`) — "Le Rideau" cinematic triptych: three full-height
  photographic panels behind hairline gold seams, monumental headline across
  the wall, brand word in italic gold. GSAP curtain-lift entrance + per-panel
  scroll parallax. **Locked — do not modify without an explicit hero task.**
- **Navbar** (`Navbar.tsx`) — "La Ligne d'Or" three-zone grid (logo / centered
  links / actions). Transparent at top → glass under a drawn gold hairline on
  scroll; hides on decisive scroll-down past the hero, returns on scroll-up.
  Couture underlines grow from the centre. Mobile = full-screen charcoal veil
  echoing the hero seams, serif links in cascade. **Locked.**
- **SectionHeading** — eyebrow + display title + `rule-gold`, optional ghost
  chapter numeral (`index`). Use for section intros.
- **Reveal** — scroll-reveal wrapper (Framer, `once`, ease `[0.22,1,0.36,1]`).
- **Parallax** — scroll-depth drift for oversized images inside an
  `overflow-hidden` frame (About portrait, CTA background).
- **TiltCard** — 3D tilt + gold sheen (menu / signature cards).
- **LuxeImage** — `next/image` with graceful gradient fallback (never a broken tile).
- **LoadingVeil** — once-per-session brand opening (letter blur reveal + gold hairline).
- **template.tsx** — cinematic per-route transition (opacity/y, resets to none at rest).
- **MagneticButtons** / **CursorAura** — global desktop micro-interactions
  (magnetic pull via CSS `translate`; candlelight glow + trailing gold ring).
- **ScrollProgress**, **FloatingActions** (WhatsApp + back-to-top), **SmoothScroll** (Lenis).

---

## Motion system

Canonical motion values and aesthetic live here; the pattern that *applies* them
(GSAP wiring, dynamic import, rAF physics, GPU-only transforms, JS-set initial
states) is owned by `vanisca-experience-engineering`.

- **Libraries — what each is for:** Framer Motion — component reveals & small UI
  interactions; **GSAP + ScrollTrigger** — cinematic section timelines & scrubbed
  scroll; **Lenis** — inertia smooth scroll (desktop fine-pointer + motion-safe).
  The implementation mapping and the copy-this GSAP section pattern live in
  `vanisca-experience-engineering`.
- **Signature easing — canonical source:** `[0.22, 1, 0.36, 1]` (Framer) /
  `power4.out` / `power3.inOut` (GSAP). Calm, cinematic — never bouncy by default.
- **Outcome:** because motion initial-states are set in JS (build rule owned by
  engineering), no-JS / reduced-motion always paint the finished composition →
  **CLS 0**.

---

## Non-negotiables

- **Reduced motion:** global CSS kill-switch already exists; every custom
  animation must also branch on `useReducedMotion()` / the media query.
- **RTL:** use logical props (`ps-`/`pe-`/`ms-`/`me-`, `start`/`end`,
  `inset-inline`) and `rtl:` variants. Verify Arabic before shipping.
- **Zero CLS:** fixed-height stages, `priority` on the first hero image, sized
  `next/image` everywhere.
- **Accessibility:** visible `:focus-visible` (gold outline), semantic HTML,
  `aria-current`/`aria-expanded`, keyboard paths (Esc/arrows in overlays),
  decorative images get empty `alt`.
- **Restraint over quantity:** more animation is what makes a page feel
  AI-generated. Elegance = one orchestrated moment per section, executed well.
