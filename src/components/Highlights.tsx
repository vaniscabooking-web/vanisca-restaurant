import { useTranslations } from "next-intl";
import { Fish, Wheat, Pizza, IceCream2 } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import LuxeImage from "./LuxeImage";
import { highlightImages } from "@/lib/images";

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
  const FeatureIcon = ICONS[FEATURE];

  return (
    <section className="relative py-28 sm:py-32">
      <div className="container-px">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} index="02" />

        {/* Asymmetric editorial mosaic: one feature + three media rows */}
        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          {/* Feature */}
          <Reveal className="lg:col-span-7">
            <article className="group relative h-full min-h-[24rem] overflow-hidden rounded-3xl border border-white/10 shadow-luxe transition-all duration-500 hover:border-gold/30">
              <LuxeImage
                src={highlightImages[FEATURE]}
                alt={t(`items.${FEATURE}.title`)}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-charcoal-950/80 text-gold backdrop-blur-sm">
                  <FeatureIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="heading-display mt-4 text-3xl font-medium text-cream sm:text-4xl">
                  {t(`items.${FEATURE}.title`)}
                </h3>
                <p className="mt-2 max-w-md text-base font-light text-cream/75">
                  {t(`items.${FEATURE}.desc`)}
                </p>
              </div>
            </article>
          </Reveal>

          {/* Stacked media rows */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {REST.map((key, i) => {
              const Icon = ICONS[key];
              return (
                <Reveal key={key} delay={0.08 + i * 0.08} className="flex-1">
                  <article className="group flex h-full min-h-[7.5rem] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-luxe transition-all duration-500 hover:border-gold/30 hover:bg-white/[0.05]">
                    <div className="relative w-2/5 shrink-0 overflow-hidden">
                      <LuxeImage
                        src={highlightImages[key]}
                        alt={t(`items.${key}.title`)}
                        fill
                        sizes="(max-width: 1024px) 40vw, 16vw"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-charcoal-950/40 rtl:bg-gradient-to-l" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-5">
                      <h3 className="flex items-center gap-2.5 heading-display text-xl font-medium text-cream">
                        <Icon className="h-4 w-4 text-gold" aria-hidden="true" />
                        {t(`items.${key}.title`)}
                      </h3>
                      <p className="mt-1.5 text-sm font-light leading-relaxed text-cream/60">
                        {t(`items.${key}.desc`)}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
