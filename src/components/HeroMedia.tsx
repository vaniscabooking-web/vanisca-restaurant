"use client";

import { useEffect, useRef, useState } from "react";
import LuxeImage from "./LuxeImage";

/**
 * Video-ready hero media layer.
 *
 * The approved cinematic still is always rendered as the base — it is both the
 * poster and the universal fallback. When a `video` source is provided, a
 * muted, looping, autoplaying film is layered ON TOP of the still for capable
 * desktop clients, fading in once it can play. Reduced-motion, data-saver and
 * mobile clients keep the light still (bandwidth + battery). Swapping the
 * image hero for the cinematic film is therefore a one-line change: pass
 * `video` — every layer above (gradients, headline, CTAs) stays identical.
 */
export default function HeroMedia({
  image,
  video,
  alt = "",
}: {
  image: string;
  /** Optional film src (e.g. "/media/hero/vanisca-hero-film.mp4"). */
  video?: string;
  alt?: string;
}) {
  const [ready, setReady] = useState(false);
  const [enableFilm, setEnableFilm] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;
    // Desktop-first: keep phones on the light still.
    if (window.matchMedia("(max-width: 767px)").matches) return;
    setEnableFilm(true);
  }, [video]);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* Base still — poster + universal fallback, priority-loaded (LCP). */}
      <LuxeImage
        src={image}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="h-full w-full object-cover"
      />

      {/* Cinematic film, layered over the still when the client can support it. */}
      {video && enableFilm && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          src={video}
          poster={image}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setReady(true)}
        />
      )}
    </div>
  );
}
