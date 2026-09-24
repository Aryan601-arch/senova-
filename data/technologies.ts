export type Technology = {
  name: string;
  short: string;
  category: "Frontend" | "3D" | "Backend" | "AI" | "Cloud" | "Design";
  description: string;
  /** Years of production use on client projects. */
  experience: string;
};

export const technologies: Technology[] = [
  {
    name: "React",
    short: "Re",
    category: "Frontend",
    description: "Component-driven interfaces with concurrent rendering and server components.",
    experience: "8 yrs",
  },
  {
    name: "Next.js",
    short: "Nx",
    category: "Frontend",
    description: "Our default for fast, SEO-friendly products with edge rendering.",
    experience: "6 yrs",
  },
  {
    name: "Three.js",
    short: "3j",
    category: "3D",
    description: "Real-time 3D, shaders and WebGL experiences that run everywhere.",
    experience: "5 yrs",
  },
  {
    name: "Node.js",
    short: "No",
    category: "Backend",
    description: "APIs, real-time services and tooling in one language across the stack.",
    experience: "8 yrs",
  },
  {
    name: "Python",
    short: "Py",
    category: "AI",
    description: "Data pipelines, ML models and evaluation tooling.",
    experience: "7 yrs",
  },
  {
    name: "AI",
    short: "Ai",
    category: "AI",
    description: "LLMs, retrieval and agents wired into real product workflows.",
    experience: "3 yrs",
  },
  {
    name: "AWS",
    short: "Aw",
    category: "Cloud",
    description: "Scalable infrastructure, serverless compute and managed data.",
    experience: "6 yrs",
  },
  {
    name: "Firebase",
    short: "Fb",
    category: "Cloud",
    description: "Auth, realtime data and analytics for fast-moving mobile products.",
    experience: "5 yrs",
  },
  {
    name: "Figma",
    short: "Fg",
    category: "Design",
    description: "Design systems, prototypes and developer handoff in one place.",
    experience: "7 yrs",
  },
];
