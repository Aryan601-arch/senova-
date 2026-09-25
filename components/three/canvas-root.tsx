"use client";

import dynamic from "next/dynamic";
import { useWebGL } from "@/hooks/use-webgl";
import { useEffect } from "react";
import { webglStatusStore } from "@/lib/stores";

// Three.js, R3F and drei are split into their own chunk and only loaded on the client.
const WebGLCanvas = dynamic(() => import("./webgl-canvas"), { ssr: false });

export function CanvasRoot() {
  const supported = useWebGL();

  useEffect(() => {
    if (supported === false) webglStatusStore.set("failed");
  }, [supported]);

  if (!supported) return null;
  return <WebGLCanvas />;
}
