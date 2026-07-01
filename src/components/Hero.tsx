"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CalendarDays, UtensilsCrossed, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/routing";
import LuxeImage from "./LuxeImage";
import HeroCanvas from "./three/HeroCanvas";
import { heroImages } from "@/lib/images";

export default function Hero() {
  const t = useTranslations("hero");
  const reduce = useReducedMotion();

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Cinematic photographic background with a slow Ken-Burns push-in */}
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <LuxeImage
          src={heroImages[0]}
          alt=""
          fill
          priority
          sizes="100vw"
          className="h-full w-full object-cover motion-safe:animate-ken-burns"
          fallbackTone="from-[#3a2a18] via-[#171310] to-[#0d0b09]"
        />
      </div>

      {/* Cinematic colour grade + vignette + contrast scrims */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(13,11,9,0.35)_0%,rgba(13,11,9,0.62)_55%,rgba(13,11,9,0.92)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-charcoal-950/70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 shadow-[inset_0_0_180px_60px_rgba(0,0,0,0.75)]"
        aria-hidden="true"
      />

      {/* Subtle 3D metallic shimmer (desktop, motion-safe) — kept faint for elegance */}
      <div className="absolute inset-0 -z-[5] opacity-40 mix-blend-screen" aria-hidden="true">
        <HeroCanvas />
      </div>

      <div className="container-px w-full py-28 text-center">
        <motion.span {...fade(0)} className="eyebrow mx-auto justify-center">
          {t("eyebrow")}
        </motion.span>

        <motion.h1
          {...fade(0.12)}
          className="heading-display text-shadow-luxe mx-auto mt-6 max-w-4xl text-balance text-5xl font-medium leading-[1.05] text-cream sm:text-7xl md:text-[5.5rem]"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          {...fade(0.24)}
          className="mx-auto mt-7 max-w-2xl text-pretty text-base font-light leading-relaxed text-cream/80 sm:text-lg"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          {...fade(0.36)}
          className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row"
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
        transition={{ delay: 1.1, duration: 1 }}
        className="absolute inset-x-0 bottom-6 flex justify-center"
        aria-hidden="true"
      >
        <ChevronDown className="h-6 w-6 animate-bounce text-gold/70" />
      </motion.div>
    </section>
  );
}
