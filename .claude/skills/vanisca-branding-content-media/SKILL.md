---
name: vanisca-branding-content-media
description: >-
  Branding, content strategy, visual identity and media production rules
  for Vanisca Restaurant. Use this skill whenever creating or improving
  brand identity, copywriting, multilingual content, menu descriptions,
  AI image prompts, AI video prompts, photography direction, gallery assets,
  typography, icons, logo usage, social media visuals or marketing materials.
---

# Vanisca — Branding, Content & Media

Grounded in the project as built (`messages/{fr,en,ar}.json`, `src/data/menu.ts`,
`src/lib/images.ts`, `src/lib/site.ts`, the components). Vanisca is a real
restaurant in **Agadir, Morocco** — its identity is understated luxury, and its
content is bound by one immutable rule.

---

## The immutable brand rule

**Only authentic, verifiable content.** Never invent chefs, stories, awards,
opening claims, addresses, or history. Earlier work explicitly removed
fabricated copy — do not reintroduce it. Everything the site states must be true
of the real restaurant or derivable from real data (the menu, the city, the
verified contact details and hours). When unsure, omit rather than embellish.

---

## Identity

- **Name:** Vanisca Restaurant Agadir · **short:** Vanisca · **city:** Agadir · **country:** Maroc.
- **Wordmark (not an image logo):** `VANISCA` set in Cormorant Garamond, letter-spaced,
  over a small uppercase gold `AGADIR` eyebrow (tracking ~0.5em). On hover the
  eyebrow's tracking blooms slightly. Treat this lockup like a fashion house — do
  not restyle it casually.
- **Positioning:** Mediterranean fine dining — pâtes fraîches, fruits de mer,
  pizzas, risottos. Cinematic, editorial, timeless; never a generic parlor.
- **Palette / type / icons:** governed by `vanisca-luxury-uiux-motion`
  (charcoal + gold, Cormorant/Inter/Cairo, `lucide-react` icons). Branding must
  stay inside that system.

---

## Voice & copywriting

- Tone: warm, confident, refined, quietly premium. Short, elegant lines; active
  voice; specific over clever. No hype, no exclamation-mark marketing.
- Eyebrows are uppercase and spaced (e.g. `RESTAURANT · AGADIR`); headlines are
  serif and balanced; body copy breathes.
- A control says exactly what it does ("Réserver une table"). Errors explain
  what went wrong and how to fix it — no apologies, no vagueness.
- Match the reader; keep the three languages equivalent in meaning and register,
  never a rushed machine translation.

---

## Multilingual content (source of truth: `messages/`)

- Three locales — **`fr` (default)**, `en`, `ar` (RTL, Cairo). Every visible
  string lives in `messages/{fr,en,ar}.json` under the same key in all three.
- **Never hardcode UI text in components** — always a translation key. Adding a
  string means adding it to all three files (a missing key throws
  `MISSING_MESSAGE`). Verify Arabic reads correctly and mirrors in RTL.
- Namespaces mirror the site: `nav, hero, about, highlights, houseSelection,
  menu, gallery, reservation, contact, cta, findUs, footer, common, meta,
  notFound`.

---

## Menu content (`src/data/menu.ts` — single source of truth)

- ~105 real dishes across 15 categories (entrées froides/chaudes, soupes, pâtes,
  calzone, risotto, lasagnes, viandes, volaille, poissons, pizzas, jus,
  smoothies, boissons, desserts). Prices in **DH** (dirham), `tabular-nums`.
- Each dish: stable `id`, trilingual `name` (+ optional `description`), `price`,
  optional `tags` (`signature | seafood | vegetarian | spicy`). `signatureItems`
  drives the homepage "House Selection".
- Real signatures include Salade Vanisca, Risotto gambas, Filet mignon de veau,
  Assortiment de poisson grillé Vanisca. **Never invent dishes, prices, or
  translations** — edit the data file, keep ids stable, keep all three languages in step.

---

## Photography & media (current reality)

- Imagery is **curated royalty-free stock** (Unsplash for sections/gallery;
  Pexels for unique per-dish photos in `src/data/dish-images.json`), served
  through `next/image`/`LuxeImage` with a graceful gradient fallback. The menu
  carries a discreet Pexels credit. Remote hosts are allowlisted in `next.config.mjs`.
- Gallery tiles use French mood labels ("Salle & lumière", "Dressage",
  "Ambiance", "Cuisine ouverte"…). Keep labels evocative and true to atmosphere.
- **Documented future step:** replace stock with **real owner photography** of
  the actual restaurant and dishes. When that happens, keep the dark, warm,
  candlelit grade and the existing framing/aspect ratios so layout is unaffected.

### If AI-generated media is ever introduced

There is **no AI media pipeline in this project today**, and the authenticity
rule still governs. Only ever use AI imagery for clearly non-representational,
atmospheric/decorative purposes — never to depict a specific real dish, room, or
person as if it were a photograph of Vanisca. Any generated asset must: match
the charcoal/gold palette and cinematic grade; contain **no baked-in text and no
logos**; carry no third-party marks; and be reviewed and approved before use.
Prefer real photography over generated imagery for anything a guest would read as real.

---

## Social & marketing

- Channels in `src/lib/site.ts`: Instagram + Facebook (linked in nav-mobile,
  footer, contact) and WhatsApp for bookings. Contact: **call `0528202202`**,
  **WhatsApp `0611700033`**, public email `vanisca.restaurant@gmail.com`.
- Marketing visuals inherit the same identity: charcoal + gold, Cormorant
  display, generous negative space, one focal point. No cheap gradients, no neon,
  no template energy.
- Copyright: don't reproduce third-party copyrighted text or imagery; respect
  stock licenses; credit where required (as the menu credits Pexels).
