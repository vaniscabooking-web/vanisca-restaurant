import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, getMessages, setRequestLocale } from "next-intl/server";
import { Cormorant_Garamond, Inter, Cairo } from "next/font/google";
import { routing, localeMeta, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import ScrollProgress from "@/components/ScrollProgress";
import Background3D from "@/components/three/Background3D";
import SmoothScroll from "@/components/SmoothScroll";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#100e0c",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}`]),
  );

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("title"),
      template: `%s · ${siteConfig.shortName}`,
    },
    description: t("description"),
    keywords: t("keywords"),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: { ...languages, "x-default": `${siteConfig.url}/fr` },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: t("title"),
      description: t("description"),
      url: `${siteConfig.url}/${locale}`,
      locale,
      alternateLocale: routing.locales.filter((l) => l !== locale),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const dir = localeMeta[locale as Locale].dir;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cormorant.variable} ${inter.variable} ${cairo.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-charcoal-950"
          >
            Skip
          </a>
          <Background3D />
          <SmoothScroll />
          <ScrollProgress />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <FloatingActions />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
