import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Maps a value from one range to another, clamped. */
export const mapRange = (v: number, inMin: number, inMax: number, outMin = 0, outMax = 1) =>
  lerp(outMin, outMax, clamp((v - inMin) / (inMax - inMin)));

/**
 * The site's public origin. Uses NEXT_PUBLIC_SITE_URL when set, otherwise the
 * domain Vercel assigns to the deployment, otherwise the default domain.
 */
export const siteUrl = (() => {
  const vercelHost =
    process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_URL;
  const url =
    process.env.NEXT_PUBLIC_SITE_URL || (vercelHost ? `https://${vercelHost}` : "https://senova.studio");
  return url.replace(/\/$/, "");
})();

export const absoluteUrl = (path = "/") => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
