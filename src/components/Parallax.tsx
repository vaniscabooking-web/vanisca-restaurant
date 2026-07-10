"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Subtle scroll-depth parallax: the child drifts vertically as its container
 * crosses the viewport. Pair with an oversized child (e.g. scale-110) inside
 * an overflow-hidden frame so edges never show. Transform-only (GPU) and
 * inert under prefers-reduced-motion.
 */
export default function Parallax({
  children,
  amount = 40,
  className = "",
}: {
  children: ReactNode;
  /** Max drift in px (symmetric: +amount → -amount across the scroll). */
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
