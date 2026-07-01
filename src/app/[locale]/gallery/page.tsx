import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Gallery from "@/components/Gallery";
import SectionHeading from "@/components/SectionHeading";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");

  return (
    <div className="bg-marble pt-28">
      <div className="container-px pb-10 pt-8 text-center">
        <SectionHeading eyebrow="Vanisca" title={t("title")} subtitle={t("subtitle")} />
      </div>
      <div className="container-px pb-24">
        <Gallery />
      </div>
    </div>
  );
}
