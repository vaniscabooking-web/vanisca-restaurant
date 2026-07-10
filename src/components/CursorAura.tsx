"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Golden cursor aura — a faint candlelight glow that trails the pointer, plus
 * a hairline gold ring that eases behind it and swells over interactive
 * elements. Purely additive: the native cursor is never hidden, touch devices
 * and reduced-motion users never mount it. Two fixed nodes + one rAF lerp.
 */

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label";

export default function CursorAura() {
  const [enabled, setEnabled] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const glow = glowRef.current;
    const ring = ringRef.current;
    if (!glow || !ring) return;

    let tx = -100;
    let ty = -100;
    let rx = -100;
    let ry = -100;
    let scale = 1;
    let targetScale = 1;
    let visible = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        rx = tx;
        ry = ty;
        glow.style.opacity = "1";
        ring.style.opacity = "1";
      }
      targetScale = (e.target as Element | null)?.closest(INTERACTIVE) ? 1.8 : 1;
    };
    const onLeave = () => {
      visible = false;
      glow.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const tick = () => {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      scale += (targetScale - scale) * 0.14;
      glow.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%,-50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%,-50%) scale(${scale.toFixed(3)})`;
      raf = requestAnimationFrame(tick);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[75]">
      {/* Soft candlelight glow riding the cursor */}
      <div
        ref={glowRef}
        className="absolute h-40 w-40 rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle, rgba(200,164,92,0.10) 0%, rgba(200,164,92,0.04) 40%, transparent 70%)",
        }}
      />
      {/* Hairline gold ring easing behind it */}
      <div
        ref={ringRef}
        className="absolute h-7 w-7 rounded-full border border-gold/50 opacity-0 transition-opacity duration-300"
      />
    </div>
  );
}
