"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { ProductArt } from "../product-art";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false, loading: () => <StaticStage /> });

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const noop = () => () => {};

let deviceMode: "full" | "compact" | "static" | undefined;
function getDeviceMode() {
  deviceMode ??= supportsWebGL()
    ? window.matchMedia("(max-width: 768px)").matches
      ? "compact"
      : "full"
    : "static";
  return deviceMode;
}

/** Drawn stand-in shown before the 3D loads, and instead of it where WebGL is unavailable. */
function StaticStage() {
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-2 pb-[12%]" aria-hidden="true">
      <ProductArt kind="lotion" name="Rose Toner" className="h-[52%] w-auto" />
      <ProductArt kind="serum" name="Rose Serum" className="h-[62%] w-auto" />
      <ProductArt kind="jar" name="Vitamin C Cream" className="h-[40%] w-auto" />
    </div>
  );
}

export function HeroStage() {
  // "server" on the server and first render, then what this device supports.
  const mode = useSyncExternalStore(
    noop,
    getDeviceMode,
    () => "server",
  );

  if (mode === "server" || mode === "static") return <StaticStage />;
  return (
    <div className="absolute inset-0">
      <HeroScene compact={mode === "compact"} />
    </div>
  );
}
