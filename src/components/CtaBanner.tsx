import { useTranslations } from "next-intl";
import { CalendarDays } from "lucide-react";
import { Link } from "@/i18n/routing";
import Reveal from "./Reveal";

export default function CtaBanner() {
  const t = useTranslations("cta");

  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_0%,#3a2414_0%,#1a1714_60%,#100e0c_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_120%,rgba(200,164,92,0.2)_0%,transparent_60%)]" />
      </div>
      <div className="container-px text-center">
        <Reveal>
          <h2 className="heading-display mx-auto max-w-3xl text-3xl font-semibold text-cream sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-cream/70 sm:text-lg">
            {t("subtitle")}
          </p>
          <Link href="/reservation" className="btn-primary mt-9">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {t("button")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
