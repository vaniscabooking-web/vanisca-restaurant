"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-[40]"
      aria-hidden="true"
    >
      <Scene />
    </div>
  );
}
