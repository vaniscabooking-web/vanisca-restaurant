import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  Facebook,
  Instagram,
} from "lucide-react";
import ReservationForm from "@/components/ReservationForm";
import {
  siteConfig,
  telUrl,
  whatsappUrl,
  facebookUrl,
  instagramUrl,
} from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reservation" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ReservationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reservation");
  const tc = await getTranslations("contact");
  const tCommon = await getTranslations("common");

  return (
    <div className="bg-marble pt-28">
      <div className="container-px grid gap-12 pb-24 pt-8 lg:grid-cols-[1fr_1.1fr]">
        {/* Intro / info */}
        <div>
          <span className="eyebrow">{t("eyebrow")}</span>
          <h1 className="heading-display mt-3 text-4xl font-semibold text-cream sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-cream/70 sm:text-lg">
            {t("subtitle")}
          </p>

          <ul className="mt-9 space-y-4 text-cream/80">
            <li className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                <Clock className="h-5 w-5" />
              </span>
              {tc("hours")}
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                <MapPin className="h-5 w-5" />
              </span>
              {tc("address")}
            </li>
            <li>
              <a
                href={telUrl}
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <Phone className="h-5 w-5" />
                </span>
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl(tCommon("whatsappBooking"))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <MessageCircle className="h-5 w-5" />
                </span>
                WhatsApp
              </a>
            </li>
          </ul>

          {/* Social */}
          <div className="mt-8 flex items-center gap-3">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook — Vanisca Restaurant"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cream/80 transition-colors hover:border-gold hover:text-gold"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram — Vanisca Restaurant"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cream/80 transition-colors hover:border-gold hover:text-gold"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        <ReservationForm />
      </div>
    </div>
  );
}
