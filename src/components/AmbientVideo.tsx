"use client";

import { useEffect, useRef, useState } from "react";
import LuxeImage from "./LuxeImage";

/**
 * Reusable, video-ready ambient background.
 *
 * The approved still is always the base — poster + universal fallback. When a
 * `video` is provided, a muted, looping film is layered over it for capable
 * desktop clients and fades in once it can play. It's **lazy**: the film only
 * loads/plays when the section nears the viewport (IntersectionObserver), so a
 * below-the-fold section never costs bandwidth up front. Reduced-motion,
 * data-saver and mobile keep the still.
 *
 * This is the drop-in point for the remaining films: pass `video` and the loop
 * appears over its poster with no layout change. (The Hero uses its own
 * `HeroMedia` because it's above the fold and loads eagerly/priority.)
 */
export default function AmbientVideo({
  image,
  video,
  imgClassName = "",
  priority = false,
}: {
  image: string;
  /** Optional loop, e.g. "/media/loops/vanisca-steam-loop.mp4". */
  video?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [capable, setCapable] = useState(false);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;
    if (window.matchMedia("(max-width: 767px)").matches) return; // desktop-first
    setCapable(true);
  }, [video]);

  useEffect(() => {
    if (!capable) return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [capable]);

  return (
    <div ref={rootRef} className="absolute inset-0" aria-hidden="true">
      <LuxeImage
        src={image}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className={`h-full w-full object-cover ${imgClassName}`}
      />
      {capable && near && video && (
        <video
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${
            ready ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
          src={video}
          poster={image}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onCanPlay={() => setReady(true)}
        />
      )}
    </div>
  );
}
