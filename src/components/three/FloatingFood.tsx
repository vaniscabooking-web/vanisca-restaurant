"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function FloatingFood() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    // 0.12 * delta ≈ 0.002/frame at 60 fps, but frame-rate independent.
    group.current.rotation.y += delta * 0.12;
    group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3;
  });

  return (
    <group ref={group}>
      <mesh position={[-2, 0, 0]} castShadow>
        <torusKnotGeometry args={[1, 0.3, 100]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[2, 0, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#ff6b6b" metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
}
