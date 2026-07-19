"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Star, Fish, Leaf, Flame } from "lucide-react";
import { menu, type MenuLocale, type MenuTag } from "@/data/menu";
import { dishImage, categoryImage } from "@/lib/images";
import Reveal from "./Reveal";
import LuxeImage from "./LuxeImage";
import TiltCard from "./TiltCard";

// Tag hues stay inside the brand family (gold / olive / copper + the one
// restrained marine) — never generic UI blue/green/red.
const TAG_META: Record<MenuTag, { icon: typeof Star; className: string }> = {
  signature: { icon: Star, className: "text-gold" },
  seafood: { icon: Fish, className: "text-[#8aa9b4]/90" },
  vegetarian: { icon: Leaf, className: "text-olive-light" },
  spicy: { icon: Flame, className: "text-copper-light" },
};

export default function MenuList() {
  const locale = useLocale() as MenuLocale;
  const t = useTranslations("menu");
  const [active, setActive] = useState<string>(menu[0].id);
  const navRef = useRef<HTMLElement>(null);
  const clickLock = useRef(false);

  const categories = useMemo(() => menu, []);

  const scrollTo = (id: string) => {
    setActive(id);
    clickLock.current = true;
    window.setTimeout(() => (clickLock.current = false), 700);
    const el = document.getElementById(`cat-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Scroll-spy: highlight the category currently in view.
  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(`cat-${c.id}`))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        if (clickLock.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace("cat-", ""));
      },
      { rootMargin: "-128px 0px -65% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  // Keep the active chip visible within the horizontal category bar.
  useEffect(() => {
    const bar = navRef.current;
    if (!bar) return;
    const chip = bar.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    chip?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  return (
    <div>
      {/* Sticky category nav (glass) */}
      <nav
        ref={navRef}
        className="glass sticky top-[68px] z-30 -mx-5 mb-14 rounded-none border-y border-white/10 px-5 py-3 sm:-mx-8 sm:px-8"
        aria-label="Menu categories"
      >
        <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                data-cat={cat.id}
                aria-current={active === cat.id ? "true" : undefined}
                onClick={() => scrollTo(cat.id)}
                className={`flex min-h-11 items-center whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-wide transition-colors ${
                  active === cat.id
                    ? "bg-gold-gradient text-charcoal-950"
                    : "text-cream/70 hover:bg-white/5 hover:text-cream"
                }`}
              >
                {t(`categories.${cat.id}`)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sections — each category opens with a cinematic chapter divider */}
      <div className="space-y-24">
        {categories.map((cat, catIdx) => (
          <section key={cat.id} id={`cat-${cat.id}`} aria-labelledby={`h-${cat.id}`}>
            <Reveal>
              <div className="relative mb-10 h-40 overflow-hidden rounded-3xl border border-white/10 shadow-luxe sm:h-52">
                <LuxeImage
                  src={categoryImage(cat.id)}
                  alt=""
                  fill
                  sizes="100vw"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/95 via-charcoal-950/60 to-charcoal-950/20 rtl:bg-gradient-to-l" />
                <span
                  aria-hidden="true"
                  className="heading-display pointer-events-none absolute -bottom-8 end-4 select-none text-[8rem] font-semibold leading-none text-white/[0.07] sm:text-[11rem] sm:-bottom-12"
                >
                  {String(catIdx + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-y-0 start-7 flex flex-col justify-center sm:start-10">
                  <h2
                    id={`h-${cat.id}`}
                    className="heading-display text-[clamp(1.875rem,3.8vw,3rem)] font-medium leading-[1.1] text-cream"
                  >
                    {t(`categories.${cat.id}`)}
                  </h2>
                  <span className="rule-gold mt-4 !mx-0" aria-hidden="true" />
                </div>
              </div>
            </Reveal>

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((item, i) => (
                // Real <li> for list semantics — Reveal renders a div and
                // ignores `as` (documented gotcha), so it nests inside.
                <li key={item.id}>
                  <Reveal delay={(i % 3) * 0.05} className="h-full">
                  <TiltCard className="h-full rounded-2xl">
                    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-luxe transition-colors duration-500 hover:border-gold/40 hover:bg-white/[0.05]">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <LuxeImage
                        src={dishImage(cat.id, item.id)}
                        alt={item.name[locale]}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/10 to-transparent" />
                      {/* Gold accent line revealed on hover — draws from the reading side */}
                      <span className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-gold-gradient transition-transform duration-500 group-hover:scale-x-100 ltr:origin-left rtl:origin-right" />
                      <span className="absolute end-3 top-3 rounded-full border border-gold/30 bg-charcoal-950/85 px-3 py-1 text-sm font-semibold tabular-nums text-gold shadow-luxe backdrop-blur-sm">
                        {item.price} {t("currency")}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="heading-display flex flex-wrap items-center gap-2 text-lg font-semibold leading-snug text-cream transition-colors group-hover:text-gold-light">
                        <span>{item.name[locale]}</span>
                        {item.tags?.map((tag) => {
                          const { icon: Icon, className } = TAG_META[tag];
                          return (
                            <span
                              key={tag}
                              title={t(`tags.${tag}`)}
                              aria-label={t(`tags.${tag}`)}
                              className={className}
                            >
                              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                          );
                        })}
                      </h3>
                      {item.description && (
                        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-cream/55">
                          {item.description[locale]}
                        </p>
                      )}
                    </div>
                    </article>
                  </TiltCard>
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-16 text-center text-sm text-cream/50">{t("downloadNote")}</p>
      <p className="mt-2 text-center text-[0.7rem] uppercase tracking-wide text-cream/50">
        Photographies ·{" "}
        <a
          href="https://www.pexels.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 hover:text-cream/60"
        >
          Pexels
        </a>
      </p>
    </div>
  );
}
