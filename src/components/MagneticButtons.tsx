"use client";

import { useEffect } from "react";

/**
 * Magnetic pull for every `.btn-primary` / `.btn-outline` on the page — one
 * delegated listener, no per-button React state. The offset is written to the
 * CSS `translate` property, which composes with Tailwind's `transform`-based
 * hover lift instead of overriding it. Fine pointers + motion-safe only.
 */

const SELECTOR = ".btn-primary, .btn-outline";
const STRENGTH = 0.22;
const MAX = 6; // px

export default function MagneticButtons() {
  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    let el: HTMLElement | null = null;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const x = Math.max(-MAX, Math.min(MAX, dx * STRENGTH));
      const y = Math.max(-MAX, Math.min(MAX, dy * STRENGTH));
      cancelAnimationFrame(raf);
      const target = el;
      raf = requestAnimationFrame(() => {
        target.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      });
    };

    const release = () => {
      if (!el) return;
      cancelAnimationFrame(raf);
      el.style.transition = "translate .45s cubic-bezier(.22,1,.36,1)";
      el.style.translate = "0px 0px";
      const cooled = el;
      window.setTimeout(() => {
        cooled.style.transition = "";
        cooled.style.translate = "";
      }, 460);
      el = null;
    };

    const onOver = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest<HTMLElement>(SELECTOR);
      if (!hit || hit === el) return;
      if (el) release();
      el = hit;
      el.style.transition = "";
    };

    const onOut = (e: PointerEvent) => {
      if (!el) return;
      const to = e.relatedTarget as Element | null;
      if (!to || !el.contains(to)) release();
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
