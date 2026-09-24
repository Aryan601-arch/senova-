"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { useViewPointer } from "./view-context";

type InteractiveGridProps = Omit<ThreeElements["mesh"], "args"> & {
  size?: number;
  cells?: number;
  color?: string;
  glowColor?: string;
  /** Pointer glow radius in plane UV units. */
  glowRadius?: number;
  opacity?: number;
};

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uActive;
  void main() {
    vUv = uv;
    vec3 p = position;
    float d = distance(uv, uPointer);
    // A soft ripple lifts the grid around the pointer.
    p.z += uActive * smoothstep(0.2, 0.0, d) * 0.3 * (0.6 + 0.4 * sin(uTime * 2.0 - d * 30.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform vec3 uGlow;
  uniform vec2 uPointer;
  uniform float uCells;
  uniform float uRadius;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uActive;

  float gridLine(vec2 uv, float cells) {
    vec2 g = abs(fract(uv * cells - 0.5) - 0.5) / fwidth(uv * cells);
    return 1.0 - min(min(g.x, g.y), 1.0);
  }

  void main() {
    float line = gridLine(vUv, uCells);
    float major = gridLine(vUv, uCells / 5.0);
    float d = distance(vUv, uPointer);
    float glow = smoothstep(uRadius, 0.0, d) * uActive;
    // Radial fade to the edges so the grid dissolves into the background.
    float fade = smoothstep(0.5, 0.1, distance(vUv, vec2(0.5)));
    // A slow scanline sweeping across the grid.
    float scan = smoothstep(0.015, 0.0, abs(fract(vUv.y - uTime * 0.04) - 0.5));
    vec3 col = mix(uColor, uGlow, clamp(glow * 1.5 + scan * 0.6, 0.0, 1.0));
    float alpha = (line * 0.4 + major * 0.35) * fade * uOpacity;
    alpha += glow * line * 0.9 * fade;
    alpha += scan * line * fade * 0.35;
    gl_FragColor = vec4(col, alpha);
  }
`;

/** Shader grid that glows and ripples under the pointer. */
export function InteractiveGrid({
  size = 30,
  cells = 40,
  color = "#3a3d45",
  glowColor = "#d4ff3f",
  glowRadius = 0.12,
  opacity = 1,
  ...props
}: InteractiveGridProps) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const viewPointer = useViewPointer(1);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uGlow: { value: new THREE.Color(glowColor) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uCells: { value: cells },
      uRadius: { value: glowRadius },
      uOpacity: { value: opacity },
      uActive: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state, delta) => {
    const m = mat.current;
    if (!m || !mesh.current) return;
    m.uniforms.uTime.value += delta;
    m.uniforms.uColor.value.set(color);
    m.uniforms.uGlow.value.set(glowColor);
    m.uniforms.uOpacity.value = opacity;
    // Project the pointer onto the plane to find the glow centre.
    raycaster.setFromCamera(viewPointer.current.ndc, state.camera);
    const hit = raycaster.intersectObject(mesh.current, false)[0];
    const active = viewPointer.current.inside && !!hit?.uv;
    m.uniforms.uActive.value = THREE.MathUtils.damp(m.uniforms.uActive.value, active ? 1 : 0, 4, delta);
    if (hit?.uv) {
      const p = m.uniforms.uPointer.value as THREE.Vector2;
      p.lerp(hit.uv, 0.12);
    }
  });

  return (
    <mesh ref={mesh} {...props}>
      <planeGeometry args={[size, size, 96, 96]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        extensions={{ derivatives: true } as never}
      />
    </mesh>
  );
}
