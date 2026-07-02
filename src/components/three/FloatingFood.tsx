"use client";

import { useRef, useMemo, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Restaurant-themed ambient 3D: a brass serving cloche, a crystal wine glass
 * and a stack of ceramic plates — refined table-setting pieces, not generic
 * shapes. Built from pure geometry (zero model downloads), smooth-shaded so
 * the HDR environment reads as realistic polished metal/glass. Placed deep
 * and moved slowly so they support the brand without distracting.
 */

const brass = {
  color: "#b08d57",
  metalness: 0.95,
  roughness: 0.18,
  emissive: "#2a1f12",
  emissiveIntensity: 0.15,
} as const;

const ceramic = {
  color: "#f4eee2",
  metalness: 0.05,
  roughness: 0.35,
} as const;

/** Gentle float: slow yaw + soft bob. Deliberately calm — ambience, not spectacle. */
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
    g.rotation.y += delta * 0.16 * speed;
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.25 * speed + seed) * 0.08;
    g.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.4 * speed + seed) * 0.25;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {children}
    </group>
  );
}

/** Brass serving cloche: polished dome + knob + rim. */
function Cloche() {
  return (
    <group>
      <mesh castShadow>
        <sphereGeometry args={[0.85, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...brass} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.92, 0]} castShadow>
        <sphereGeometry args={[0.09, 20, 14]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      <mesh position={[0, -0.01, 0]}>
        <torusGeometry args={[0.85, 0.035, 14, 48]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      {/* Serving tray under the dome */}
      <mesh position={[0, -0.08, 0]} castShadow>
        <cylinderGeometry args={[1.05, 1.12, 0.06, 48]} />
        <meshStandardMaterial {...brass} roughness={0.25} />
      </mesh>
    </group>
  );
}

/** Crystal wine glass (lathe silhouette). */
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
      <latheGeometry args={[points, 48]} />
      <meshPhysicalMaterial
        color="#f8f4ea"
        metalness={0}
        roughness={0.05}
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Stack of ceramic plates with a fine brass rim. */
function Plates() {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.9, 0.72, 0.07, 48]} />
        <meshStandardMaterial {...ceramic} />
      </mesh>
      <mesh position={[0, 0.09, 0]} castShadow>
        <cylinderGeometry args={[0.74, 0.6, 0.07, 48]} />
        <meshStandardMaterial {...ceramic} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <torusGeometry args={[0.55, 0.012, 10, 48]} />
        <meshStandardMaterial {...brass} />
      </mesh>
    </group>
  );
}

export default function FloatingFood() {
  return (
    <group>
      <Float position={[-3.4, 0.7, -4.5]} scale={1.05} speed={0.7}>
        <Cloche />
      </Float>
      <Float position={[3.5, 1.1, -6]} scale={1.5} speed={0.55}>
        <WineGlass />
      </Float>
      <Float position={[2.4, -2.2, -7.5]} scale={1.25} speed={0.5}>
        <Plates />
      </Float>
    </group>
  );
}
