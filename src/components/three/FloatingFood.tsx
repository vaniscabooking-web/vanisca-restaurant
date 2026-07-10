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

/** Dark-glass wine bottle with a gold label band and foil cap. */
function WineBottle() {
  const points = useMemo(
    () =>
      [
        [0.0, 0.0],
        [0.3, 0.0],
        [0.32, 0.06],
        [0.32, 0.92],
        [0.24, 1.1],
        [0.1, 1.28],
        [0.09, 1.52],
        [0.11, 1.56],
        [0.0, 1.58],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    [],
  );

  return (
    <group>
      <mesh castShadow>
        <latheGeometry args={[points, 48]} />
        <meshPhysicalMaterial
          color="#141d13"
          metalness={0.15}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Gold label band */}
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.328, 0.328, 0.26, 48, 1, true]} />
        <meshStandardMaterial {...brass} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Foil cap over the neck */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.1, 0.11, 0.24, 32]} />
        <meshStandardMaterial {...brass} roughness={0.22} />
      </mesh>
    </group>
  );
}

/**
 * Golden steam — a handful of additive points rising and fading above the
 * cloche. Brightness is written into vertex colors (additive blending reads
 * darker as more transparent), so no custom shader is needed. 40 points,
 * one small attribute update per frame.
 */
const STEAM_N = 40;

function Steam() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(STEAM_N * 3);
    const col = new Float32Array(STEAM_N * 3);
    for (let i = 0; i < STEAM_N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = Math.random() * 1.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    const pos = geo.getAttribute("position") as THREE.BufferAttribute;
    const col = geo.getAttribute("color") as THREE.BufferAttribute;
    for (let i = 0; i < STEAM_N; i++) {
      let y = pos.getY(i) + delta * (0.28 + (i % 5) * 0.05);
      if (y > 1.4) y = 0;
      pos.setY(i, y);
      // Bright at birth, fading as it climbs — candle-warm gold.
      const a = Math.sin((y / 1.4) * Math.PI) * 0.55;
      col.setXYZ(i, 0.78 * a, 0.64 * a, 0.36 * a);
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
  });

  return (
    <points geometry={geo}>
      <pointsMaterial
        size={0.09}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
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
        {/* Warm steam escaping the dome */}
        <group position={[0, 1.05, 0]}>
          <Steam />
        </group>
      </Float>
      <Float position={[3.5, 1.1, -6]} scale={1.5} speed={0.55}>
        <WineGlass />
      </Float>
      <Float position={[2.4, -2.2, -7.5]} scale={1.25} speed={0.5}>
        <Plates />
      </Float>
      <Float position={[-2.9, -2.1, -7]} scale={1.35} speed={0.45}>
        <WineBottle />
      </Float>
    </group>
  );
}
