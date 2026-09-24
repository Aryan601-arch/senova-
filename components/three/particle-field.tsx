"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pointer } from "@/lib/stores";

type ParticleFieldProps = {
  count?: number;
  radius?: number;
  depth?: number;
  size?: number;
  color?: string;
  opacity?: number;
  /** How strongly particles drift away from the pointer. */
  pointerStrength?: number;
  speed?: number;
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uSpeed;
  attribute float aSeed;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float t = uTime * uSpeed;
    p.x += sin(t * 0.6 + aSeed * 12.0) * 0.18;
    p.y += cos(t * 0.5 + aSeed * 9.0) * 0.22 + sin(t * 0.13 + aSeed) * 0.1;
    p.z += sin(t * 0.4 + aSeed * 5.0) * 0.12;

    // Gently parallax with the pointer — nearer particles move more.
    p.xy += uPointer * uPointerStrength * (0.4 + aSeed * 0.6);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.35 + aSeed) * (8.0 / -mv.z);
    vAlpha = 0.25 + 0.75 * (0.5 + 0.5 * sin(t * 1.4 + aSeed * 40.0));
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
  }
`;

/** Deterministic PRNG (mulberry32) so particle layouts are pure and stable between renders. */
function seededRandom(seed: number) {
  let a = seed * 2654435761;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Soft, twinkling particles distributed in a slab. Fully GPU-animated. */
export function ParticleField({
  count = 600,
  radius = 8,
  depth = 6,
  size = 3,
  color = "#ffffff",
  opacity = 0.7,
  pointerStrength = 0.35,
  speed = 1,
}: ParticleFieldProps) {
  const material = useRef<THREE.ShaderMaterial>(null);

  const [positions, seeds] = useMemo(() => {
    const random = seededRandom(count);
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (random() - 0.5) * radius * 2;
      pos[i * 3 + 1] = (random() - 0.5) * radius * 1.2;
      pos[i * 3 + 2] = (random() - 0.5) * depth - 1;
      seed[i] = random();
    }
    return [pos, seed];
  }, [count, radius, depth]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: size },
      uPixelRatio: { value: 1 },
      uPointer: { value: new THREE.Vector2() },
      uPointerStrength: { value: pointerStrength },
      uSpeed: { value: speed },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    }),
    // Uniform objects are created once; values are synced below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state, delta) => {
    const m = material.current;
    if (!m) return;
    m.uniforms.uTime.value += delta;
    m.uniforms.uPixelRatio.value = state.viewport.dpr;
    m.uniforms.uColor.value.set(color);
    m.uniforms.uOpacity.value = opacity;
    m.uniforms.uSize.value = size;
    const target = m.uniforms.uPointer.value as THREE.Vector2;
    target.x += (pointer.x - target.x) * 0.04;
    target.y += (pointer.y - target.y) * 0.04;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
