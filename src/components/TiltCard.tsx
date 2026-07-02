"use client";

import {
  useRef,
  useEffect,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";

/**
 * 3D tilt card: tilts toward the cursor with a perspective transform, shows a
 * cursor-following gold sheen and a deeper shadow on hover. Style mutations
 * are rAF-throttled and applied directly to the element (no re-renders).
 * Disabled on coarse pointers (touch) and for prefers-reduced-motion — those
 * users keep the regular hover styles.
 */
export default function TiltCard({
  children,
  className,
  maxTilt = 9,
}: {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees at the card edges. */
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
    return () => cancelAnimationFrame(frame.current);
  }, []);

  const onEnter = () => {
    const el = ref.current;
    if (!enabled || !el) return;
    el.style.transition = "transform 0.15s ease-out";
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!enabled || !el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${(-py * maxTilt).toFixed(
        2,
      )}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      el.style.setProperty("--tilt-gx", `${((px + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--tilt-gy", `${((py + 0.5) * 100).toFixed(1)}%`);
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <div
      ref={ref}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt-card ${className ?? ""}`}
    >
      {children}
      <span className="tilt-sheen" aria-hidden="true" />
    </div>
  );
}
