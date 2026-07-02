"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useEffect, useState, type ReactNode } from "react";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import FloatingFood from "./FloatingFood";
import Particles from "./Particles";

/**
 * Full-screen 3D background scene.
 *
 * Note on OrbitControls: this canvas is a fixed background layer behind the
 * whole site and must stay pointer-events:none — attaching OrbitControls
 * would require capturing pointer events on the canvas (blocking every link
 * and button) and its one-finger drag hijacks page scrolling on touch.
 * PointerRig below keeps the same semantics (rotate only — no zoom, no pan)
 * but reads window-level mouse/touch, so the page stays fully usable.
 */

type Pointer = { x: number; y: number; tx: number; ty: number };

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

/** Rotate-only camera rig driven by window mouse/touch (OrbitControls stand-in). */
function PointerRig({
  pointer,
  children,
}: {
  pointer: React.MutableRefObject<Pointer>;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = pointer.current;
    p.x += (p.tx - p.x) * 0.045;
    p.y += (p.ty - p.y) * 0.045;

    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.05) * 0.08 + p.x * 0.3;
      group.current.rotation.x = Math.cos(t * 0.045) * 0.05 - p.y * 0.2;
    }
    state.camera.position.z = 6 + Math.sin(t * 0.08) * 0.3;
    state.camera.lookAt(0, 0, 0);
  });

  return <group ref={group}>{children}</group>;
}

export default function Scene() {
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

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      shadows={!isMobile}
      dpr={isMobile ? 1 : [1, 1.5]}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: "high-performance",
      }}
      frameloop={reduce ? "demand" : "always"}
    >
      <Suspense fallback={null}>
        <fogExp2 attach="fog" args={["#0d0b09", 0.045]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <pointLight position={[-6, 3, -2]} intensity={40} color="#c8a45c" distance={30} />

        <PointerRig pointer={pointer}>
          <FloatingFood mobile={isMobile} />
          <Particles count={isMobile ? 1800 : 4800} />
        </PointerRig>

        {/* HDR environment lighting; own Suspense so the scene never waits on the CDN. */}
        {!isMobile && (
          <Suspense fallback={null}>
            <Environment preset="dawn" />
          </Suspense>
        )}
      </Suspense>
    </Canvas>
  );
}
