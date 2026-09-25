"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getDeviceTier } from "@/lib/webgl";
import { useScenePalette } from "../scene-theme";
import { SceneEnvironment } from "../scene-environment";
import { ParticleField } from "../particle-field";
import { InteractiveGrid } from "../interactive-grid";
import { useViewPointer } from "../view-context";

/** Contact: a glass orb that drifts after the cursor above a rippling grid. */
export default function ContactScene() {
  const palette = useScenePalette();
  const [tier] = useState(getDeviceTier);
  const { viewport, size } = useThree();
  const wide = size.width >= 1024;
  // The view spans the whole (tall) section, so size the orb in screen pixels, not world units.
  const pxPerUnit = size.height / viewport.height;
  const orbScale = (wide ? 210 : 64) / (0.85 * pxPerUnit);
  const px = (n: number) => n / pxPerUnit;
  const vp = useViewPointer(0.035);
  const orb = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (orb.current) {
      // On wide screens the orb stays on the left, behind the headline, away from the form.
      // On phones it tucks into the top-right corner, small, above the heading.
      const tx = wide
        ? -viewport.width * 0.27 + vp.current.x * viewport.width * 0.08
        : viewport.width / 2 - px(80) + vp.current.x * px(20);
      const ty = wide
        ? -viewport.height * 0.12 + vp.current.y * viewport.height * 0.08
        : viewport.height / 2 - px(150) + vp.current.y * px(20);
      orb.current.position.x = THREE.MathUtils.damp(orb.current.position.x, tx, 2, delta);
      orb.current.position.y = THREE.MathUtils.damp(orb.current.position.y, ty + Math.sin(t) * 0.1, 2, delta);
      orb.current.rotation.y += delta * 0.3;
    }
    if (ring.current) {
      ring.current.rotation.x = 1.2 + Math.sin(t * 0.5) * 0.2;
      ring.current.rotation.z = t * 0.3;
    }
  });

  return (
    <>
      <SceneEnvironment palette={palette} />
      <group ref={orb} position={[0, 0.4, 0]} scale={orbScale}>
        <mesh>
          <sphereGeometry args={[0.85, 64, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0.15}
            roughness={0.04}
            clearcoat={1}
            iridescence={1}
            iridescenceIOR={1.35}
            transparent
            opacity={palette.isDark ? 0.45 : 0.55}
            envMapIntensity={2.5}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
        <mesh ref={ring}>
          <torusGeometry args={[1.25, 0.006, 8, 180]} />
          <meshBasicMaterial color={palette.accent} toneMapped={false} />
        </mesh>
      </group>
      <InteractiveGrid
        position={[0, -1.6, -2]}
        rotation={[-Math.PI / 2.3, 0, 0]}
        size={30}
        cells={50}
        color={palette.grid}
        glowColor={palette.accent}
        glowRadius={0.1}
        opacity={palette.isDark ? 1 : 0.6}
      />
      <ParticleField count={tier === "low" ? 180 : 420} radius={9} depth={6} size={2.4} color={palette.particle} opacity={palette.isDark ? 0.6 : 0.4} />
    </>
  );
}
