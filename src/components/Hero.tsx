"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { CalendarDays, UtensilsCrossed } from "lucide-react";
import { Link } from "@/i18n/routing";
import LuxeImage from "./LuxeImage";
import { unsplash } from "@/lib/images";

/**
 * "Le Rideau" — a cinematic triptych hero. Three full-height photographic
 * panels (seafood · fresh pasta · the room) stand behind hairline gold seams
 * like a gallery campaign wall, and the monumental serif headline runs across
 * all three. On entrance each panel's charcoal curtain lifts in sequence,
 * the seams draw themselves, then the headline rises line by line and the
 * brand word settles in italic gold.
 *
 * Scroll gives each panel its own parallax depth (GSAP scrub); the copy
 * drifts slower, so the wall feels dimensional. Reduced-motion (or no JS)
 * shows the finished composition statically — curtains are pre-lifted in
 * markup only when JS animates them, so nothing depends on scripting.
 * All text is i18n (hero.*), CTAs are the same routed links, and the section
 * is a fixed 100svh stage: zero CLS.
 */

const PANELS = [
  { id: "1467003909585-2f8a72700288", pos: "object-[50%_60%]" }, // fruits de mer
  { id: "1481931098730-318b6f776db0", pos: "object-center" }, // assiette sombre du chef
  { id: "1414235077428-338989a2e8c0", pos: "object-center" }, // la salle
] as const;

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

      const q = gsap.utils.selector(el);
      const ctx = gsap.context(() => {
        // Initial states live in JS so no-JS users see the finished wall.
        gsap.set(q("[data-curtain]"), { scaleY: 1 });
        gsap.set(q("[data-panel-img]"), { scale: 1.18 });
        gsap.set(q("[data-seam]"), { scaleY: 0 });
        gsap.set(q("[data-headline]"), { yPercent: 118 });
        gsap.set(q("[data-soft]"), { autoAlpha: 0, y: 24 });

        const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.1 });
        tl.to(q("[data-curtain]"), {
          scaleY: 0,
          duration: 1.3,
          stagger: 0.16,
          ease: "power3.inOut",
        })
          .to(q("[data-panel-img]"), { scale: 1.06, duration: 2.4, ease: "power2.out" }, 0.2)
          .to(q("[data-seam]"), { scaleY: 1, duration: 1.1, stagger: 0.1 }, 0.8)
          .to(q("[data-headline]"), { yPercent: 0, duration: 1.25, stagger: 0.14 }, 0.9)
          .to(q("[data-soft]"), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 1.5);

        // Depth: each panel scrolls at its own pace, the copy slower still.
        q("[data-panel-img]").forEach((img, i) => {
          gsap.to(img, {
            yPercent: [7, 12, 9][i % 3],
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
          });
        });
        gsap.to(q("[data-stage]"), {
          yPercent: -5,
          autoAlpha: 0.4,
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
      {/* ——— The photographic wall ——— */}
      <div className="absolute inset-0 grid grid-cols-3" aria-hidden="true">
        {PANELS.map((p, i) => (
          <div key={p.id} className="relative overflow-hidden">
            <div data-panel-img className="absolute -inset-y-8 inset-x-0 will-change-transform">
              <LuxeImage
                src={unsplash(p.id, 900, 72)}
                alt=""
                fill
                priority={i === 0}
                sizes="34vw"
                className={`h-full w-full object-cover ${p.pos}`}
              />
            </div>
            {/* Charcoal grade so the wall reads as one candlelit room */}
            <div className="absolute inset-0 bg-charcoal-950/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/30 to-charcoal-950/75" />
            {/* Entrance curtain (JS lifts it; static/no-JS never sees it) */}
            <div
              data-curtain
              className="absolute inset-0 origin-top scale-y-0 bg-charcoal-950 will-change-transform"
            />
          </div>
        ))}
      </div>

      {/* Gold seams between the panels */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-10 left-1/3 w-px origin-bottom bg-gradient-to-b from-transparent via-gold/45 to-transparent"
        data-seam
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-10 left-2/3 w-px origin-top bg-gradient-to-b from-transparent via-gold/45 to-transparent"
        data-seam
      />

      {/* ——— The copy stage, running across the wall ——— */}
      <div data-stage className="relative flex h-full flex-col justify-between">
        <div className="container-px pt-28 sm:pt-32">
          <span data-soft className="eyebrow">
            {t("eyebrow")}
          </span>
        </div>

        <div className="container-px">
          <h1 className="heading-display text-shadow-luxe text-balance font-medium leading-[0.94] text-cream">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span data-headline className="block text-[clamp(2.6rem,7.5vw,6.5rem)] will-change-transform">
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

      {/* Elegant scroll cue */}
      <div data-soft aria-hidden="true" className="absolute bottom-5 end-6 sm:end-10">
        <span className="flex h-9 w-[22px] items-start justify-center rounded-full border border-gold/40 p-1.5">
          <span className="h-2 w-0.5 rounded-full bg-gold/80 motion-safe:animate-bounce" />
        </span>
      </div>
    </section>
  );
}
