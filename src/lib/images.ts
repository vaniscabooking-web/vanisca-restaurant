/**
 * Curated royalty-free photography (Unsplash), verified to resolve, mapped to
 * sections and menu categories. Every URL is served through next/image (which
 * optimizes + lazy-loads it) and every consumer falls back to an elegant
 * gradient if a photo ever fails to load — so the site can never show a broken
 * image. IDs are stable Unsplash photo IDs.
 */

import dishImagesData from "@/data/dish-images.json";

const BASE = "https://images.unsplash.com/photo-";

/** Build an optimized Unsplash URL at a target width/quality. */
export function unsplash(id: string, w = 1200, q = 68): string {
  return `${BASE}${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

// Verified photo IDs (all return HTTP 200).
const IMG = {
  interior1: "1414235077428-338989a2e8c0",
  interior2: "1517248135467-4c7edcad34c4",
  interior3: "1555396273-367ea4eb4db5",
  kitchen: "1504674900247-0877df9cc836",
  gourmet: "1600891964599-f61ba0e24092",
  darkfood: "1476124369491-e7addf5db371",
  grill: "1544025162-d76694265947",
  plate: "1481931098730-318b6f776db0",
  salad: "1540189549336-e6e99c3679fe",
  pasta: "1473093295043-cdd812d0e601",
  berries: "1432139555190-58524dae6a55",
  flatlay: "1551218808-94e220e084d2",
  food2: "1424847651672-bf20a4b0982b",
  pastry: "1533777324565-a040eb52facd",
  healthy: "1546069901-ba9599a7e63c",
  breakfast: "1567620905732-2d1ec7ab7445",
  burger: "1565958011703-44f9829ba187",
  dessert2: "1559339352-11d035aa65de",
  seafood: "1467003909585-2f8a72700288",
  food3: "1559847844-5315695dadae",
} as const;

export const heroImages = [IMG.interior1, IMG.interior2, IMG.kitchen].map((id) =>
  unsplash(id, 1920, 70),
);

export const aboutImage = unsplash(IMG.interior2, 1000, 72);

export const galleryPool: { id: string; label: string }[] = [
  { id: IMG.interior1, label: "gallery.tiles.interior" },
  { id: IMG.gourmet, label: "gallery.tiles.plating" },
  { id: IMG.interior3, label: "gallery.tiles.ambiance" },
  { id: IMG.kitchen, label: "gallery.tiles.kitchen" },
  { id: IMG.seafood, label: "gallery.tiles.seafood" },
  { id: IMG.pasta, label: "gallery.tiles.pasta" },
  { id: IMG.interior2, label: "gallery.tiles.table" },
  { id: IMG.berries, label: "gallery.tiles.dessert" },
];

/** Homepage "signatures" highlight images, keyed to the highlight keys. */
export const highlightImages: Record<string, string> = {
  seafood: unsplash(IMG.seafood, 800),
  pasta: unsplash(IMG.pasta, 800),
  pizza: unsplash(IMG.food2, 800),
  desserts: unsplash(IMG.berries, 800),
};

/** Per-category image pools (2–3 each) reused across dishes for performance. */
const categoryPools: Record<string, string[]> = {
  "starters-cold": [IMG.salad, IMG.healthy, IMG.flatlay],
  "starters-hot": [IMG.seafood, IMG.darkfood, IMG.plate],
  soup: [IMG.darkfood, IMG.plate],
  pasta: [IMG.pasta, IMG.flatlay],
  calzone: [IMG.food2, IMG.breakfast],
  risotto: [IMG.gourmet, IMG.darkfood],
  lasagne: [IMG.flatlay, IMG.pasta],
  meat: [IMG.grill, IMG.burger, IMG.plate],
  chicken: [IMG.gourmet, IMG.plate],
  fish: [IMG.seafood, IMG.grill],
  pizza: [IMG.food2, IMG.breakfast],
  juice: [IMG.healthy, IMG.food3],
  smoothies: [IMG.healthy, IMG.dessert2],
  drinks: [IMG.food3, IMG.interior3],
  desserts: [IMG.berries, IMG.pastry, IMG.dessert2],
};

// Stable string hash → deterministic image pick (same dish → same photo).
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Unique per-dish photography (generated from Pexels, one distinct photo per
 * dish). Falls back to the curated category pool if a dish is not in the map.
 */
const DISH_IMAGES = dishImagesData as Record<string, string>;

/** Premium image URL for a specific dish (unique per dish). */
export function dishImage(categoryId: string, dishId: string, w = 600): string {
  const mapped = DISH_IMAGES[dishId];
  if (mapped) return mapped;
  const pool = categoryPools[categoryId] ?? [IMG.gourmet, IMG.plate];
  return unsplash(pool[hash(dishId) % pool.length], w);
}

/** Category banner image (first of the pool). */
export function categoryImage(categoryId: string, w = 800): string {
  const pool = categoryPools[categoryId] ?? [IMG.gourmet];
  return unsplash(pool[0], w);
}
