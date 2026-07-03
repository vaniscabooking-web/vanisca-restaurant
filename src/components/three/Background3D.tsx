"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Loaded only in the browser, after hydration — keeps three.js off the
// critical path so it never affects LCP.
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
});

/**
 * Fixed, full-screen 3D background mounted behind all site content. Gated so it
 * only runs where it makes sense (WebGL available, not data-saver). Rendered
 * click-through (pointer-events-none) so it never blocks the UI.
 */
export default function Background3D() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Respect data-saver mode.
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;

    // Require WebGL.
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(
        c.getContext("webgl") || c.getContext("experimental-webgl")
      );
    } catch {
      webgl = false;
    }
    if (webgl) setEnabled(true);
  }, []);

  // Fade the scene in once mounted — the background-appropriate "loader":
  // the dark page base acts as the fallback until the canvas is ready.
  useEffect(() => {
    if (!enabled) return;
    const t = window.setTimeout(() => setVisible(true), 80);
    return () => window.clearTimeout(t);
  }, [enabled]);

  // DSLR rack-focus: fast scrolling softly defocuses the 3D layer, easing
  // back to sharp as motion settles. Desktop fine-pointers, motion-safe only.
  const focusRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!enabled) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let lastY = window.scrollY;
    let lastT = performance.now();
    let blur = 0;
    let raf = 0;
    let running = false;
    const loop = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastY) / Math.max(now - lastT, 1);
      lastY = window.scrollY;
      lastT = now;
      blur += (Math.min(dy * 1.4, 2.2) - blur) * 0.12;
      if (focusRef.current) {
        focusRef.current.style.filter =
          blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "";
      }
      // Sleep once the blur has settled — the scroll listener wakes it back up,
      // so there is no rAF burning CPU/GPU while the page sits idle.
      if (blur > 0.05) {
        raf = requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };
    const onScroll = () => {
      if (running) return;
      running = true;
      lastT = performance.now();
      lastY = window.scrollY;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={focusRef}
      className={`pointer-events-none fixed inset-0 -z-[40] transition-opacity duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      <Scene />
    </div>
  );
}
