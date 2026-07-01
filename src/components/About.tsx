import { useTranslations } from "next-intl";
import Reveal from "./Reveal";
import LuxeImage from "./LuxeImage";
import { aboutImage } from "@/lib/images";

export default function About() {
  const t = useTranslations("about");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
  ];

  return (
    <section id="about" className="relative bg-marble py-24 sm:py-32">
      <div className="container-px grid items-center gap-14 lg:grid-cols-2">
        {/* Visual */}
        <Reveal className="order-last lg:order-first">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 shadow-luxe">
              <LuxeImage
                src={aboutImage}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 start-6">
                <span className="heading-display text-4xl font-semibold text-cream">
                  Vanisca
                </span>
                <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.4em] text-gold/90">
                  Agadir
                </span>
              </div>
            </div>
            {/* Floating glass accent for depth */}
            <div className="glass absolute -bottom-6 -end-6 hidden h-32 w-32 rounded-2xl sm:block" />
            <div className="absolute -top-5 -start-5 hidden h-20 w-20 rounded-full border border-gold/20 sm:block" />
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
