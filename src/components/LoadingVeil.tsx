"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Premium opening veil — a once-per-session brand reveal.
 *
 * Server-renders as a plain charcoal cover (so the very first paint is the
 * same darkness the hero opens from — no flash of unstyled page). After
 * hydration the wordmark letters arrive with a blur reveal over a drawn gold
 * hairline, then the veil lifts to hand over to the hero's own light-opening.
 * Repeat visits in the same session (and reduced-motion users) skip straight
 * to the page; without JS a <noscript> style removes the veil entirely.
 */

const KEY = "vanisca-veil";
const EASE = [0.22, 1, 0.36, 1] as const;
const LETTERS = "VANISCA".split("");

export default function LoadingVeil() {
  const [phase, setPhase] = useState<"boot" | "play" | "done">("boot");
  const reduce = useReducedMotion();

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* storage unavailable — play once anyway */
    }
    if (seen || reduce) {
      setPhase("done");
      return;
    }
    setPhase("play");
    const tmr = window.setTimeout(() => setPhase("done"), 1900);
    return () => window.clearTimeout(tmr);
  }, [reduce]);

  return (
    <>
      <noscript>
        <style>{`#brand-veil{display:none}`}</style>
      </noscript>
      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            id="brand-veil"
            aria-hidden="true"
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#0d0b09]"
            exit={{ opacity: 0, transition: { duration: 0.7, ease: EASE } }}
          >
            {phase === "play" && (
              <>
                <div className="flex overflow-hidden">
                  {LETTERS.map((l, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.7, delay: 0.1 + i * 0.055, ease: EASE }}
                      className="heading-display latin-brand text-4xl font-semibold tracking-[0.18em] text-cream sm:text-5xl"
                    >
                      {l}
                    </motion.span>
                  ))}
                </div>
                <motion.span
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
                  className="mt-5 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent"
                />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
                  className="mt-4 text-[0.6rem] uppercase tracking-[0.5em] text-gold/80"
                >
                  Agadir
                </motion.span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
