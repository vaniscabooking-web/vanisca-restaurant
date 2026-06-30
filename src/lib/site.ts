/**
 * Central, non-secret site configuration.
 * Values fall back to sensible defaults so the site renders even before
 * environment variables are configured. Configure NEXT_PUBLIC_* in Vercel.
 */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Vanisca Restaurant Agadir",
  shortName: "Vanisca",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vanisca.ma",
  // Public-facing contact email (NOT the internal automation address).
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "vanisca.restaurant@gmail.com",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "0611700033",
  // WhatsApp in international format without "+" for wa.me links.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "212528202202",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "vaniscarestaurant",
  city: "Agadir",
  country: "Maroc",
  district: "Sonaba",
  // Geo coordinates for the Sonaba area, Agadir (approximate — refine if needed).
  geo: { lat: 30.4202, lng: -9.5982 },
} as const;

export const whatsappUrl = (text?: string) =>
  `https://wa.me/${siteConfig.whatsapp}${
    text ? `?text=${encodeURIComponent(text)}` : ""
  }`;

export const telUrl = `tel:+${
  siteConfig.phone.startsWith("0")
    ? "212" + siteConfig.phone.slice(1)
    : siteConfig.phone
}`;

export const instagramUrl = `https://instagram.com/${siteConfig.instagram}`;

/** Primary navigation — `key` maps to a `nav.*` translation. */
export const navItems = [
  { key: "home", href: "/" },
  { key: "menu", href: "/menu" },
  { key: "gallery", href: "/gallery" },
  { key: "contact", href: "/contact" },
] as const;
