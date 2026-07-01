import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  siteConfig,
  telUrl,
  whatsappUrl,
  instagramUrl,
  facebookUrl,
} from "@/lib/site";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Highlights from "@/components/Highlights";
import Gallery from "@/components/Gallery";
import CtaBanner from "@/components/CtaBanner";
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

      {/* Gallery preview */}
      <section className="py-24 sm:py-28">
        <div className="container-px">
          <SectionHeading eyebrow={t("title")} title={t("subtitle")} />
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
