"use client";

import { Environment, Lightformer } from "@react-three/drei";
import type { ScenePalette } from "./scene-theme";

/**
 * Procedural studio lighting — reflections for chrome and glass without
 * downloading HDR files. Rendered once into a small cube map.
 */
export function SceneEnvironment({ palette, intensity = 1 }: { palette: ScenePalette; intensity?: number }) {
  const k = palette.isDark ? 1 : 1.35;
  return (
    <>
      <Environment key={palette.isDark ? "dark" : "light"} resolution={256} frames={1} environmentIntensity={intensity}>
        <color attach="background" args={[palette.isDark ? "#050608" : "#d9d8d2"]} />
        <Lightformer form="rect" intensity={3 * k} position={[0, 5, -3]} scale={[12, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.2 * k} position={[0, 0, -8]} scale={[20, 8, 1]} color={palette.isDark ? "#3a4050" : "#ffffff"} />
        <Lightformer form="rect" intensity={1.5 * k} position={[0, -4, 3]} rotation-x={Math.PI / 2} scale={[10, 6, 1]} color="#ffffff" />
        <Lightformer form="circle" intensity={5} position={[-6, 1.5, 0]} scale={3.5} color={palette.accent} />
        <Lightformer form="ring" intensity={4} position={[6, -1, -2]} scale={4} color={palette.accent2} />
        <Lightformer form="rect" intensity={2} position={[4, 3, 5]} scale={[3, 3, 1]} color={palette.warm} target={[0, 0, 0]} />
      </Environment>
      <ambientLight intensity={palette.isDark ? 0.25 : 0.6} />
      <directionalLight position={[4, 6, 5]} intensity={palette.isDark ? 1.4 : 1.8} color="#ffffff" />
      <directionalLight position={[-5, -2, -4]} intensity={0.8} color={palette.accent2} />
    </>
  );
}
