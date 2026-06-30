"use client";

import { useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A single refined, slowly rotating faceted form with warm gold lighting.
 * Deliberately low-poly and cheap to render — this is an ambient accent that
 * sits BEHIND the hero text, never the LCP element.
 */
function CrystalForm(props: ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current || !mesh.current) return;
    // Gentle continuous rotation + a soft breathing float.
    mesh.current.rotation.x += delta * 0.12;
    mesh.current.rotation.y += delta * 0.16;
    const t = state.clock.elapsedTime;
    group.current.position.y = Math.sin(t * 0.5) * 0.15;
    // Subtle parallax toward the pointer (eased).
    const px = state.pointer.x * 0.25;
    const py = state.pointer.y * 0.2;
    group.current.rotation.y += (px - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (-py - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group} {...props}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.6, 0]} />
        <meshStandardMaterial
          color="#3a2a18"
          metalness={0.95}
          roughness={0.25}
          emissive="#5a3a1c"
          emissiveIntensity={0.15}
          flatShading
        />
      </mesh>
      {/* Gold hairline edges for a crafted, jewel-like feel. */}
      <lineSegments scale={1.605}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1.6, 0)]} />
        <lineBasicMaterial color="#c8a45c" transparent opacity={0.5} />
      </lineSegments>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      // Cap pixel ratio: visual quality stays high, GPU cost stays low.
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 42 }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 5]} intensity={1.6} color="#f5e6c8" />
      <pointLight position={[-5, -2, 2]} intensity={40} color="#b5764a" distance={20} />
      <pointLight position={[3, -3, 4]} intensity={20} color="#e3c889" distance={18} />
      <CrystalForm position={[0, 0, 0]} />
    </Canvas>
  );
}
