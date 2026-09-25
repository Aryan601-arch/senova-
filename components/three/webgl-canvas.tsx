"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { View, PerformanceMonitor, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { webglStatusStore } from "@/lib/stores";
import { getDeviceTier } from "@/lib/webgl";

class CanvasErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[WebGL] Scene crashed, switching to static fallbacks.", error);
    webglStatusStore.set("failed");
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The single, shared WebGL canvas.
 *
 * Every 3D area on the page is a drei <View> that renders into this one canvas
 * with scissoring — one GL context, one render loop, no per-section canvases.
 * The canvas is fixed behind the content; pointer events come from <body>.
 */
export default function WebGLCanvas() {
  const [tier] = useState(getDeviceTier);
  const maxDpr = tier === "high" ? 1.75 : tier === "mid" ? 1.5 : 1.25;
  const [dpr, setDpr] = useState(maxDpr);

  useEffect(() => {
    return () => webglStatusStore.set("pending");
  }, []);

  return (
    <CanvasErrorBoundary>
      <Canvas
        style={{ position: "fixed", inset: 0, width: "100%", height: "100lvh", zIndex: 0, pointerEvents: "none" }}
        eventSource={document.body}
        eventPrefix="client"
        dpr={dpr}
        gl={{
          antialias: tier !== "low",
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        camera={{ position: [0, 0, 6], fov: 35 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          const canvas = gl.domElement;
          canvas.setAttribute("aria-hidden", "true");
          canvas.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            webglStatusStore.set("failed");
          });
          canvas.addEventListener("webglcontextrestored", () => webglStatusStore.set("ready"));
          webglStatusStore.set("ready");
        }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
          onIncline={() => setDpr((d) => Math.min(maxDpr, d + 0.25))}
          flipflops={3}
          onFallback={() => setDpr(1)}
        />
        <AdaptiveDpr pixelated={false} />
        <View.Port />
      </Canvas>
    </CanvasErrorBoundary>
  );
}
