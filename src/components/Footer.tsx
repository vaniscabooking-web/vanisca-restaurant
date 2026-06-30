import { useTranslations } from "next-intl";
import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  navItems,
  siteConfig,
  whatsappUrl,
  telUrl,
  instagramUrl,
} from "@/lib/site";

export default function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-charcoal-950">
      <div className="container-px grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <span className="heading-display text-2xl font-bold text-cream">
            Vanisca
          </span>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/60">
            {t("footer.tagline")}
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream/80 transition-colors hover:border-gold hover:text-gold"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream/80 transition-colors hover:border-gold hover:text-gold"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Nav */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
            {t("footer.navTitle")}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="text-sm text-cream/70 transition-colors hover:text-gold"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/reservation"
                className="text-sm text-cream/70 transition-colors hover:text-gold"
              >
                {t("nav.reserve")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
            {t("footer.contactTitle")}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-cream/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
              <span>{t("contact.address")}</span>
            </li>
            <li>
              <a
                href={telUrl}
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <Phone className="h-4 w-4 shrink-0 text-gold/80" />
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-gold/80" />
                {siteConfig.whatsapp.replace(/^212/, "0")}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 break-all transition-colors hover:text-gold"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold/80" />
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
            {t("footer.hoursTitle")}
          </h3>
          <p className="mt-4 flex items-start gap-3 text-sm text-cream/70">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
            <span>{t("footer.hours")}</span>
          </p>
          <Link href="/reservation" className="btn-outline mt-5 !px-5 !py-2.5">
            {t("nav.reserve")}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/50 sm:flex-row">
          <p>
            © {year} {siteConfig.name}. {t("footer.rights")}
          </p>
          <p>{t("footer.madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}
