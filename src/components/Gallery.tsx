"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Reveal from "./Reveal";
import LuxeImage from "./LuxeImage";
import { galleryPool, unsplash } from "@/lib/images";

interface Tile {
  id: string;
  label: string;
  src: string;
  full: string;
  tall?: boolean;
}

const LABELS = [
  "Salle & lumière",
  "Dressage",
  "Ambiance",
  "Cuisine ouverte",
  "Fruits de mer",
  "Pâtes fraîches",
  "L'expérience",
  "Douceurs",
];

const tiles: Tile[] = galleryPool.map((g, i) => ({
  id: g.id,
  label: LABELS[i] ?? "Vanisca",
  src: unsplash(g.id, 700),
  full: unsplash(g.id, 1600, 78),
  tall: i === 0 || i === 3,
}));

function GalleryTile({ tile, onOpen }: { tile: Tile; onOpen: (t: Tile) => void }) {
  const span = tile.tall ? "aspect-[3/4]" : "aspect-[4/3]";
  return (
    <button
      type="button"
      onClick={() => onOpen(tile)}
      className={`group relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-luxe ${span}`}
      aria-label={tile.label}
    >
      <LuxeImage
        src={tile.src}
        alt={tile.label}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute bottom-4 start-4 translate-y-2 text-sm font-medium tracking-wide text-cream opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        {tile.label}
      </span>
    </button>
  );
}

export default function Gallery({ limit }: { limit?: number }) {
  const shown = limit ? tiles.slice(0, limit) : tiles;
  const [active, setActive] = useState<Tile | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {shown.map((tile, i) => (
          <Reveal
            key={tile.id}
            delay={(i % 4) * 0.06}
            className={tile.tall ? "row-span-1 sm:row-span-2" : ""}
          >
            <GalleryTile tile={tile} onOpen={setActive} />
          </Reveal>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
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
            className="relative aspect-[3/2] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 shadow-luxe"
            onClick={(e) => e.stopPropagation()}
          >
            <LuxeImage src={active.full} alt={active.label} fill className="object-cover" />
            <span className="absolute bottom-5 start-6 heading-display text-2xl text-cream">
              {active.label}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
