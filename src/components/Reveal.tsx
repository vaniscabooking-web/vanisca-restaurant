"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** Semantic element to render (honored, so lists stay valid `ul > li`). */
  as?: "div" | "section" | "li" | "article";
}

// Map the requested tag to its motion component so `as` renders real semantics
// (previously ignored — everything came out as a <div>, producing invalid
// `ul > div` markup where callers passed as="li").
const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  article: motion.article,
} as const;

/**
 * Scroll-triggered reveal animation. Respects prefers-reduced-motion and
 * renders the requested semantic element.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = MOTION_TAGS[as];

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
