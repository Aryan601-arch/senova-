"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getDeviceTier } from "@/lib/webgl";
import { useScenePalette } from "../scene-theme";
import { useSectionProgress } from "../use-section-progress";
import { useViewPointer } from "../view-context";

/** Technology: a wireframe planet of dots and orbit rings behind the floating tech chips. */
export default function TechnologyScene({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const palette = useScenePalette();
  const [tier] = useState(getDeviceTier);
  const progress = useSectionProgress(sectionRef);
  const vp = useViewPointer(0.04);
  const planet = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);

  const dots = useMemo(() => {
    const count = tier === "low" ? 900 : 1800;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = i * Math.PI * (3 - Math.sqrt(5));
      pos[i * 3] = Math.cos(theta) * r * 1.6;
      pos[i * 3 + 1] = y * 1.6;
      pos[i * 3 + 2] = Math.sin(theta) * r * 1.6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [tier]);

  useFrame((state, delta) => {
    const p = progress.current.progress;
    if (planet.current) {
      planet.current.rotation.y += delta * 0.08;
      planet.current.rotation.x = THREE.MathUtils.damp(planet.current.rotation.x, 0.35 - vp.current.y * 0.25 + (p - 0.5) * 0.6, 3, delta);
      planet.current.rotation.z = THREE.MathUtils.damp(planet.current.rotation.z, vp.current.x * 0.15, 3, delta);
    }
    if (rings.current) {
      rings.current.rotation.z = state.clock.elapsedTime * 0.05;
      rings.current.rotation.x = THREE.MathUtils.damp(rings.current.rotation.x, 1.25 + (p - 0.5) * 0.5, 3, delta);
    }
  });

  return (
    <>
      <group ref={planet}>
        <points geometry={dots}>
          <pointsMaterial color={palette.fg} size={0.018} sizeAttenuation transparent opacity={palette.isDark ? 0.55 : 0.45} depthWrite={false} />
        </points>
        <mesh>
          <sphereGeometry args={[1.56, 48, 48]} />
          <meshBasicMaterial color={palette.bg} transparent opacity={0.85} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.62, 1]} />
          <meshBasicMaterial color={palette.accent2} wireframe transparent opacity={0.18} />
        </mesh>
      </group>
      <group ref={rings}>
        <mesh>
          <torusGeometry args={[2.5, 0.004, 8, 256]} />
          <meshBasicMaterial color={palette.accent} toneMapped={false} transparent opacity={0.7} />
        </mesh>
        <mesh rotation={[0, 0.35, 0]}>
          <torusGeometry args={[3.1, 0.003, 8, 256]} />
          <meshBasicMaterial color={palette.fg} transparent opacity={0.25} />
        </mesh>
        <mesh position={[2.5, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={palette.accent} toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}
