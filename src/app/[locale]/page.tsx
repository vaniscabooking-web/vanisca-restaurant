import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  siteConfig,
  telUrl,
  whatsappUrl,
  instagramUrl,
  facebookUrl,
} from "@/lib/site";
import { SERVICE } from "@/lib/hours";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Highlights from "@/components/Highlights";
import HouseSelection from "@/components/HouseSelection";
import Gallery from "@/components/Gallery";
import CtaBanner from "@/components/CtaBanner";
import FindUs from "@/components/FindUs";
import SectionHeading from "@/components/SectionHeading";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");
  const tNav = await getTranslations("nav");

  // Opening hours mirror the single source of truth in lib/hours.ts, so the
  // structured data can never drift from the displayed / bookable schedule.
  const hhmm = (min: number) =>
    `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
  const opens = `${String(SERVICE.openHour).padStart(2, "0")}:00`;

  // Restaurant structured data for rich search results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteConfig.name,
    image: `${siteConfig.url}/opengraph-image`,
    "@id": siteConfig.url,
    url: siteConfig.url,
    telephone: `+212${siteConfig.phone.replace(/^0/, "")}`,
    servesCuisine: ["Mediterranean", "Italian", "Seafood"],
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressCountry: "MA",
    },
    hasMenu: `${siteConfig.url}/${locale}/menu`,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday", "Saturday"],
        opens,
        closes: hhmm(SERVICE.weekendCloseMin),
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens,
        closes: hhmm(SERVICE.weekdayCloseMin),
      },
    ],
    sameAs: [facebookUrl, instagramUrl, whatsappUrl()],
    acceptsReservations: "True",
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD is static and trusted (server-generated from config).
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <About />
      <Highlights />
      <HouseSelection />

      {/* Gallery preview */}
      <section className="py-24 sm:py-32">
        <div className="container-px">
          <SectionHeading eyebrow={t("title")} title={t("subtitle")} index="04" />
          <div className="mt-14">
            <Gallery limit={4} />
          </div>
          <div className="mt-10 text-center">
            <Link href="/gallery" className="btn-outline">
              {tNav("gallery")}
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
      <FindUs />

      <noscript>
        <div className="container-px py-6 text-center text-sm text-cream/70">
          <a href={telUrl} className="underline">
            {siteConfig.phone}
          </a>
        </div>
      </noscript>
    </>
  );
}
