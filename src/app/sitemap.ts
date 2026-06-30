import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { routing } from "@/i18n/routing";

const paths = ["", "/menu", "/gallery", "/contact", "/reservation"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routing.locales.flatMap((locale) =>
    paths.map((path) => {
      const languages = Object.fromEntries(
        routing.locales.map((l) => [l, `${siteConfig.url}/${l}${path}`]),
      );
      return {
        url: `${siteConfig.url}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
        priority: path === "" ? 1 : 0.8,
        alternates: { languages },
      };
    }),
  );
}
