"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import Reveal from "./Reveal";

/**
 * Gallery tiles. Each tile renders a real image when `src` is provided
 * (drop files in /public/gallery and fill the `src` field), otherwise an
 * elegant warm gradient placeholder so the layout is never broken.
 */
export interface GalleryTile {
  id: string;
  label: string;
  /** Optional real image, e.g. "/gallery/salle.jpg". */
  src?: string;
  /** Tailwind gradient classes for the placeholder. */
  tone: string;
  /** Make this tile span two rows on larger screens. */
  tall?: boolean;
}

export const galleryTiles: GalleryTile[] = [
  { id: "facade", label: "Façade", tone: "from-[#3a2414] to-[#100e0c]", tall: true },
  { id: "ceiling", label: "Architecture", tone: "from-[#5a3a1c] to-[#1a1714]" },
  { id: "terrace", label: "Terrasse", tone: "from-[#2a2018] to-[#0d0b09]" },
  { id: "kitchen", label: "Cuisine ouverte", tone: "from-[#6b3f1f] to-[#1a1714]", tall: true },
  { id: "seafood", label: "Fruits de mer", tone: "from-[#4a2e18] to-[#100e0c]" },
  { id: "pasta", label: "Pâtes fraîches", tone: "from-[#3d2814] to-[#1a1714]" },
  { id: "ambiance", label: "Ambiance", tone: "from-[#52331a] to-[#0d0b09]" },
  { id: "dessert", label: "Desserts", tone: "from-[#3a2414] to-[#15110d]" },
];

function Tile({ tile, onOpen }: { tile: GalleryTile; onOpen?: (t: GalleryTile) => void }) {
  const span = tile.tall ? "row-span-2 aspect-[3/4] sm:aspect-auto" : "aspect-[4/3]";
  return (
    <button
      type="button"
      onClick={() => onOpen?.(tile)}
      className={`group relative w-full overflow-hidden rounded-2xl border border-white/10 ${span}`}
      aria-label={tile.label}
    >
      {tile.src ? (
        <Image
          src={tile.src}
          alt={tile.label}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className={`h-full w-full bg-gradient-to-br ${tile.tone} transition-transform duration-500 group-hover:scale-105`}
        >
          <div className="flex h-full items-center justify-center">
            <span className="heading-display text-5xl font-bold text-gold/20">V</span>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="absolute bottom-3 start-4 translate-y-2 text-sm font-medium text-cream opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        {tile.label}
      </span>
    </button>
  );
}

export default function Gallery({ limit }: { limit?: number }) {
  const tiles = limit ? galleryTiles.slice(0, limit) : galleryTiles;
  const [active, setActive] = useState<GalleryTile | null>(null);

  return (
    <>
      <div className="grid auto-rows-[minmax(0,1fr)] grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((tile, i) => (
          <Reveal key={tile.id} delay={(i % 4) * 0.06} className={tile.tall ? "sm:row-span-2" : ""}>
            <Tile tile={tile} onOpen={setActive} />
          </Reveal>
        ))}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur"
          role="dialog"
          aria-modal="true"
          aria-label={active.label}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute end-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-cream"
            aria-label="Close"
            onClick={() => setActive(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {active.src ? (
              <Image src={active.src} alt={active.label} fill className="object-cover" />
            ) : (
              <div className={`h-full w-full bg-gradient-to-br ${active.tone}`}>
                <div className="flex h-full flex-col items-center justify-center gap-3">
                  <span className="heading-display text-7xl font-bold text-gold/30">V</span>
                  <span className="text-sm uppercase tracking-[0.3em] text-cream/60">
                    {active.label}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
