# Vanisca — Website Storytelling & Build Brief (cinematic media phase)

The website **already exists in production** (Next.js 15 · React 19 · TS ·
Tailwind · GSAP/Framer/Lenis · R3F · next-intl fr/en/ar · forms → Activepieces →
Sheets/Gmail/WhatsApp). This phase adds a cinematic media layer to an already
world-class base — it does not rebuild anything.

## The story we tell (one evening at Vanisca)

Arrival in darkness → the room reveals itself by candlelight → the table, up
close → the kitchen's fire and steam → the invitation to sit. Every scroll
deepens the evening; media supplies atmosphere, HTML supplies every word.

## Section-by-section experience (current → media opportunity)

| Section | Today (live) | Media opportunity (this phase) |
|---|---|---|
| Hero — "Le Rideau" 🔒 | GSAP triptych wall | **Proposal only:** Hero v3 cinematic film (scroll-scrubbed or slow loop) — needs explicit unlock |
| Navigation 🔒 | Couture bar + veil | none — stays |
| About — "L'Éditorial" | magazine spread | swap stock portrait for `vanisca-interior-room` ambience |
| Highlights | cinematic mosaic (branch) | ember/steam textures as chapter transitions |
| House Selection | staggered signature dishes (branch) | keep **real** dish photos (owner policy); optional steam-loop ambience nearby |
| Gallery | lightbox grid | add approved interior stills to the pool |
| CTA banner | parallax photo | `vanisca-interior-table` + candle-loop ambience |
| Find Us / Footer | map + hours | none — factual zone |

## Build workflow (phases, each gated by owner approval)

1. **Planning** *(this document set — done)*
2. **Stills generation** — the 7 approved prompts, one group at a time; review
   each against `brand-kit.md`; reject anything off-grade.
3. **Motion generation** — the 3 films from approved stills; encode all-keyframe.
4. **Integration branch** — `redesign/cinematic-media`; lazy media components
   with poster/reduced-motion/mobile fallbacks; sections upgraded one at a time
   (what/why/impact stated before each).
5. **Verification** — gate green (tsc/lint/build), preview: fr/en/ar, RTL,
   reduced-motion, mobile, console clean, CLS 0, First Load ~103 kB.
6. **PR → owner review on Vercel preview → owner merges** (production deploy).

## Hard boundaries (from the skills — apply to every step)

- Protected systems untouched: reservation, contact, Activepieces, Sheets, Gmail,
  WhatsApp, i18n keys, SEO, routing.
- AI media = artistic motion-design layer with free creative direction (owner
  policy); the menu, gallery and restaurant photography stay real photographs;
  no text/logos/faces baked into media.
- Locked sections stay locked until explicitly unlocked by the owner.
- Restraint: one orchestrated moment per section; performance budget intact.

## Success metric

A visitor lands and thinks *"this restaurant feels exceptional"* — before
reading a single word. An engineer opens the diff and thinks *"nothing risky
happened here."*
