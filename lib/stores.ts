import { createStore } from "./store";

export type Theme = "dark" | "light";

/** Current color theme. Initialised from <html data-theme> by ThemeProvider. */
export const themeStore = createStore<Theme>("dark");

/**
 * Normalised pointer position (-1..1) relative to the viewport.
 * Mutated directly (no listeners) because it changes every frame.
 */
export const pointer = { x: 0, y: 0, clientX: -1, clientY: -1, active: false };

/** Index of the hovered/active product range, read by the ranges 3D visual. */
export const activeServiceStore = createStore<number>(0);

/** Whether the loading screen has finished. Sections wait for this before animating in. */
export const loaderStore = createStore<boolean>(false);

/** Custom cursor state (label shown inside the cursor, e.g. "View"). */
export const cursorStore = createStore<{ label: string | null; variant: "default" | "hover" | "text" | "hidden" }>({
  label: null,
  variant: "default",
});

/**
 * WebGL availability for the single shared canvas.
 * "pending" until the canvas is created; "ready" when rendering; "failed" when WebGL
 * is unavailable, the context was lost, or a scene crashed. Sections show a designed
 * fallback whenever the status is not "ready".
 */
export const webglStatusStore = createStore<"pending" | "ready" | "failed">("pending");
