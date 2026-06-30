import { useTranslations } from "next-intl";
import { Fish, Wheat, Pizza, IceCream2 } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

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
                <article className="card-surface group h-full p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:bg-white/[0.05]">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold transition-colors group-hover:bg-gold/20">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h3 className="heading-display mt-5 text-xl font-semibold text-cream">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/65">
                    {t(`items.${key}.desc`)}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
