"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import LuxeImage from "./LuxeImage";
import { aboutImage, unsplash } from "@/lib/images";

/**
 * "L'Éditorial" — the About section as a magazine spread.
 *
 * A monumental headline runs the full measure (its closing words set in
 * italic gold), the body opens on a gold drop cap (skipped for Arabic, where
 * connected letters forbid lettrines), and the real numbers close the column
 * as a colophon under a gold hairline. Opposite, two photographs overlap —
 * the room in portrait, the kitchen at work across its corner — revealed by
 * the same charcoal curtains as the hero and drifting at opposite depths on
 * scroll, so the spread reads dimensional.
 *
 * GSAP is imported dynamically (off the critical path); reduced-motion and
 * no-JS get the finished spread statically. Semantic structure (section,
 * h2, dl) and every i18n string are unchanged.
 */

const KITCHEN_IMG = unsplash("1504674900247-0877df9cc836", 900, 72);

export default function About() {
  const t = useTranslations("about");
  const locale = useLocale();
  const root = useRef<HTMLElement>(null);

  const words = t("title").split(" ");
  const lead = words.slice(0, -2).join(" ");
  const closing = words.slice(-2).join(" ");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
  ];

  // Arabic script connects letters — a floated drop cap would sever the word.
  const dropCap =
    locale === "ar"
      ? ""
      : "first-letter:float-start first-letter:me-3 first-letter:font-display first-letter:text-[3.4em] first-letter:font-semibold first-letter:leading-[0.75] first-letter:text-gold";

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

      const q = gsap.utils.selector(el);
      const ctx = gsap.context(() => {
        gsap.set(q("[data-a-word]"), { yPercent: 112 });
        gsap.set(q("[data-a-fade]"), { autoAlpha: 0, y: 26 });
        gsap.set(q("[data-a-curtain]"), { scaleY: 1 });
        gsap.set(q("[data-a-img]"), { scale: 1.18 });

        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: { trigger: el, start: "top 72%", once: true },
        });
        tl.to(q("[data-a-word]"), { yPercent: 0, duration: 1.05, stagger: 0.05 })
          .to(
            q("[data-a-curtain]"),
            { scaleY: 0, duration: 1.25, stagger: 0.18, ease: "power3.inOut" },
            0.15,
          )
          .to(q("[data-a-img]"), { scale: 1.06, duration: 2.2, ease: "power2.out" }, 0.3)
          .to(q("[data-a-fade]"), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.55);

        // Opposite drifts — the spread breathes as it crosses the viewport.
        gsap.to(q("[data-a-main]"), {
          yPercent: 7,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
        gsap.to(q("[data-a-over]"), {
          yPercent: -9,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
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
    <section
      id="about"
      ref={root}
      className="relative overflow-hidden bg-marble py-28 sm:py-36"
    >
      {/* Editorial ghost numeral — the site-wide chapter language */}
      <span
        aria-hidden="true"
        className="heading-display pointer-events-none absolute -top-6 end-4 select-none text-[10rem] font-semibold leading-none text-white/[0.04] sm:text-[16rem]"
      >
        01
      </span>

      <div className="container-px">
        {/* ——— Headline across the full measure ——— */}
        <span data-a-fade className="eyebrow">
          {t("eyebrow")}
        </span>
        <h2 className="heading-display mt-6 max-w-5xl text-balance text-[clamp(2.4rem,5.6vw,4.6rem)] font-medium leading-[1.02] text-cream">
          {lead.split(" ").map((w, i) => (
            <span key={`${w}-${i}`} className="inline">
              <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
                <span data-a-word className="inline-block will-change-transform">
                  {w}
                </span>
              </span>{" "}
            </span>
          ))}
          <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.1em] align-bottom">
            <span data-a-word className="inline-block italic text-gradient-gold will-change-transform">
              {closing}
            </span>
          </span>
        </h2>

        {/* ——— The spread ——— */}
        <div className="mt-16 grid items-start gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          {/* Reading column — drop cap, measured width, colophon */}
          <div className="lg:col-span-5 lg:pt-6">
            <p
              data-a-fade
              className={`max-w-[38ch] text-lg font-light leading-[1.85] text-cream/80 sm:text-xl ${dropCap}`}
            >
              {t("body")}
            </p>

            <span
              data-a-fade
              aria-hidden="true"
              className="mt-12 block h-px w-full max-w-sm bg-gradient-to-r from-gold/50 via-gold/20 to-transparent"
            />

            <dl className="mt-8 grid max-w-sm grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label} data-a-fade>
                  <dt className="heading-display text-3xl font-semibold italic tabular-nums text-gradient-gold sm:text-4xl">
                    {s.value}
                  </dt>
                  <dd className="mt-2 text-[0.62rem] uppercase tracking-[0.22em] text-cream/50">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Layered photography — the room, and the kitchen across its corner */}
          <div className="relative pb-16 lg:col-span-6 lg:col-start-7 lg:pb-20">
            {/* Offset gold frame behind the portrait */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-5 end-2 hidden h-2/3 w-2/3 rounded-3xl border border-gold/20 sm:block"
            />

            <figure className="relative overflow-hidden rounded-3xl border border-white/10 shadow-luxe">
              <div className="relative aspect-[4/5]">
                <div data-a-main className="absolute inset-0 will-change-transform">
                  <div data-a-img className="absolute inset-0">
                    <LuxeImage
                      src={aboutImage}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 46vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent"
                />
                <figcaption className="absolute bottom-5 end-6 text-end">
                  <span className="heading-display text-3xl font-semibold text-cream">
                    Vanisca
                  </span>
                  <span className="mt-1 block text-[0.58rem] uppercase tracking-[0.42em] text-gold/90">
                    Agadir
                  </span>
                </figcaption>
                {/* Charcoal curtain — same reveal language as the hero */}
                <div
                  data-a-curtain
                  aria-hidden="true"
                  className="absolute inset-0 origin-top scale-y-0 bg-charcoal-950 will-change-transform"
                />
              </div>
            </figure>

            {/* The kitchen, overlapping the portrait's corner */}
            <figure className="absolute -bottom-0 start-0 w-[52%] max-w-xs overflow-hidden rounded-2xl border border-gold/25 shadow-luxe sm:-start-6 lg:-start-10">
              <div className="relative aspect-[4/3]">
                <div data-a-over className="absolute inset-0 will-change-transform">
                  <div data-a-img className="absolute inset-0">
                    <LuxeImage
                      src={KITCHEN_IMG}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 52vw, 22vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-charcoal-950/20"
                />
                <div
                  data-a-curtain
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-charcoal-950 will-change-transform"
                />
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
