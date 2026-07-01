"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Star, Fish, Leaf, Flame } from "lucide-react";
import { menu, type MenuLocale, type MenuTag } from "@/data/menu";
import { dishImage } from "@/lib/images";
import Reveal from "./Reveal";
import LuxeImage from "./LuxeImage";

const TAG_META: Record<MenuTag, { icon: typeof Star; className: string }> = {
  signature: { icon: Star, className: "text-gold" },
  seafood: { icon: Fish, className: "text-sky-300/80" },
  vegetarian: { icon: Leaf, className: "text-emerald-300/80" },
  spicy: { icon: Flame, className: "text-red-400/80" },
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
        className="glass sticky top-[68px] z-30 -mx-5 mb-14 border-y border-white/10 px-5 py-3 sm:-mx-8 sm:px-8"
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
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors ${
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

      {/* Sections */}
      <div className="space-y-20">
        {categories.map((cat) => (
          <section key={cat.id} id={`cat-${cat.id}`} aria-labelledby={`h-${cat.id}`}>
            <Reveal>
              <div className="mb-8 flex items-center gap-4">
                <h2
                  id={`h-${cat.id}`}
                  className="heading-display text-3xl font-semibold text-cream sm:text-4xl"
                >
                  {t(`categories.${cat.id}`)}
                </h2>
                <span className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent rtl:bg-gradient-to-l" />
              </div>
            </Reveal>

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((item, i) => (
                <Reveal as="li" key={item.id} delay={(i % 3) * 0.05}>
                  <article className="group h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-luxe transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/30 hover:bg-white/[0.04]">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <LuxeImage
                        src={dishImage(cat.id, item.id)}
                        alt={item.name[locale]}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />
                      <span className="absolute end-3 top-3 rounded-full border border-gold/30 bg-charcoal-950/85 px-3 py-1 text-sm font-semibold text-gold shadow-lg backdrop-blur-sm">
                        {item.price} {t("currency")}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="flex flex-wrap items-center gap-2 text-base font-semibold text-cream">
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
                        <p className="mt-1.5 text-sm leading-relaxed text-cream/55">
                          {item.description[locale]}
                        </p>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-16 text-center text-sm text-cream/50">{t("downloadNote")}</p>
    </div>
  );
}
