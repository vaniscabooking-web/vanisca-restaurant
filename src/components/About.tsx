import { useTranslations } from "next-intl";
import Reveal from "./Reveal";
import LuxeImage from "./LuxeImage";
import Parallax from "./Parallax";
import { aboutImage } from "@/lib/images";

export default function About() {
  const t = useTranslations("about");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
  ];

  return (
    <section id="about" className="relative overflow-hidden bg-marble py-28 sm:py-36">
      {/* Editorial ghost numeral */}
      <span
        aria-hidden="true"
        className="heading-display pointer-events-none absolute -top-6 end-4 select-none text-[10rem] font-semibold leading-none text-white/[0.04] sm:text-[16rem]"
      >
        01
      </span>

      <div className="container-px grid items-center gap-16 lg:grid-cols-12">
        {/* Visual — asymmetric editorial placement */}
        <Reveal className="order-last lg:order-first lg:col-span-5">
          <div className="relative lg:-ms-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 shadow-luxe">
              {/* Oversized + parallax drift: depth without ever showing an edge */}
              <Parallax amount={34} className="absolute inset-0">
                <LuxeImage
                  src={aboutImage}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="h-full w-full scale-[1.14] object-cover"
                />
              </Parallax>
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
            <div className="glass absolute -bottom-6 -end-6 hidden h-32 w-32 rounded-2xl sm:block" />
            <div className="absolute -top-5 -start-5 hidden h-20 w-20 rounded-full border border-gold/20 sm:block" />
          </div>
        </Reveal>

        {/* Text — editorial column, offset */}
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <span className="eyebrow">{t("eyebrow")}</span>
            <h2 className="heading-display mt-4 text-balance text-4xl font-medium text-cream sm:text-5xl md:text-[3.6rem] md:leading-[1.06]">
              {t("title")}
            </h2>
            <p className="mt-7 max-w-xl text-lg font-light leading-relaxed text-cream/75 sm:text-xl">
              {t("body")}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-12 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="heading-display text-3xl font-semibold tabular-nums text-gradient-gold sm:text-4xl">
                    {s.value}
                  </dt>
                  <dd className="mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-cream/55">
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
