"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type ScrollLike = { v: number; p: number };

/**
 * Depth field of slowly drifting golden motes. When a scroll ref is provided,
 * the field accelerates with smoothed scroll velocity — light reacting to
 * movement through the space.
 */
export default function Particles({
  count = 4800,
  scroll,
}: {
  count?: number;
  scroll?: React.MutableRefObject<ScrollLike>;
}) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 26;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    // Base drift + scroll-velocity boost (clamped so it stays calm).
    const boost = scroll
      ? Math.min(Math.abs(scroll.current.v) * 0.00004, 0.14)
      : 0;
    ref.current.rotation.y += delta * (0.012 + boost);
    // The field slides gently upward as you travel deeper into the page.
    if (scroll) ref.current.position.y = scroll.current.p * 2.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#e6cd93"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
