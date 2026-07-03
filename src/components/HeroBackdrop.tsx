"use client";

import { useEffect, useRef, useMemo } from "react";

/**
 * Cinematic hero background — a pure motion layer (no stock photography):
 *  - deep charcoal base with the site-wide 3D scene reading through it
 *  - luxury "aurora" light-fields (blurred, screen-blended, on-palette) that
 *    drift slowly to give the hero living depth
 *  - gentle pointer depth-parallax on the light-fields (desktop, motion-safe)
 *  - floating golden dust motes + soft warm light sheen
 *  - vignette + bottom blend so overlay text stays perfectly readable
 * All motion is disabled by the global prefers-reduced-motion override, which
 * leaves an elegant static gradient behind.
 */

// Deterministic PRNG so SSR and client render identical dust positions.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Mote {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

function useMotes(count = 26): Mote[] {
  return useMemo(() => {
    const rand = mulberry32(42);
    return Array.from({ length: count }, () => ({
      left: rand() * 100,
      top: 20 + rand() * 74,
      size: 1.5 + rand() * 2.5,
      delay: rand() * 14,
      duration: 10 + rand() * 12,
      opacity: 0.25 + rand() * 0.4,
    }));
  }, [count]);
}

export default function HeroBackdrop() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const motes = useMotes();

  // Gentle depth parallax toward the pointer (fine pointers, motion-safe only).
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 30;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 22;
    };

    const tick = () => {
      const c = current.current;
      const t = target.current;
      c.x += (t.x - c.x) * 0.04;
      c.y += (t.y - c.y) * 0.04;
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(${c.x.toFixed(
          2,
        )}px, ${c.y.toFixed(2)}px, 0)`;
      }
      frame.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div className="hero-open absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Translucent scrim — darkens top (under the nav) and bottom (for the
          blend) while staying clear through the middle so the fixed 3D dining
          scene reads softly behind the glass card. */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/80 via-charcoal-950/40 to-charcoal-950/90" />

      {/* Luxury aurora light-fields with gentle pointer parallax for depth. */}
      <div ref={parallaxRef} className="absolute inset-0">
        <div className="hero-aurora hero-aurora-1" />
        <div className="hero-aurora hero-aurora-2" />
        <div className="hero-aurora hero-aurora-3" />
      </div>

      {/* Soft warm light sheen drifting across */}
      <div className="hero-light-shift" />

      {/* Floating golden dust motes */}
      {motes.map((m, i) => (
        <span
          key={i}
          className="hero-dust"
          style={{
            left: `${m.left.toFixed(2)}%`,
            top: `${m.top.toFixed(2)}%`,
            width: `${m.size.toFixed(2)}px`,
            height: `${m.size.toFixed(2)}px`,
            animationDelay: `${m.delay.toFixed(2)}s`,
            animationDuration: `${m.duration.toFixed(2)}s`,
            ["--dust-o" as string]: m.opacity.toFixed(2),
          }}
        />
      ))}

      {/* Fine grain for filmic texture (kept light so it doesn't veil the 3D) */}
      <div className="absolute inset-0 bg-marble opacity-[0.18]" />

      {/* Vignette + bottom blend — keeps the centered UI perfectly readable */}
      <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_45%,transparent_0%,rgba(13,11,9,0.55)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-charcoal-950 to-transparent" />
    </div>
  );
}
