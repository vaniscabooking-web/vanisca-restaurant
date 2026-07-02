"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CalendarDays, UtensilsCrossed, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/routing";
import HeroBackdrop from "./HeroBackdrop";

/**
 * Full-screen hero over the 3D background.
 *
 * The animated 3D Scene is mounted globally as a fixed layer behind the whole
 * site (see Background3D in the locale layout), so this section stays
 * transparent instead of mounting a second <Scene /> — same visual as an
 * inline 3D background, without running two WebGL contexts.
 */
export default function Hero() {
  const t = useTranslations("hero");
  const reduce = useReducedMotion();

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      {/* Cinematic animated background layer (background only — UI untouched) */}
      <HeroBackdrop />

      {/* Glass UI */}
      <div className="container-px flex h-full items-center justify-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl rounded-3xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-xl sm:p-10"
        >
          <span className="eyebrow justify-center">{t("eyebrow")}</span>

          <h1 className="heading-display text-shadow-luxe mt-4 text-balance text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
            {t("title")}
          </h1>

          <p className="mt-4 text-pretty text-base font-light text-white/70 sm:text-lg">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/reservation" className="btn-primary w-full sm:w-auto">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {t("ctaReserve")}
            </Link>
            <Link href="/menu" className="btn-outline w-full sm:w-auto">
              <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
              {t("ctaMenu")}
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute inset-x-0 bottom-6 flex justify-center"
        aria-hidden="true"
      >
        <ChevronDown className="h-6 w-6 animate-bounce text-gold/70" />
      </motion.div>
    </section>
  );
}
