"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type LuxeImageProps = Omit<ImageProps, "onError"> & {
  /** Gradient classes used if the photo fails to load. */
  fallbackTone?: string;
};

/**
 * next/image wrapper that degrades gracefully: if the remote photo fails to
 * load, it swaps to an elegant warm gradient instead of a broken image. Keeps
 * a luxury site from ever showing a broken tile.
 */
export default function LuxeImage({
  fallbackTone = "from-[#2a2018] via-[#171310] to-[#0d0b09]",
  alt,
  className,
  ...props
}: LuxeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    const decorative = !alt;
    return (
      <div
        {...(decorative
          ? { "aria-hidden": true }
          : { role: "img", "aria-label": alt })}
        className={`bg-gradient-to-br ${fallbackTone} ${className ?? ""}`}
      >
        <span className="flex h-full w-full items-center justify-center">
          <span className="heading-display text-4xl font-semibold text-gold/25">
            V
          </span>
        </span>
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
