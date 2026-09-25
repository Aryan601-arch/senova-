"use client";

import { useRef, type ReactNode } from "react";
import { View } from "@react-three/drei";
import { PerspectiveCamera } from "@react-three/drei";
import { webglStatusStore } from "@/lib/stores";
import { cn } from "@/lib/utils";
import { SceneFallback } from "./scene-fallback";
import { ViewElementContext } from "./view-context";

type SceneViewProps = {
  children: ReactNode;
  /** Wrapper classes. Must include a position utility (defaults to `relative`). */
  className?: string;
  /** Classes for the element the View tracks (defaults to filling the wrapper). */
  viewClassName?: string;
  fallback?: ReactNode;
  camera?: { position?: [number, number, number]; fov?: number };
  /** Render order among views. */
  index?: number;
  /** Accessible description of what the visual shows. */
  label?: string;
  /** Allow pointer interaction with 3D objects in this view. */
  interactive?: boolean;
};

/**
 * A DOM slot for a 3D scene. Renders a <View> into the shared canvas plus a
 * static fallback that stays visible until WebGL is ready (or forever if it fails).
 */
export function SceneView({
  children,
  className,
  viewClassName,
  fallback,
  camera,
  index = 1,
  label,
  interactive = false,
}: SceneViewProps) {
  const status = webglStatusStore.use();
  const viewRef = useRef<HTMLElement>(null);

  return (
    <div className={cn(className ?? "relative")} role={label ? "img" : undefined} aria-label={label}>
      <div className={cn("transition-opacity duration-1000", status === "ready" ? "opacity-0" : "opacity-100")}>
        {fallback ?? <SceneFallback />}
      </div>
      {status !== "failed" && (
        <View
          ref={viewRef}
          index={index}
          className={cn("absolute inset-0", !interactive && "pointer-events-none", viewClassName)}
        >
          <ViewElementContext.Provider value={viewRef}>
            <PerspectiveCamera makeDefault position={camera?.position ?? [0, 0, 6]} fov={camera?.fov ?? 35} />
            {children}
          </ViewElementContext.Provider>
        </View>
      )}
    </div>
  );
}
