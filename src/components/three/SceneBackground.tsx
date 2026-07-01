"use client";

import { useRef, useMemo, useEffect, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Small matchMedia hook (kept local so this lazy chunk stays dependency-light). */
function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const on = () => setReduce(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return reduce;
}

type Pointer = { x: number; y: number; tx: number; ty: number };

/** Depth field of drifting golden motes. */
function Particles({ count }: { count: number }) {
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
    if (ref.current) ref.current.rotation.y += delta * 0.012;
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

/** A single floating faceted brass object. */
function Shard({
  position,
  scale,
  speed,
  detail = 0,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  detail?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => Math.random() * 10, []);

  useFrame((state, delta) => {
    const m = ref.current;
    if (!m) return;
    m.rotation.x += delta * 0.14 * speed;
    m.rotation.y += delta * 0.2 * speed;
    m.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.4 * speed + seed) * 0.45;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, detail]} />
      <meshStandardMaterial
        color="#b08d57"
        metalness={0.92}
        roughness={0.34}
        emissive="#3a2a18"
        emissiveIntensity={0.25}
        flatShading
      />
    </mesh>
  );
}

/** Camera + group rig: slow drift + eased mouse/touch parallax. */
function Rig({
  pointer,
  children,
}: {
  pointer: React.MutableRefObject<Pointer>;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = pointer.current;
    p.x += (p.tx - p.x) * 0.045;
    p.y += (p.ty - p.y) * 0.045;

    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.05) * 0.08 + p.x * 0.25;
      group.current.rotation.x = Math.cos(t * 0.045) * 0.05 - p.y * 0.18;
    }
    camera.position.x += (p.x * 1.3 - camera.position.x) * 0.03;
    camera.position.y += (-p.y * 0.9 - camera.position.y) * 0.03;
    camera.position.z = 8 + Math.sin(t * 0.08) * 0.4;
    camera.lookAt(0, 0, 0);
  });

  return <group ref={group}>{children}</group>;
}

export default function SceneBackground() {
  const pointer = useRef<Pointer>({ x: 0, y: 0, tx: 0, ty: 0 });
  const reduce = usePrefersReducedMotion();
  const [isMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  // Mouse + touch interaction anywhere on the page (canvas stays click-through).
  useEffect(() => {
    if (reduce) return;
    const set = (cx: number, cy: number) => {
      pointer.current.tx = (cx / window.innerWidth) * 2 - 1;
      pointer.current.ty = (cy / window.innerHeight) * 2 - 1;
    };
    const pm = (e: PointerEvent) => set(e.clientX, e.clientY);
    const tm = (e: TouchEvent) => {
      if (e.touches[0]) set(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener("pointermove", pm, { passive: true });
    window.addEventListener("touchmove", tm, { passive: true });
    return () => {
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("touchmove", tm);
    };
  }, [reduce]);

  const particleCount = isMobile ? 1800 : 4800;
  const shards: { position: [number, number, number]; scale: number; speed: number }[] =
    isMobile
      ? [
          { position: [-3, 1.5, -4], scale: 0.9, speed: 0.8 },
          { position: [3.5, -1.5, -6], scale: 1.4, speed: 0.6 },
          { position: [0, 2.5, -8], scale: 1.1, speed: 0.5 },
        ]
      : [
          { position: [-4.5, 1.8, -3], scale: 0.9, speed: 0.9 },
          { position: [4.2, -2, -5], scale: 1.5, speed: 0.6 },
          { position: [-2, -2.5, -7], scale: 1.1, speed: 0.7 },
          { position: [3, 2.6, -9], scale: 1.8, speed: 0.45 },
          { position: [0.5, 0, -12], scale: 2.4, speed: 0.35 },
          { position: [-5, -0.5, -11], scale: 1.3, speed: 0.5 },
        ];

  return (
    <Canvas
      dpr={isMobile ? 1 : [1, 1.5]}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 60 }}
      frameloop={reduce ? "demand" : "always"}
    >
      <fogExp2 attach="fog" args={["#0d0b09", 0.04]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} color="#f5e6c8" />
      <pointLight position={[-7, 3, -2]} intensity={55} color="#c8a45c" distance={34} />
      <pointLight position={[7, -4, 2]} intensity={35} color="#b5764a" distance={30} />
      <pointLight position={[0, 1, -5]} intensity={40} color="#e6cd93" distance={26} />

      <Rig pointer={pointer}>
        <Particles count={particleCount} />
        {shards.map((s, i) => (
          <Shard key={i} {...s} />
        ))}
      </Rig>
    </Canvas>
  );
}
