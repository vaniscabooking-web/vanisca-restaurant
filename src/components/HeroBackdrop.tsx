"use client";

import { useEffect, useRef, useMemo } from "react";
import LuxeImage from "./LuxeImage";

/**
 * Cinematic hero background — a pure background layer (no UI/layout changes):
 *  - hyper-real architectural render as the base (center kept clear for UI)
 *  - slow Ken-Burns push-in + gentle pointer depth-parallax (desktop only)
 *  - floating golden dust motes (CSS, no extra WebGL context)
 *  - soft warm light sheen drifting across (slow blend-screen loop)
 *  - vignette + bottom blend so overlay text stays perfectly readable
 * All motion is disabled by the global prefers-reduced-motion override.
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

function useMotes(count = 22): Mote[] {
  return useMemo(() => {
    const rand = mulberry32(42);
    return Array.from({ length: count }, () => ({
      left: rand() * 100,
      top: 25 + rand() * 70,
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
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 24;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 16;
    };

    const tick = () => {
      const c = current.current;
      const t = target.current;
      c.x += (t.x - c.x) * 0.04;
      c.y += (t.y - c.y) * 0.04;
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(${c.x.toFixed(
          2,
        )}px, ${c.y.toFixed(2)}px, 0) scale(1.06)`;
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
      {/* Base render with Ken-Burns; parallax wrapper slightly overscaled so
          the eased translation never exposes edges. */}
      <div ref={parallaxRef} className="absolute inset-0 scale-[1.06]">
        <LuxeImage
          src="/hero-cinematic.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="h-full w-full object-cover motion-safe:animate-ken-burns"
          fallbackTone="from-[#2a2018] via-[#171310] to-[#0d0b09]"
        />
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

      {/* Vignette + bottom blend — keeps the centered UI perfectly readable */}
      <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_50%,transparent_0%,rgba(13,11,9,0.4)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-charcoal-950 to-transparent" />
    </div>
  );
}
