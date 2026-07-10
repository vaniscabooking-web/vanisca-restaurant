"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
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

const EASE = [0.22, 1, 0.36, 1] as const;

const tiles: Tile[] = galleryPool.map((g, i) => ({
  id: g.id,
  label: LABELS[i] ?? "Vanisca",
  src: unsplash(g.id, 700),
  full: unsplash(g.id, 1600, 78),
  tall: i === 0 || i === 3,
}));

function GalleryTile({ tile, onOpen }: { tile: Tile; onOpen: () => void }) {
  const span = tile.tall ? "aspect-[3/4]" : "aspect-[4/3]";
  return (
    <button
      type="button"
      onClick={onOpen}
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
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  const step = useCallback(
    (dir: 1 | -1) =>
      setActiveIdx((idx) =>
        idx === null ? idx : (idx + dir + shown.length) % shown.length,
      ),
    [shown.length],
  );

  // The cinematic lightbox is also a keyboard citizen: Esc closes, arrows browse.
  const open = activeIdx !== null;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIdx(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus({ preventScroll: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const active = activeIdx === null ? null : shown[activeIdx];

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {shown.map((tile, i) => (
          <Reveal
            key={tile.id}
            delay={(i % 4) * 0.06}
            className={tile.tall ? "row-span-1 sm:row-span-2" : ""}
          >
            <GalleryTile tile={tile} onOpen={() => setActiveIdx(i)} />
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={active.label}
            onClick={() => setActiveIdx(null)}
          >
            <button
              ref={closeRef}
              type="button"
              className="absolute end-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-cream transition-colors hover:border-gold hover:text-gold"
              aria-label="Close"
              onClick={() => setActiveIdx(null)}
            >
              <X className="h-5 w-5" />
            </button>

            {shown.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  className="absolute start-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold sm:inline-flex"
                >
                  <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  className="absolute end-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold sm:inline-flex"
                >
                  <ChevronRight className="h-6 w-6 rtl:rotate-180" />
                </button>
              </>
            )}

            <motion.div
              key={active.id}
              initial={reduce ? false : { opacity: 0, scale: 0.965, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="relative aspect-[3/2] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 shadow-luxe"
              onClick={(e) => e.stopPropagation()}
            >
              <LuxeImage src={active.full} alt={active.label} fill className="object-cover" />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent"
                aria-hidden="true"
              />
              <span className="absolute bottom-5 start-6 heading-display text-2xl text-cream">
                {active.label}
              </span>
              <span className="absolute bottom-6 end-6 text-[0.65rem] uppercase tracking-[0.3em] text-cream/70 tabular-nums">
                {(activeIdx ?? 0) + 1} / {shown.length}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
