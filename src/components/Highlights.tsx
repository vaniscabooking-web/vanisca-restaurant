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

export default function Highlights() {
  const t = useTranslations("highlights");
  const keys = ["seafood", "pasta", "pizza", "desserts"] as const;

  return (
    <section className="relative py-24 sm:py-28">
      <div className="container-px">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {keys.map((key, i) => {
            const Icon = ICONS[key];
            return (
              <Reveal key={key} delay={i * 0.08}>
                <article className="group h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-luxe transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/30">
                  {/* Photo */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <LuxeImage
                      src={highlightImages[key]}
                      alt={t(`items.${key}.title`)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/20 to-transparent" />
                    <span className="absolute start-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-charcoal-950/80 text-gold backdrop-blur-sm">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="heading-display text-xl font-semibold text-cream">
                      {t(`items.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-cream/65">
                      {t(`items.${key}.desc`)}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
