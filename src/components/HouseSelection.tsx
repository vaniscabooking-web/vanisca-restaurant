"use client";

import { useLocale, useTranslations } from "next-intl";
import { Star, Fish, Leaf, Flame } from "lucide-react";
import { Link } from "@/i18n/routing";
import { signatureItems, type MenuLocale, type MenuTag } from "@/data/menu";
import { dishImage } from "@/lib/images";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import LuxeImage from "./LuxeImage";
import TiltCard from "./TiltCard";

// Dietary-tag hues stay inside the brand palette (gold / olive / copper + one
// restrained marine tone) so the selection reads as one controlled colour
// system rather than borrowing generic UI reds/greens/blues.
const TAG_META: Record<MenuTag, { icon: typeof Star; className: string }> = {
  signature: { icon: Star, className: "text-gold" },
  seafood: { icon: Fish, className: "text-[#8aa9b4]" },
  vegetarian: { icon: Leaf, className: "text-olive-light" },
  spicy: { icon: Flame, className: "text-copper-light" },
};

// A curated six — a tasting of the real signature dishes (never invented).
const SELECTION = signatureItems.slice(0, 6);

/**
 * The House Selection — a homepage showcase of the restaurant's real
 * signature dishes (authentic name, price and photography). Serves both the
 * "signature dishes" and "chef recommendation" intent without fabricating a
 * chef persona: the kitchen's own picks, straight from the menu data.
 */
export default function HouseSelection() {
  const locale = useLocale() as MenuLocale;
  const t = useTranslations("houseSelection");
  const tm = useTranslations("menu");

  return (
    <section className="relative overflow-hidden bg-marble py-28 sm:py-36">
      <div className="container-px">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          index="03"
        />

        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SELECTION.map((item, i) => (
            <Reveal as="li" key={item.id} delay={(i % 3) * 0.06}>
              <TiltCard className="h-full rounded-2xl">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-luxe transition-colors duration-500 hover:border-gold/40 hover:bg-white/[0.05]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <LuxeImage
                      src={dishImage(item.categoryId, item.id)}
                      alt={item.name[locale]}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.12]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/10 to-transparent" />
                    {/* Gold accent line revealed on hover */}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold-gradient transition-transform duration-500 group-hover:scale-x-100" />
                    <span className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-full border border-gold/30 bg-charcoal-950/85 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-gold backdrop-blur-sm">
                      <Star className="h-3 w-3" aria-hidden="true" />
                      {tm("tags.signature")}
                    </span>
                    <span className="absolute end-3 top-3 rounded-full border border-gold/30 bg-charcoal-950/85 px-3 py-1 text-sm font-semibold text-gold shadow-lg backdrop-blur-sm">
                      {item.price} {tm("currency")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="flex flex-wrap items-center gap-2 text-base font-semibold text-cream transition-colors group-hover:text-gold-light">
                      <span>{item.name[locale]}</span>
                      {item.tags
                        ?.filter((tag) => tag !== "signature")
                        .map((tag) => {
                          const { icon: Icon, className } = TAG_META[tag];
                          return (
                            <span
                              key={tag}
                              title={tm(`tags.${tag}`)}
                              aria-label={tm(`tags.${tag}`)}
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
          ))}
        </ul>

        <Reveal>
          <div className="mt-12 text-center">
            <Link href="/menu" className="btn-primary">
              {t("cta")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
