import { useTranslations } from "next-intl";
import Reveal from "./Reveal";

export default function About() {
  const t = useTranslations("about");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
  ];

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container-px grid items-center gap-14 lg:grid-cols-2">
        {/* Visual */}
        <Reveal className="order-last lg:order-first">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(120%_120%_at_30%_10%,#3a2414_0%,#1a1714_55%,#100e0c_100%)] shadow-2xl">
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <span className="heading-display text-7xl font-bold text-gradient-gold">
                  V
                </span>
                <span className="text-xs uppercase tracking-[0.4em] text-cream/50">
                  Vanisca · Agadir
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 -end-6 hidden h-32 w-32 rounded-2xl border border-gold/30 bg-gold/5 backdrop-blur sm:block" />
          </div>
        </Reveal>

        {/* Text */}
        <div>
          <Reveal>
            <span className="eyebrow">{t("eyebrow")}</span>
            <h2 className="heading-display mt-3 text-3xl font-semibold text-cream sm:text-4xl md:text-[2.75rem] md:leading-tight">
              {t("title")}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-cream/70 sm:text-lg">
              {t("body")}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-10 grid grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="border-s border-gold/30 ps-4">
                  <dt className="heading-display text-2xl font-bold text-gradient-gold sm:text-3xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-xs uppercase tracking-wide text-cream/60">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
