"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertia-based scrolling (momentum + resistance). Desktop fine-pointers and
 * motion-safe users only — touch devices keep native scrolling, and
 * prefers-reduced-motion users are never hijacked. Renders nothing.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
