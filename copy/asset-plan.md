# Vanisca — Asset Plan

Every asset, its purpose, destination and constraints. Generation happens only
after owner approval, group by group. Naming: `vanisca-<subject>-<variant>`.

## Group 1 — Hero cinematic film (the flagship)

| Asset | File | Format |
|---|---|---|
| Hero atmosphere still (film frame 0 / poster + fallback) | `assets/images/vanisca-hero-atmosphere.png` | 16:9, 2K+ |
| Raw motion film | `assets/videos/vanisca-hero-film-raw.mp4` | 16:9 · 10–16 s · slow, loop-friendly |
| Encoded film (scrub/loop-ready) | `assets/videos/vanisca-hero-film.mp4` | all-keyframe H.264, muted |

Concept: one continuous candlelit dining-room atmosphere — slow dolly, drifting
steam over an exquisitely plated focal dish, gold light breathing. Artistic
motion design (no faces, no text/logos); full creative freedom for premium
visual impact. Integration target: a proposed Hero v3 concept OR an ambient
layer behind existing sections — **owner decision; Hero is currently locked.**

## Group 2 — Interior / atmosphere stills

| Asset | File |
|---|---|
| Candlelit table setting (brass + linen) | `assets/images/vanisca-interior-table.png` |
| Dining room depth, evening | `assets/images/vanisca-interior-room.png` |
| Bar / glassware glow | `assets/images/vanisca-interior-glass.png` |

Use: About / CTA / gallery ambience layers, parallax backdrops. 16:9 & 4:5 crops.

## Group 3 — Culinary texture & steam (non-representational)

| Asset | File |
|---|---|
| Rising steam macro over dark plate | `assets/images/vanisca-texture-steam.png` |
| Olive oil / herbs macro on charcoal | `assets/images/vanisca-texture-mediterranean.png` |
| Flame / grill ember texture | `assets/images/vanisca-texture-ember.png` |

Use: section transitions, menu chapter ambience. Premium culinary artistry
welcome — these are motion-design elements; the **menu's own dish photos stay
real photography** (owner policy).

## Group 4 — Motion accents (image-to-video from approved stills)

| Asset | File |
|---|---|
| Steam drift loop | `assets/videos/vanisca-steam-loop.mp4` |
| Candle flame breathing loop | `assets/videos/vanisca-candle-loop.mp4` |

Use: small ambient loops inside sections (lazy, muted, `prefers-reduced-motion`
fallback to still).

## Global constraints (every asset)

- Grade to the brand-kit palette (charcoal base, gold key light).
- No text, no logos, no watermarks, no third-party marks, no faces.
- Negative space friendly — HTML text must sit over calm zones.
- Deliver 16:9 masters; 4:5 / 3:4 crops derived at integration time.
- Every asset is reviewed against `copy/brand-kit.md` before acceptance.

## Integration rules

Optimize through `next/image` / lazy `<video>` with poster; mobile gets stills;
reduced-motion gets stills; performance gates from
`vanisca-seo-performance-deployment` are non-negotiable (First Load ~103 kB, CLS 0).
