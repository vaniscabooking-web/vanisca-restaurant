"use client";

import { useTranslations } from "next-intl";
import { MapPin, ExternalLink } from "lucide-react";
import Reveal from "./Reveal";

/**
 * "Find Us" — the premium closing scene of the homepage. A glassmorphism map
 * container showing the real Vanisca listing in Agadir, with a direct
 * "Open in Google Maps" action. The embed is lazy-loaded and tinted to sit
 * inside the dark luxury palette instead of glaring bright.
 */

// Owner-provided listing. Short link used for the button; a labelled place
// query is used for the embed so the pin shows the real restaurant.
const MAPS_LINK = "https://maps.app.goo.gl/wjYWNiR6sRhaJkgN8";
// Google refuses to be framed (X-Frame-Options), so the inline map uses
// OpenStreetMap — keyless, reliably frameable, and pinned to the exact
// coordinates resolved from the owner's Google Maps short link. The
// "Open in Google Maps" button still sends visitors to the real listing.
const MAPS_EMBED =
  "https://www.openstreetmap.org/export/embed.html?bbox=-9.592961%2C30.394515%2C-9.582961%2C30.404515&layer=mapnik&marker=30.3995151%2C-9.587961";

export default function FindUs() {
  const t = useTranslations("findUs");
  const tc = useTranslations("contact");

  return (
    <section id="find-us" className="relative overflow-hidden py-28 sm:py-36">
      <div className="container-px">
        <Reveal>
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <span className="eyebrow">{t("eyebrow")}</span>
            <h2 className="heading-display mt-3 text-balance text-4xl font-medium text-cream sm:text-5xl md:text-[3.4rem] md:leading-[1.08]">
              {t("title")}
            </h2>
            <p className="mt-4 flex items-center gap-2 text-base text-cream/70 sm:text-lg">
              <MapPin className="h-5 w-5 text-gold" aria-hidden="true" />
              {tc("address")}
            </p>
            <span className="rule-gold mt-6" aria-hidden="true" />
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          {/* Glassmorphism map container */}
          <div className="glass mt-12 overflow-hidden rounded-[1.75rem] p-2 shadow-luxe sm:p-3">
            <div className="relative overflow-hidden rounded-[1.35rem] border border-white/10">
              <div className="relative aspect-[16/10] w-full sm:aspect-[16/7]">
                <iframe
                  title={t("mapTitle")}
                  src={MAPS_EMBED}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                  style={{
                    border: 0,
                    filter: "grayscale(0.35) contrast(1.05) brightness(0.9)",
                  }}
                />
                {/* Subtle edge vignette so the bright map blends into the dark
                    theme without blocking pointer interaction with the map. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[1.35rem] shadow-[inset_0_0_120px_20px_rgba(13,11,9,0.55)] ring-1 ring-inset ring-white/10"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6">
              <p className="text-sm text-cream/70">{t("subtitle")}</p>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !px-6 !py-3"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                {t("cta")}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
