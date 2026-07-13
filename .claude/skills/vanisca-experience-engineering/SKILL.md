---
name: vanisca-experience-engineering
description: >-
  Hands-on engineering and cinematic motion/scroll implementation playbook for
  Vanisca Restaurant — how the internal team builds, layers, animates, gates and
  verifies luxury sections without breaking protected systems. Use when
  implementing or reviewing GSAP/Framer/Lenis motion, scroll storytelling, 3D
  layering, section build workflow, performance gating, page transitions, or
  production verification. Companion to vanisca-luxury-uiux-motion (design
  tokens) — this skill is the "how we build it" playbook.
---

# Vanisca — Experience Engineering Playbook

Adapted from a professional scroll-motion production skill, recast for the
**real** Vanisca project. This is the internal engineering team's operating
manual: behave like a careful senior team member, not a code generator. It
governs *how* work is built and verified. For design tokens/type/color see
`vanisca-luxury-uiux-motion`; for backend see `vanisca-fullstack-integrations`;
for SEO/deploy see `vanisca-seo-performance-deployment`; brand voice/content in
`vanisca-branding-content-media`; project vision in `vanisca-luxury-restaurant`.

**Authority:** this skill owns *how we build and verify* — implementation
patterns, motion gotchas, layer architecture, performance gates, and the
verify/branch/PR workflow. *What* it looks and moves like — tokens, type,
surfaces, component vocabulary, canonical eases, restraint — is owned by
`vanisca-luxury-uiux-motion`. When guidance overlaps: build mechanics defer here;
design values defer there.

> Not applicable to Vanisca: any AI media-generation pipeline (image/video
> models, ffmpeg keyframe video, scroll-scrubbed background film). Vanisca uses
> curated real/stock photography and is bound by the authenticity rule — never
> generate or pass off synthetic food/room imagery as real. Media guidance
> lives in `vanisca-branding-content-media`.

---

## Operating conduct

- You are improving an **existing production project**. Never recreate, replace
  or redesign what already works. Enhance over rewrite.
- **Protected systems are behavior-frozen** (reservation, contact, APIs, n8n,
  Google Sheets, Gmail, WhatsApp, env vars, routing, i18n, SEO, rate-limiting,
  validation, file-upload). You may restyle their UI; never change their logic
  without explicit approval.
- Work **incrementally**, one section at a time. Before each meaningful change,
  state briefly: **what** you'll improve, **why**, and the **expected impact**.
- Nothing reaches `main` without approval. Use a branch + PR; verify on the
  branch preview; the user merges (production deploy).
- Never invent endpoints, env vars, schemas, or content. If inspection can't
  answer a question, ask.

## Thinking sequence (never skip)

UNDERSTAND → INSPECT → ANALYZE → PLAN → RISKS → IMPACT → PROPOSE → (WAIT if
required) → IMPLEMENT → VERIFY → SELF-REVIEW → OPTIMIZE → DOCUMENT → FINAL REVIEW.
Never jump straight into code.

## Inspection engine (before editing)

Read the target component and its neighbours; confirm the real current state
(a parallel session may have changed it). Check: imports/usages (before deleting
anything, grep for importers), the design tokens in use, i18n keys, motion
already present, reduced-motion/RTL handling, and build status. **Never assume —
always inspect.** Prefer the dedicated Read/Grep/Glob tools.

## Decision engine

When multiple approaches exist, list them, weigh trade-offs, and choose the
**safest + most maintainable + most consistent** with existing patterns — not
the flashiest. Elegance is executing a restrained choice well.

---

## Stack (real — do not swap)

Next.js 15 App Router · React 19 · TypeScript · Tailwind 3.4 · Framer Motion ·
**GSAP + ScrollTrigger** · **Lenis** (via `SmoothScroll`) · three r0.171 +
@react-three/fiber v9 + drei v10 · next-intl (fr default / en / ar RTL) ·
lucide-react · Zod. Forms are native `FormData` (no React Hook Form).

---

## Motion & scroll engineering (the core of this skill)

### Library roles — implementation mapping
Design-level roles and the canonical eases live in `vanisca-luxury-uiux-motion`;
below is the *implementation* mapping — which components use each library and how
they are wired.
- **Framer Motion** — component reveals, presence/exit, small UI interactions
  (`Reveal`, lightbox, mobile veil, `template.tsx` route transitions).
- **GSAP + ScrollTrigger** — cinematic section timelines and scrubbed scroll
  (Hero "Le Rideau", About "L'Éditorial", Highlights). **Always dynamically
  imported** so it stays off the critical path.
- **Lenis** — inertia smooth scroll (desktop fine-pointer + motion-safe only;
  native on touch/reduced-motion), wired once in `SmoothScroll`.

### The Vanisca GSAP section pattern (copy this shape)
```tsx
useEffect(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const el = root.current; if (!el) return;
  let cancelled = false; let cleanup: (() => void) | undefined;
  (async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import("gsap"), import("gsap/ScrollTrigger"),
    ]);
    if (cancelled || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      gsap.set(q("[data-…]"), { /* initial state in JS, not CSS */ });
      const tl = gsap.timeline({ defaults: { ease: "power4.out" },
        scrollTrigger: { trigger: el, start: "top 72%", once: true } });
      tl.to(/* … */);
    }, el);
    cleanup = () => ctx.revert();
  })();
  return () => { cancelled = true; cleanup?.(); };
}, []);
```
Rules: use the signature eases defined in `vanisca-luxury-uiux-motion` (shown
literally in the sample above so it runs standalone). Set **initial states in JS**
(not CSS) so no-JS / reduced-motion always paint the finished composition →
**CLS 0**. Animate only `transform`/`opacity`/`filter`
(GPU). Drive scroll/pointer physics on refs + rAF (zero React re-renders); sleep
idle rAF loops (see `Background3D` rack-focus).

### Hard-won gotchas (do not relearn these)
- **Framer inline transform beats Tailwind translate.** A `Reveal`/`motion.*`
  element writes an inline `transform`; a Tailwind `translate-*` utility on the
  *same* element is silently overridden. Put static transforms on a **separate
  non-animated element** (e.g. the real `<li>`, with `Reveal` nested inside).
- **`Reveal` ignores its `as` prop** — it always renders `motion.div`. Use an
  explicit `<li>` when you need valid list semantics.
- **`TiltCard` mutates inline `transform` on hover** — don't rely on a Tailwind
  transform on the TiltCard itself; it'll be overwritten during tilt.
- **Programmatic scroll ≠ ScrollTrigger update under Lenis.** Setting
  `scrollTop` with `immediate` doesn't emit Lenis events, so scroll-triggered
  reveals won't fire when testing; drive an animated `lenis.scrollTo` or real
  wheel scroll to verify.
- **Never run `next dev` and `next build` at once** — they race over
  `.next/types` and produce spurious `TS6053 … page.ts not found`. Stop the dev
  server before the production gate.

### 3D interaction (only where it earns its place)
One site-wide `<Canvas>` in `Background3D`: fixed, full-viewport,
`pointer-events-none`, `-z-[40]`, behind all content; lazy `dynamic(ssr:false)`;
gated on WebGL + not data-saver; fades in; DSLR rack-focus rAF that sleeps when
idle. `Scene`: camera `[0,0,6]` fov 50, `frameloop="demand"` under reduced
motion, DPR/particle/shadow caps on mobile, HDR `Environment` desktop-only,
`<Preload all>`, window-driven `PointerRig` (canvas is click-through). Keep 3D
ambient and calm — support the brand, never distract; never add a second WebGL
context.

---

## Layer architecture (real z-index stack)

| Layer | z | Notes |
|---|---:|---|
| 3D `Background3D` | −40 | fixed, pointer-events-none, behind all |
| Page content / sections | auto | transparent sections let the 3D show through |
| Gallery lightbox | 60 | dialog + backdrop |
| Skip link (focus) | 70 | a11y |
| `CursorAura` | 75 | desktop only, pointer-events-none |
| `LoadingVeil` | 90 | once-per-session opening |
| Navbar | 50 | glass on scroll; no resting transform (would trap the fixed mobile veil) |

New overlays slot into this stack; don't invent conflicting z-indexes.

---

## Performance gates (non-negotiable)

- three.js + GSAP stay **off the critical path** (lazy / dynamic import); keep
  **First Load JS ~103 kB**.
- `next/image` via `LuxeImage` only; `priority` on the first hero image;
  responsive `sizes`; remote hosts allow-listed in `next.config.mjs`.
- **CLS 0**: fixed-height stages, sized images, JS-set motion initial states.
- Every effect is gated: `prefers-reduced-motion`, fine-pointer/desktop-only,
  data-saver/WebGL checks. If an effect costs Lighthouse points, gate it or find
  a cheaper technique — never drop the performance budget.

---

## Verification workflow (before commit)

1. **Gate green** (dev server stopped): `npx tsc --noEmit` → `npx next lint` →
   `npm run build`  (or `npm run verify`).
2. **Preview**: start the dev server, drive the real flow. Screenshots have been
   unreliable in this environment — prefer **text-based verification** (DOM
   reads, computed styles via `javascript_tool`, console/network) and real
   scroll/interaction. Confirm the animation actually reaches its end state.
3. **Cross-cutting**: FR / EN / **AR (RTL)**; reduced-motion; mobile + desktop;
   zero console errors; CLS unaffected.
4. **Document** what/why/impact in the commit; end messages with
   `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
5. **Branch → PR → Vercel branch preview** for a real-browser check; the user
   merges to `main` (auto-deploys). Then verify the live URL (poll for a marker;
   check all three locales).

## Build philosophy

Start from what exists; make one section exceptional; verify; document; then the
next. Prefer reusing the component vocabulary (`SectionHeading`, `Reveal`,
`Parallax`, `TiltCard`, `LuxeImage`) before inventing. Restraint over quantity —
one orchestrated moment per section, executed precisely. Success metric: a
visitor thinks *"this restaurant feels exceptional,"* and an engineer thinks
*"this stayed easy to maintain."*
