import { useTranslations } from "next-intl";
import { CalendarDays } from "lucide-react";
import { Link } from "@/i18n/routing";
import Reveal from "./Reveal";
import LuxeImage from "./LuxeImage";
import Parallax from "./Parallax";
import { ctaImage } from "@/lib/images";

export default function CtaBanner() {
  const t = useTranslations("cta");

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      {/* Cinematic photographic background — slow parallax drift for depth */}
      <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
        <Parallax amount={56} className="absolute inset-0">
          <LuxeImage
            src={ctaImage}
            alt=""
            fill
            sizes="100vw"
            className="h-full w-full scale-[1.18] object-cover"
            fallbackTone="from-[#3a2a18] via-[#171310] to-[#0d0b09]"
          />
        </Parallax>
      </div>
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(90%_120%_at_50%_50%,rgba(13,11,9,0.72)_0%,rgba(13,11,9,0.9)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 shadow-[inset_0_0_160px_50px_rgba(0,0,0,0.7)]"
        aria-hidden="true"
      />

      <div className="container-px text-center">
        <Reveal>
          <span className="rule-gold mx-auto mb-7 block" />
          <h2 className="heading-display text-shadow-luxe mx-auto max-w-3xl text-4xl font-medium text-cream sm:text-5xl md:text-6xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base font-light text-cream/80 sm:text-lg">
            {t("subtitle")}
          </p>
          <Link href="/reservation" className="btn-primary mt-10">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {t("button")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
