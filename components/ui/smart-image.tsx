"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type SmartImageProps = ImageProps & { fallbackLabel?: string; accent?: string };

/**
 * next/image wrapper (AVIF/WebP, lazy by default) with a designed fallback when
 * the file is missing or fails to load, so layouts never break.
 */
export function SmartImage({ className, fallbackLabel, accent = "var(--accent)", alt, ...props }: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed || !props.src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("absolute inset-0 grid place-items-center overflow-hidden bg-bg-sunken", className)}
        style={{
          backgroundImage: `radial-gradient(60% 60% at 30% 30%, color-mix(in oklab, ${accent} 35%, transparent), transparent 70%), radial-gradient(50% 50% at 80% 80%, color-mix(in oklab, var(--accent-2) 25%, transparent), transparent 70%)`,
        }}
      >
        <span className="flex flex-col items-center gap-2 text-fg-muted">
          <ImageOff className="size-6" aria-hidden="true" />
          <span className="eyebrow">{fallbackLabel ?? "Image unavailable"}</span>
        </span>
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      className={cn("transition-opacity duration-700", loaded ? "opacity-100" : "opacity-0", className)}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
