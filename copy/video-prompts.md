# Vanisca — Image-to-Video Prompts (approved list only)

Motion is generated **only after** its source stills are approved, using those
stills as references so the film matches the approved world exactly. All
constraints from `image-prompts.md` carry over. Designed for muted, lazy,
loop-or-scrub background use — never autoplay spectacle.

## 1 · vanisca-hero-film (from vanisca-hero-atmosphere) — 10–16 s · 16:9

Cinematic slow push-in through the candlelit dining room: camera drifts forward
almost imperceptibly, candle flames breathe, steam rises and curls from the
exquisitely plated signature dish, golden light slowly blooms and settles.
Subtle candlelight movement plays across reflective glass, brass and table
surfaces; gentle atmospheric haze drifts naturally; soft golden reflections
slowly evolve during the camera push. One continuous take. Stable horizon, no
cuts, no camera shake, no people entering frame, no sudden exposure shifts.
Clean negative space preserved throughout the sequence for HTML overlays. Do
not increase camera speed — motion stays elegant and restrained. Start and end
frames calm enough to loop or hold. Motion slow and readable enough for
scroll-scrubbing.

**Constraints:** no text · no logos · no faces · no fast motion · consistent
grade with the source still · generous calm zones preserved for overlaid HTML.

## 2 · vanisca-steam-loop (from vanisca-texture-steam) — 6–10 s · 16:9

Only the steam moves: a slow, elegant ribbon rising and dissolving, backlit
gold. Very subtle heat distortion around the steam and natural soft turbulence
— premium cinematic realism. Movement remains elegant; perfect seamless loop;
background static; no flicker.

## 3 · vanisca-candle-loop (from vanisca-interior-table) — 6–10 s · 16:9

Only the candle flame and its reflections breathe; everything else still.
Gentle shimmering reflections on nearby crystal glassware and warm reflections
on brass details; very subtle exposure breathing without visible flicker.
Seamless loop, no flicker artifacts.

---

## Technical delivery

- Raw output → `assets/videos/vanisca-<name>-raw.mp4`.
- Encode for web/scrub: muted, all-keyframe H.264 (`-an -c:v libx264 -preset
  slow -crf 18 -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p -movflags
  +faststart`) → final name per `asset-plan.md`. Encoder helper will live in the
  existing `scripts/` folder when this phase is approved.
- Every film ships with its source still as poster + reduced-motion/mobile
  fallback. Performance gates are non-negotiable.

## Integration honesty note

Any use in the Hero is a **Hero v3 proposal** — the current hero (Le Rideau) is
locked and stays live until the owner explicitly approves a replacement on a
branch preview.
