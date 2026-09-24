let cached: boolean | null = null;

/** Detects WebGL2/WebGL support once and caches the result. */
export function isWebGLAvailable(): boolean {
  if (cached !== null) return cached;
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    cached = !!gl;
    // Release the probe context immediately.
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}

export type DeviceTier = "low" | "mid" | "high";

/** Rough GPU/CPU budget used to scale particle counts, DPR and material quality. */
export function getDeviceTier(): DeviceTier {
  if (typeof window === "undefined") return "mid";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (small || cores <= 4 || memory <= 4) return "low";
  if (coarse || cores <= 8) return "mid";
  return "high";
}
