import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Instagram,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import {
  siteConfig,
  telUrl,
  whatsappUrl,
  instagramUrl,
} from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const info = [
    { icon: MapPin, label: t("addressLabel"), value: t("address") },
    { icon: Phone, label: t("phoneLabel"), value: siteConfig.phone, href: telUrl },
    {
      icon: MessageCircle,
      label: t("whatsappLabel"),
      value: siteConfig.whatsapp.replace(/^212/, "0"),
      href: whatsappUrl(),
      external: true,
    },
    {
      icon: Mail,
      label: t("emailLabel"),
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    { icon: Clock, label: t("hoursLabel"), value: t("hours") },
  ];

  return (
    <div className="pt-28">
      <div className="container-px pb-10 pt-8">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1 className="heading-display mt-3 text-4xl font-semibold text-cream sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-xl text-base text-cream/70 sm:text-lg">
          {t("subtitle")}
        </p>
      </div>

      <div className="container-px grid gap-12 pb-24 lg:grid-cols-[1fr_1.2fr]">
        {/* Info */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">
            {t("infoTitle")}
          </h2>
          <ul className="mt-6 space-y-5">
            {info.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-cream/50">
                      {item.label}
                    </span>
                    <span className="text-cream">{item.value}</span>
                  </span>
                </>
              );
              return (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="flex items-center gap-4 transition-colors hover:text-gold"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">
              {t("followUs")}
            </h2>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-cream transition-colors hover:border-gold hover:text-gold"
            >
              <Instagram className="h-4 w-4" /> @{siteConfig.instagram}
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
