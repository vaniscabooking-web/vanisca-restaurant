import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: "Restaurant méditerranéen à Agadir",
    start_url: "/",
    display: "standalone",
    background_color: "#100e0c",
    theme_color: "#100e0c",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
