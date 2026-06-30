"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CalendarDays, UtensilsCrossed, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function Hero() {
  const t = useTranslations("hero");
  const reduce = useReducedMotion();

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Background: warm wood/copper ambiance built from layered gradients */}
      <div className="absolute inset-0 -z-10 bg-charcoal-950" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,#3a2414_0%,#1a1714_45%,#100e0c_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_80%_20%,rgba(200,164,92,0.18)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_15%_80%,rgba(181,118,74,0.16)_0%,transparent_60%)]" />
        {/* Subtle texture */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M0 0h80v80H0z' fill='none'/%3E%3Cpath d='M0 40h80M40 0v80' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-charcoal-950 to-transparent" />
      </div>

      <div className="container-px w-full py-28 text-center">
        <motion.span {...fade(0)} className="eyebrow">
          {t("eyebrow")}
        </motion.span>

        <motion.h1
          {...fade(0.1)}
          className="heading-display mx-auto mt-5 max-w-4xl text-balance text-4xl font-bold leading-tight text-cream sm:text-6xl md:text-7xl"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          {...fade(0.2)}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-cream/75 sm:text-lg"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          {...fade(0.3)}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
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
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute inset-x-0 bottom-6 flex justify-center"
        aria-hidden="true"
      >
        <ChevronDown className="h-6 w-6 animate-bounce text-gold/70" />
      </motion.div>
    </section>
  );
}
