/**
 * Content for the immersive 3D showcase.
 * Each chapter is a scroll stage; each node is a clickable 3D object with a label.
 */

export type ShowcaseChapter = {
  id: string;
  label: string;
  title: string;
  text: string;
};

export const showcaseChapters: ShowcaseChapter[] = [
  {
    id: "core",
    label: "01 — Core",
    title: "Every product starts with a core idea.",
    text: "A clear centre of gravity that every screen, interaction and line of code orbits around.",
  },
  {
    id: "system",
    label: "02 — System",
    title: "Then we build the system around it.",
    text: "Design tokens, components, APIs and infrastructure snap into place as one connected structure.",
  },
  {
    id: "orbit",
    label: "03 — Orbit",
    title: "And set it in motion.",
    text: "Launch is where the real work begins: measure, learn and keep the whole system moving.",
  },
];

export type ShowcaseNode = {
  id: string;
  label: string;
  detail: string;
  metric: string;
  shape: "icosahedron" | "torus" | "octahedron" | "box" | "sphere";
  material: "chrome" | "glass" | "matte";
  color: string;
};

export const showcaseNodes: ShowcaseNode[] = [
  {
    id: "interface",
    label: "Interface",
    detail: "Accessible, responsive UI with motion that explains rather than decorates.",
    metric: "WCAG 2.2 AA",
    shape: "icosahedron",
    material: "chrome",
    color: "#d4ff3f",
  },
  {
    id: "realtime",
    label: "Real-time 3D",
    detail: "WebGL scenes tuned per device so they stay smooth on phones and dazzling on desktops.",
    metric: "60 fps target",
    shape: "torus",
    material: "glass",
    color: "#7b8cff",
  },
  {
    id: "data",
    label: "Data layer",
    detail: "Typed APIs, caching and real-time sync that keep every client consistent.",
    metric: "< 100ms p95",
    shape: "octahedron",
    material: "chrome",
    color: "#43e5c4",
  },
  {
    id: "intelligence",
    label: "Intelligence",
    detail: "AI features grounded in your data, with evaluation and guardrails built in.",
    metric: "Eval-driven",
    shape: "sphere",
    material: "glass",
    color: "#ff7a45",
  },
  {
    id: "cloud",
    label: "Cloud",
    detail: "Edge-first infrastructure with CI/CD, observability and cost controls.",
    metric: "99.99% uptime",
    shape: "box",
    material: "matte",
    color: "#58b8ff",
  },
];
