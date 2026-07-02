"use client";

import { useRef, useMemo, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Stylized fine-dining objects (serving cloche, plates, wine glass, bowl)
 * built from pure geometry — no heavy GLTF downloads — floating and slowly
 * rotating at different depths. Materials are brass / ceramic / glass to fit
 * the restaurant's luxury identity.
 */

const brass = {
  color: "#b08d57",
  metalness: 0.95,
  roughness: 0.28,
  emissive: "#3a2a18",
  emissiveIntensity: 0.18,
} as const;

const ceramic = {
  color: "#f4eee2",
  metalness: 0.05,
  roughness: 0.4,
} as const;

function Float({
  position,
  scale = 1,
  speed = 1,
  children,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const seed = useMemo(() => Math.random() * 10, []);

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y += delta * 0.22 * speed;
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 * speed + seed) * 0.18;
    g.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.45 * speed + seed) * 0.4;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {children}
    </group>
  );
}

/** Serving cloche: brass dome + knob + rim. */
function Cloche() {
  return (
    <group>
      <mesh castShadow>
        <sphereGeometry args={[0.85, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...brass} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.92, 0]} castShadow>
        <sphereGeometry args={[0.09, 16, 12]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      <mesh position={[0, -0.01, 0]}>
        <torusGeometry args={[0.85, 0.035, 12, 40]} />
        <meshStandardMaterial {...brass} />
      </mesh>
    </group>
  );
}

/** Small stack of ceramic plates. */
function Plates() {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.9, 0.72, 0.07, 40]} />
        <meshStandardMaterial {...ceramic} />
      </mesh>
      <mesh position={[0, 0.09, 0]} castShadow>
        <cylinderGeometry args={[0.74, 0.6, 0.07, 40]} />
        <meshStandardMaterial {...ceramic} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <torusGeometry args={[0.55, 0.012, 8, 40]} />
        <meshStandardMaterial {...brass} />
      </mesh>
    </group>
  );
}

/** Wine glass silhouette (lathe geometry) in light glass. */
function WineGlass() {
  const points = useMemo(
    () =>
      [
        [0.0, 0.0],
        [0.4, 0.0],
        [0.4, 0.04],
        [0.06, 0.08],
        [0.05, 0.72],
        [0.18, 0.8],
        [0.4, 0.98],
        [0.45, 1.28],
        [0.42, 1.5],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    [],
  );

  return (
    <mesh castShadow>
      <latheGeometry args={[points, 40]} />
      <meshPhysicalMaterial
        color="#f8f4ea"
        metalness={0}
        roughness={0.06}
        transparent
        opacity={0.22}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Open brass bowl. */
function Bowl() {
  return (
    <mesh castShadow rotation={[Math.PI, 0, 0]}>
      <sphereGeometry args={[0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial {...brass} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function FloatingFood({ mobile = false }: { mobile?: boolean }) {
  return (
    <group>
      <Float position={[-4.2, 1.6, -3.5]} scale={0.9} speed={0.8}>
        <Cloche />
      </Float>
      <Float position={[4, -1.8, -5]} scale={1.15} speed={0.6}>
        <Plates />
      </Float>
      <Float position={[0.5, 2.4, -7]} scale={1.2} speed={0.7}>
        <WineGlass />
      </Float>
      {!mobile && (
        <>
          <Float position={[-2.6, -2.6, -8]} scale={1.3} speed={0.5}>
            <Bowl />
          </Float>
          <Float position={[3.2, 2.8, -10]} scale={1.6} speed={0.4}>
            <Cloche />
          </Float>
          <Float position={[-5.5, -0.4, -11]} scale={1.4} speed={0.45}>
            <WineGlass />
          </Float>
        </>
      )}
    </group>
  );
}
