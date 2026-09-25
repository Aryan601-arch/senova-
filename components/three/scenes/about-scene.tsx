"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScenePalette } from "../scene-theme";
import { SceneEnvironment } from "../scene-environment";
import { RotatingObject } from "../rotating-object";
import { ParticleField } from "../particle-field";
import { useSectionProgress } from "../use-section-progress";

/**
 * About: a gyroscope of three nested rings (strategy, design, engineering)
 * that unlock and realign as the section scrolls, around a glowing core.
 */
export default function AboutScene({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const palette = useScenePalette();
  const progress = useSectionProgress(sectionRef);
  const outer = useRef<THREE.Mesh>(null);
  const middle = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const p = progress.current.progress;
    const t = state.clock.elapsedTime;
    const spin = p * Math.PI * 2;
    if (outer.current) {
      outer.current.rotation.x = THREE.MathUtils.damp(outer.current.rotation.x, Math.PI / 2 + spin * 0.6, 5, delta);
      outer.current.rotation.y = THREE.MathUtils.damp(outer.current.rotation.y, spin * 0.25 + t * 0.05, 5, delta);
    }
    if (middle.current) {
      middle.current.rotation.y = THREE.MathUtils.damp(middle.current.rotation.y, spin * 1.1 + t * 0.1, 5, delta);
      middle.current.rotation.z = THREE.MathUtils.damp(middle.current.rotation.z, 0.4 + spin * 0.3, 5, delta);
    }
    if (inner.current) {
      inner.current.rotation.x = THREE.MathUtils.damp(inner.current.rotation.x, spin * 1.6 + t * 0.2, 5, delta);
      inner.current.rotation.z = THREE.MathUtils.damp(inner.current.rotation.z, -spin * 0.8, 5, delta);
    }
    if (core.current) {
      const s = 0.32 + Math.sin(t * 1.6) * 0.02;
      core.current.scale.setScalar(s);
    }
  });

  return (
    <>
      <SceneEnvironment palette={palette} />
      <RotatingObject speed={[0, 0.06, 0]} pointerTilt={0.4}>
        <mesh ref={outer}>
          <torusGeometry args={[1.55, 0.07, 32, 200]} />
          <meshPhysicalMaterial color={palette.metal} metalness={1} roughness={0.15} clearcoat={1} />
        </mesh>
        <mesh ref={middle}>
          <torusGeometry args={[1.18, 0.1, 32, 160]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0.1}
            roughness={0.05}
            iridescence={1}
            iridescenceIOR={1.35}
            clearcoat={1}
            transparent
            opacity={0.5}
            envMapIntensity={2.4}
          />
        </mesh>
        <mesh ref={inner}>
          <torusGeometry args={[0.82, 0.05, 32, 140]} />
          <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={0.6} metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh ref={core}>
          <icosahedronGeometry args={[1, 3]} />
          <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={1.6} toneMapped={false} flatShading />
        </mesh>
      </RotatingObject>
      <ParticleField count={160} radius={3} depth={3} size={2.2} color={palette.particle} opacity={0.6} pointerStrength={0.15} />
    </>
  );
}
