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
  // Facebook page slug/username (override with NEXT_PUBLIC_FACEBOOK if different).
  facebook: process.env.NEXT_PUBLIC_FACEBOOK ?? "vaniscarestaurant",
  city: "Agadir",
  country: "Maroc",
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

/**
 * Official Facebook page. If `facebook` looks like a full URL it is used as-is,
 * otherwise it is treated as a page username. Falls back to a name search so the
 * link always resolves to the right page.
 */
export const facebookUrl = siteConfig.facebook.startsWith("http")
  ? siteConfig.facebook
  : /^\d+$/.test(siteConfig.facebook)
    ? `https://www.facebook.com/profile.php?id=${siteConfig.facebook}`
    : `https://www.facebook.com/${siteConfig.facebook}`;

/** Primary navigation — `key` maps to a `nav.*` translation. */
export const navItems = [
  { key: "home", href: "/" },
  { key: "menu", href: "/menu" },
  { key: "gallery", href: "/gallery" },
  { key: "contact", href: "/contact" },
] as const;
