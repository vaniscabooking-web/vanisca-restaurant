# Vanisca — Brand Kit (media production reference)

Source of truth: the live design system (`tailwind.config.ts`,
`src/app/globals.css`) and `vanisca-luxury-uiux-motion`. Media must match the
site's world — media adapts to the brand, never the reverse.

## Identity

- **Name:** Vanisca Restaurant · **City:** Agadir, Morocco
- **Cuisine (real):** Mediterranean — pâtes fraîches, fruits de mer, pizzas,
  risottos. ~105 dishes / 15 categories. Prices in DH.
- **Wordmark:** `VANISCA` in Cormorant Garamond, letter-spaced, over a small
  gold uppercase `AGADIR` eyebrow. Typographic lockup — no image logo.
- **Positioning:** understated Michelin-level luxury; candlelit, editorial,
  cinematic, calm. Never a parlor template, never loud.
- **Languages:** Français (default) · English · العربية (RTL).

## Palette (exact tokens — grade all media toward these)

| Token | Hex | Media role |
|---|---|---|
| charcoal-950 | `#0d0b09` | the darkness every frame sits in |
| charcoal | `#161311` | secondary shadow tone |
| gold | `#c8a45c` | candle/key light accent |
| gold-light | `#e6cd93` | highlights, rim light |
| gold-dark | `#9c7c3e` | deep metallic shadow |
| brass | `#b08d57` | tableware metals |
| copper | `#b5764a` | warm food tones |
| olive | `#7c845a` | Mediterranean support |
| sand | `#d9caac` | linen, stone, bread tones |
| cream | `#f4eee2` | ceramics, text-light equivalents |

**Grade law:** dark charcoal base, warm gold key light, deep soft shadows,
low-saturation Mediterranean support tones. No neon, no cool blue-teal grades,
no bright white studio looks.

## Typography (site-side — never baked into media)

Cormorant Garamond (display) · Inter (body) · Cairo (Arabic). All words live in
HTML as i18n strings; **media contains zero text**.

## Voice

Warm, confident, refined, quiet. Short elegant lines. Specific over clever.
Authenticity rule: no invented chefs, stories, awards or hours — media suggests
atmosphere; facts come only from real data.

## Atmosphere keywords (for prompts)

candlelit · charcoal & gold · slow steam · linen and brass · Mediterranean
evening · editorial stillness · shallow depth of field · cinematic haze ·
restraint.
