"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Cinematic page transition — every route change re-mounts this template, so
 * each page arrives with a soft rise-and-settle (opacity + y only: cheap,
 * GPU-composited, and framer resets the transform to `none` at rest so
 * position:fixed/sticky descendants are unaffected once settled).
 *
 * Hard loads are exempt: until the veil has announced itself
 * (`data-veil-done`), the opening belongs to the veil + hero choreography and
 * the template must not layer a second entrance on top. The check reads the
 * same on the server (no document) and the first client render, so hydration
 * stays consistent; real client-side navigations still get the transition.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const isNavigation =
    typeof document !== "undefined" &&
    document.documentElement.hasAttribute("data-veil-done");

  return (
    <motion.div
      initial={reduce || !isNavigation ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
