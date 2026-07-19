"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { CalendarDays, UtensilsCrossed } from "lucide-react";
import { Link } from "@/i18n/routing";
import HeroMedia from "./HeroMedia";

/**
 * Vanisca Hero — a single cinematic full-bleed frame.
 *
 * The background is the approved candlelit dining-room still (HeroMedia), which
 * is deliberately a **video-ready** layer: when the cinematic film is encoded,
 * set HERO_VIDEO below and the film drops in over the same still (which becomes
 * its poster) — no other change. A slow Ken-Burns push-in mimics the film's
 * motion so the swap is seamless.
 *
 * Layer hierarchy (kept stable for the future video): media → legibility
 * scrims + vignette → copy stage. The copy keeps the word-reveal, i18n
 * (hero.*), routed CTAs, RTL logical props, a fixed 100svh stage (CLS 0) and
 * reduced-motion / no-JS safety — initial states are set in JS, so without
 * scripting the finished hero paints statically.
 */

const HERO_IMAGE = "/media/hero/vanisca-hero-atmosphere.jpg";
// When the approved cinematic film is encoded, set this — it drops in over the
// still with no other change:  const HERO_VIDEO = "/media/hero/vanisca-hero-film.mp4";
const HERO_VIDEO: string | undefined = undefined;

export default function Hero() {
  const t = useTranslations("hero");
  const root = useRef<HTMLElement>(null);

  const words = t("title").split(" ");
  const lineOne = words.slice(0, -1).join(" ");
  const brandWord = words[words.length - 1];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = root.current;
    if (!el) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);

      // Wait for the opening veil to lift so the headline rises through its
      // fade (choreographed handoff). Resolves immediately when the veil has
      // already gone; the timeout is a safety net, never the normal path.
      await new Promise<void>((resolve) => {
        if (document.documentElement.hasAttribute("data-veil-done")) return resolve();
        const done = () => {
          window.clearTimeout(tmr);
          resolve();
        };
        const tmr = window.setTimeout(done, 3000);
        window.addEventListener("vanisca:veil-lift", done, { once: true });
      });
      if (cancelled || !root.current) return;

      const q = gsap.utils.selector(el);
      const rtl = getComputedStyle(el).direction === "rtl";
      const ctx = gsap.context(() => {
        // Initial states in JS so no-JS / reduced-motion paint the finished hero.
        // The media (LCP image) is never hidden — it shows immediately; only the
        // copy animates in, so a stalled timeline can never blank the hero.
        gsap.set(q("[data-media]"), { scale: 1.04 }); // slight overscan for the scroll drift
        gsap.set(q("[data-headline]"), { yPercent: 118 });
        gsap.set(q("[data-rule]"), {
          scaleX: 0,
          transformOrigin: rtl ? "100% 50%" : "0% 50%",
        });
        gsap.set(q("[data-soft]"), { autoAlpha: 0, y: 24 });

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.to(q("[data-headline]"), { yPercent: 0, duration: 1.25, stagger: 0.14 }, 0.15)
          .to(q("[data-rule]"), { scaleX: 1, duration: 1.0, ease: "power3.inOut" }, 0.7)
          .to(q("[data-soft]"), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.85);

        // Slow Ken-Burns push-in on scroll (mimics the future film) + copy drift.
        gsap.to(q("[data-media]"), {
          scale: 1.12,
          yPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
        });
        gsap.to(q("[data-stage]"), {
          yPercent: -6,
          autoAlpha: 0.5,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      }, el);

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section ref={root} className="relative h-[100svh] w-full overflow-hidden bg-charcoal-950">
      {/* ——— Layer 0 · cinematic media (image now, video-ready) ——— */}
      <div data-media className="absolute inset-0 will-change-transform">
        <HeroMedia image={HERO_IMAGE} video={HERO_VIDEO} />
      </div>

      {/* ——— Layer 1 · candle-glow ambience + legibility scrims ——— */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="hero-glow absolute inset-0 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/35 to-charcoal-950/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/75 via-charcoal-950/10 to-transparent rtl:bg-gradient-to-l" />
        <div className="absolute inset-0 shadow-[inset_0_0_180px_50px_rgba(13,11,9,0.6)]" />
      </div>

      {/* ——— Layer 2 · copy stage ——— */}
      <div data-stage className="relative flex h-full flex-col justify-between">
        <div className="container-px pt-28 sm:pt-32">
          <span data-soft className="eyebrow">
            {t("eyebrow")}
          </span>
        </div>

        <div className="container-px">
          <h1 className="heading-display text-shadow-luxe text-balance font-medium leading-[0.94] text-cream">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span
                data-headline
                className="block text-[clamp(2.6rem,7.5vw,6.5rem)] will-change-transform"
              >
                {lineOne}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.14em] -mb-[0.1em] ps-[6%] sm:ps-[12%]">
              <span
                data-headline
                className="block text-[clamp(3.4rem,10vw,9rem)] italic text-gradient-gold will-change-transform"
              >
                {brandWord}
              </span>
            </span>
          </h1>
        </div>

        <div className="container-px pb-16 sm:pb-14">
          <span data-rule aria-hidden="true" className="rule-gold mb-6 block w-24" />
          <p
            data-soft
            className="max-w-md text-pretty text-sm font-light leading-relaxed text-cream/80 sm:text-base"
          >
            {t("subtitle")}
          </p>
          <div data-soft className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link href="/reservation" className="btn-primary w-full sm:w-auto">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {t("ctaReserve")}
            </Link>
            <Link href="/menu" className="btn-outline w-full sm:w-auto">
              <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
              {t("ctaMenu")}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue — dot descending a hairline track (calm, never bouncy) */}
      <div data-soft aria-hidden="true" className="absolute bottom-6 end-6 sm:end-10">
        <span className="relative block h-12 w-px bg-gold/25">
          <span className="cue-dot absolute -start-[1.5px] top-0 h-1 w-1 rounded-full bg-gold/90" />
        </span>
      </div>
    </section>
  );
}
