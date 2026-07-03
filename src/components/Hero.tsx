"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { CalendarDays, UtensilsCrossed } from "lucide-react";
import { Link } from "@/i18n/routing";
import HeroBackdrop from "./HeroBackdrop";

/**
 * Full-screen hero over the site-wide 3D background.
 *
 * The animated 3D Scene is mounted globally as a fixed layer behind the whole
 * site (see Background3D in the locale layout); this section stays transparent
 * and layers a pure-motion HeroBackdrop (aurora light-fields) — one WebGL
 * context total. Headline arrives as a cinematic word-by-word blur reveal.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE },
  },
};

const titleGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE },
  },
};

export default function Hero() {
  const t = useTranslations("hero");
  const reduce = useReducedMotion();
  const words = t("title").split(" ");

  return (
    <section className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden">
      {/* Cinematic animated background layer (motion only — no stock photo) */}
      <HeroBackdrop />

      {/* Glass UI */}
      <div className="container-px">
        <motion.div
          variants={reduce ? undefined : container}
          initial={reduce ? false : "hidden"}
          animate={reduce ? undefined : "show"}
          className="mx-auto max-w-3xl rounded-[1.75rem] border border-white/15 bg-white/[0.055] p-8 text-center shadow-[0_30px_90px_-30px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-12"
        >
          <motion.span variants={reduce ? undefined : item} className="eyebrow justify-center">
            {t("eyebrow")}
          </motion.span>

          <motion.h1
            variants={reduce ? undefined : titleGroup}
            className="heading-display text-shadow-luxe mt-5 text-balance text-[2.6rem] font-semibold leading-[1.05] text-white sm:text-6xl md:text-7xl"
          >
            {words.map((w, i) => (
              <motion.span
                key={`${w}-${i}`}
                variants={reduce ? undefined : word}
                className="inline-block"
              >
                {w}
                {i < words.length - 1 ? " " : ""}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            variants={reduce ? undefined : item}
            className="mx-auto mt-5 max-w-xl text-pretty text-base font-light text-white/75 sm:text-lg"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            variants={reduce ? undefined : item}
            className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/reservation" className="btn-primary w-full sm:w-auto">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {t("ctaReserve")}
            </Link>
            <Link href="/menu" className="btn-outline w-full sm:w-auto">
              <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
              {t("ctaMenu")}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Elegant scroll cue */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute inset-x-0 bottom-7 flex justify-center"
        aria-hidden="true"
      >
        <span className="flex h-9 w-[22px] items-start justify-center rounded-full border border-gold/40 p-1.5">
          <span className="h-2 w-0.5 rounded-full bg-gold/80 motion-safe:animate-bounce" />
        </span>
      </motion.div>
    </section>
  );
}
