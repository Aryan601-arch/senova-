"use client";

import { Component, Suspense, useMemo, type ReactNode } from "react";
import { useGLTF, Center } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

/**
 * Loads a GLB/GLTF model from /public/models with graceful fallbacks.
 *
 * Usage (inside any scene):
 *   <Model url="/models/product.glb" scale={1.2} fallback={<ProceduralShape />} />
 *
 * - While loading, `fallback` is shown.
 * - If the file is missing or invalid, `fallback` stays on screen and a warning is logged.
 * - Draco-compressed files are supported (decoder is loaded from the gstatic CDN by drei).
 */
type ModelProps = ThreeElements["group"] & {
  url: string;
  fallback?: ReactNode;
  center?: boolean;
};

function GltfModel({ url, center = true, ...props }: Omit<ModelProps, "fallback">) {
  const { scene } = useGLTF(url, true);
  // Clone so the same cached model can be placed multiple times.
  const object = useMemo(() => scene.clone(true), [scene]);
  return (
    <group {...props}>{center ? <Center>{<primitive object={object} />}</Center> : <primitive object={object} />}</group>
  );
}

class ModelErrorBoundary extends Component<{ fallback: ReactNode; url: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn(`[Model] Could not load "${this.props.url}". Showing fallback instead.`, error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function Model({ fallback = null, ...props }: ModelProps) {
  return (
    <ModelErrorBoundary fallback={fallback} url={props.url}>
      <Suspense fallback={fallback}>
        <GltfModel {...props} />
      </Suspense>
    </ModelErrorBoundary>
  );
}

/** Call at module level to start downloading a model before it is rendered. */
export const preloadModel = (url: string) => useGLTF.preload(url, true);
