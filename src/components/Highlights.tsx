"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Fish, Wheat, Pizza, IceCream2 } from "lucide-react";
import SectionHeading from "./SectionHeading";
import LuxeImage from "./LuxeImage";
import { highlightImages } from "@/lib/images";

/**
 * "Les Signatures" — the house signatures as a cinematic editorial mosaic:
 * one tall feature plate beside a trio of full-bleed tiles, all brought into
 * the Hero/About family by the same charcoal-curtain reveal (GSAP, dynamically
 * imported, scrubbed on scroll-in) and a gold accent-line that draws on hover.
 *
 * No numbered markers on the four dishes — they are a set, not a sequence.
 * Reduced-motion / no-JS render the finished mosaic statically (curtains
 * default hidden, images/captions default visible), so CLS stays 0 and every
 * `highlights.*` string, image and icon is preserved exactly.
 */

const ICONS = {
  seafood: Fish,
  pasta: Wheat,
  pizza: Pizza,
  desserts: IceCream2,
} as const;

const FEATURE = "seafood" as const;
const REST = ["pasta", "pizza", "desserts"] as const;

export default function Highlights() {
  const t = useTranslations("highlights");
  const root = useRef<HTMLElement>(null);
  const FeatureIcon = ICONS[FEATURE];

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
        // Initial states in JS so no-JS / reduced-motion see the finished mosaic.
        gsap.set(q("[data-h-curtain]"), { scaleY: 1 });
        gsap.set(q("[data-h-img]"), { scale: 1.14 });
        gsap.set(q("[data-h-cap]"), { autoAlpha: 0, y: 22 });

        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: { trigger: el, start: "top 74%", once: true },
        });
        tl.to(q("[data-h-curtain]"), {
          scaleY: 0,
          duration: 1.15,
          stagger: 0.12,
          ease: "power3.inOut",
        })
          .to(q("[data-h-img]"), { scale: 1.0, duration: 2.2, ease: "power2.out" }, 0.15)
          .to(q("[data-h-cap]"), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.55);
      }, el);

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section ref={root} className="relative py-28 sm:py-32">
      <div className="container-px">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} index="02" />

        <div className="mt-16 grid items-stretch gap-5 lg:grid-cols-12">
          {/* ——— Feature plate ——— */}
          <article className="group relative overflow-hidden rounded-3xl border border-white/10 shadow-luxe transition-colors duration-500 hover:border-gold/40 lg:col-span-7">
            <div className="relative h-full min-h-[24rem] lg:min-h-[30rem]">
              <div data-h-img className="absolute inset-0 will-change-transform">
                <LuxeImage
                  src={highlightImages[FEATURE]}
                  alt={t(`items.${FEATURE}.title`)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-charcoal-950/92 via-charcoal-950/25 to-transparent"
              />
              {/* Gold accent line — draws in on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold-gradient transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right"
              />
              <div data-h-cap className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-charcoal-950/80 text-gold backdrop-blur-sm">
                  <FeatureIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="heading-display mt-4 text-3xl font-medium text-cream sm:text-[2.6rem] sm:leading-[1.05]">
                  {t(`items.${FEATURE}.title`)}
                </h3>
                <p className="mt-2.5 max-w-md text-base font-light leading-relaxed text-cream/75">
                  {t(`items.${FEATURE}.desc`)}
                </p>
              </div>
              {/* Charcoal curtain — same reveal language as the hero */}
              <div
                data-h-curtain
                aria-hidden="true"
                className="absolute inset-0 origin-top scale-y-0 bg-charcoal-950 will-change-transform"
              />
            </div>
          </article>

          {/* ——— Trio of cinematic tiles ——— */}
          <div className="grid gap-5 lg:col-span-5">
            {REST.map((key) => {
              const Icon = ICONS[key];
              return (
                <article
                  key={key}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 shadow-luxe transition-colors duration-500 hover:border-gold/40"
                >
                  <div className="relative h-full min-h-[8.5rem] sm:min-h-[9.5rem]">
                    <div data-h-img className="absolute inset-0 will-change-transform">
                      <LuxeImage
                        src={highlightImages[key]}
                        alt={t(`items.${key}.title`)}
                        fill
                        sizes="(max-width: 1024px) 100vw, 26vw"
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
                      />
                    </div>
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-charcoal-950/92 via-charcoal-950/45 to-charcoal-950/10"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold-gradient transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right"
                    />
                    <div
                      data-h-cap
                      className="absolute inset-0 flex flex-col justify-end p-5"
                    >
                      <h3 className="flex items-center gap-2.5 heading-display text-xl font-medium text-cream sm:text-2xl">
                        <Icon className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                        {t(`items.${key}.title`)}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm font-light leading-relaxed text-cream/65">
                        {t(`items.${key}.desc`)}
                      </p>
                    </div>
                    <div
                      data-h-curtain
                      aria-hidden="true"
                      className="absolute inset-0 origin-bottom scale-y-0 bg-charcoal-950 will-change-transform"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
