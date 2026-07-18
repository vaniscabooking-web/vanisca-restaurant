# Vanisca — Cinematic Media Production Workspace

Planning workspace for the Vanisca Restaurant cinematic media phase. This folder
system prepares — **but does not yet generate** — the premium imagery and motion
film that will later feed the hero cinematic background, scroll-driven
animations and motion storytelling.

> This README lives in `copy/` deliberately: the repository root `README.md`
> is the production project's readme and is never overwritten.

## Structure

```
assets/
├─ images/       final approved stills (AI-atmospheric or real photography)
├─ videos/       raw + encoded motion films
└─ references/   style frames, grade references, composition references
copy/
├─ brand-kit.md        brand identity — palette, type, voice (source: live code)
├─ asset-plan.md       every asset, its purpose, format and destination
├─ image-prompts.md    approved still-image generation prompts
├─ video-prompts.md    approved image-to-video generation prompts
└─ website-brief.md    storytelling, section experience, build workflow
scripts/         (existing repo folder — reused; e.g. media encode helpers later)
```

## Governing rules (from the installed Vanisca skills)

1. **AI media policy (owner-set):** AI media is the website's **artistic
   motion-design layer** — hero cinematics, scroll sequences, ambient loops,
   transitions. Creative direction is free and should optimize for premium
   visual impact (beautiful culinary/interior artistry welcome). The line that
   holds: **menu, gallery and restaurant photography stay real photographs** —
   AI assets are motion design, not documentation. No baked-in text, logos,
   faces or third-party marks.
2. **Protected systems are untouchable:** reservation, contact, Activepieces, Sheets,
   Gmail, WhatsApp, i18n, SEO, routing. Media work is a visual layer only.
3. **Locked sections:** Hero "Le Rideau" and Navigation "La Ligne d'Or" are
   locked. Any new cinematic hero film is a **proposal** requiring explicit
   owner approval before integration.
4. **Performance gates:** First Load JS ~103 kB, CLS 0, reduced-motion and
   mobile fallbacks. Any background film ships lazily, gated, with a poster
   fallback — or it doesn't ship.
5. **Workflow:** plan → approve → generate stills → review → generate motion →
   encode → integrate on a branch → verify (fr/en/ar, reduced-motion, mobile) →
   PR → owner merges.

## Status

- [x] Workspace + planning documents created
- [x] Owner review of plans and prompts (approved with refinements, 2026-07-13)
- [x] Group 1 — `vanisca-hero-atmosphere.png` (job 09616aaf) — **approved, locked as master**
- [~] Group 2 — table ✅ · glass ✅ · room ⚠️ pillarboxed (usable as 4:5 crop) — awaiting review
- [~] Group 3 — steam ✅ (job 04b74032) · mediterranean ✅ (job f9cf9385) · ember ✅ (job 0ee46f66),
      all 2752×1536 2K, grade-anchored to the master — awaiting review. ~4 credits left.
      Next after all stills approved: 3 films (Hero ~24 + 2 loops ~14 ≈ 38 cr → needs top-up).
- [~] Motion generation — **Steam Loop ✅ approved, FINAL** (`assets/videos/vanisca-steam-loop-raw.mp4`,
      720p·8s·24fps silent, job b0680f55; needs all-keyframe encode + loop crossfade at integration).
      Hero Film + Candle Loop pending credits (~24 + ~7 ≈ 31 cr; ~0.4 on hand).
- [ ] Encode + integration branch
- [ ] Verification + PR

**Nothing is generated, built, committed or pushed yet.**

> Housekeeping: before committing any real media, add `assets/videos/*.mp4`
> raw files to `.gitignore` or store them externally — keep the repo lean.
