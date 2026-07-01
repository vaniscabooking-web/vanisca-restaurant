/**
 * One-time generator: assigns a GLOBALLY UNIQUE Pexels photo to every dish and
 * writes src/data/dish-images.json. No photo is reused across the menu.
 *
 * Run:  PEXELS_API_KEY=xxxxx node --experimental-strip-types scripts/gen-dish-images.ts
 * The API key is read from the environment and is never written to disk.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { menu } from "../src/data/menu.ts";

const KEY = process.env.PEXELS_API_KEY;
if (!KEY) {
  console.error("Missing PEXELS_API_KEY env var.");
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));

interface PexelsPhoto {
  id: number;
  alt: string | null;
  photographer: string;
  photographer_url: string;
  src: { large2x: string; large: string; medium: string };
}

// Appetizing, on-theme search queries per menu category.
const CATEGORY_QUERIES: Record<string, string[]> = {
  "starters-cold": ["gourmet salad plate", "fresh appetizer starter"],
  "starters-hot": ["hot appetizer seafood", "gourmet tapas starter"],
  soup: ["gourmet soup bowl", "creamy soup restaurant"],
  pasta: ["italian pasta dish", "pasta plate gourmet"],
  calzone: ["calzone", "folded pizza"],
  risotto: ["risotto", "creamy risotto plate"],
  lasagne: ["lasagna", "baked pasta gratin"],
  meat: ["grilled steak plate", "gourmet meat dish"],
  chicken: ["gourmet chicken dish", "roast chicken plate"],
  fish: ["grilled fish plate", "seafood fine dining"],
  pizza: ["gourmet pizza", "wood fired pizza"],
  juice: ["fresh fruit juice glass", "cold pressed juice"],
  smoothies: ["fruit smoothie glass", "smoothie drink"],
  drinks: ["restaurant beverage glass", "sparkling water drink"],
  desserts: ["plated dessert gourmet", "fine dining dessert"],
};

const GENERAL_QUERIES = [
  "fine dining plated food",
  "gourmet restaurant dish",
  "michelin star plating",
];

async function search(query: string, page = 1): Promise<PexelsPhoto[]> {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
    query,
  )}&per_page=80&page=${page}&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: KEY! } });
  if (!res.ok) {
    console.warn(`  ! Pexels ${res.status} for "${query}"`);
    return [];
  }
  const data = (await res.json()) as { photos: PexelsPhoto[] };
  return data.photos ?? [];
}

const used = new Set<number>();
const out: Record<
  string,
  { src: string; alt: string; credit: string; creditUrl: string }
> = {};

// Pre-fetch a general overflow pool.
const general: PexelsPhoto[] = [];
for (const q of GENERAL_QUERIES) general.push(...(await search(q)));

function pickUnused(pool: PexelsPhoto[]): PexelsPhoto | undefined {
  return pool.find((p) => !used.has(p.id));
}

let assigned = 0;
let missing = 0;

for (const cat of menu) {
  const queries = CATEGORY_QUERIES[cat.id] ?? ["gourmet food"];
  const pool: PexelsPhoto[] = [];
  for (const q of queries) {
    pool.push(...(await search(q)));
    if (pool.length >= cat.items.length + 25) break;
  }

  for (const item of cat.items) {
    let photo = pickUnused(pool) ?? pickUnused(general);
    if (!photo) {
      // Extend the general pool with more pages if we ran dry.
      general.push(...(await search(GENERAL_QUERIES[0], 2)));
      photo = pickUnused(general);
    }
    if (photo) {
      used.add(photo.id);
      out[item.id] = {
        src: photo.src.large2x || photo.src.large,
        alt: photo.alt || item.name.en,
        credit: photo.photographer,
        creditUrl: photo.photographer_url,
      };
      assigned++;
    } else {
      missing++;
      console.warn(`  ! No image for ${cat.id}/${item.id}`);
    }
  }
  console.log(`${cat.id}: ${cat.items.length} dishes`);
}

const target = resolve(__dirname, "../src/data/dish-images.json");
writeFileSync(target, JSON.stringify(out, null, 2) + "\n");
console.log(
  `\nDone. Assigned ${assigned} unique photos (${used.size} distinct), ${missing} missing.`,
);
console.log(`Wrote ${target}`);
