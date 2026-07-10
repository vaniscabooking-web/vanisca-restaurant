"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Cinematic page transition — every route change re-mounts this template, so
 * each page arrives with a soft rise-and-settle (opacity + y only: cheap,
 * GPU-composited, and framer resets the transform to `none` at rest so
 * position:fixed/sticky descendants are unaffected once settled).
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
