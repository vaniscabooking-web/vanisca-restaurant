"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Three.js is heavy: load it only on the client, after hydration, and only
// when the device is actually a good candidate for WebGL. The hero text
// remains the LCP element regardless of whether this ever mounts.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

function isCapableDevice(): boolean {
  if (typeof window === "undefined") return false;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const wideEnough = window.matchMedia("(min-width: 1024px)").matches;
  // Respect data-saver mode where exposed.
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const saveData = conn?.saveData === true;
  return !prefersReduced && finePointer && wideEnough && !saveData;
}

export default function HeroCanvas() {
  const [enabled, setEnabled] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Defer the decision to idle time so it never competes with first paint.
    const decide = () => setEnabled(isCapableDevice());
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
    };
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(decide);
    } else {
      const id = window.setTimeout(decide, 200);
      return () => window.clearTimeout(id);
    }
  }, []);

  // Fade in once the scene is mounted (guaranteed, keyframe-free).
  useEffect(() => {
    if (!enabled) return;
    const id = window.setTimeout(() => setShown(true), 50);
    return () => window.clearTimeout(id);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-[5] transition-opacity duration-1000 ease-out ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Offset the form to the side so it frames the text rather than fighting it. */}
      <div className="absolute end-[-6%] top-1/2 h-[42rem] w-[42rem] -translate-y-1/2 sm:end-[2%]">
        <HeroScene />
      </div>
    </div>
  );
}
