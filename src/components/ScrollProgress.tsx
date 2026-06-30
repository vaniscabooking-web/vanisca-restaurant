"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/**
 * A thin gold reading-progress line at the very top of the viewport.
 * Spring-smoothed for a premium, non-jittery feel; hidden for reduced motion.
 */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gold-gradient"
    />
  );
}
