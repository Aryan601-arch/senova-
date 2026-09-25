export type ServiceVisual = "sphere" | "phone" | "neural" | "knot" | "cloud" | "cube";

export type Service = {
  id: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  /** Lucide icon name, mapped in components/services/service-icons.ts */
  icon: "code" | "smartphone" | "brain" | "box" | "cloud" | "sparkles";
  /** Which 3D form the visual panel morphs into when this service is active. */
  visual: ServiceVisual;
  /** Accent color used by the 3D visual for this service. */
  color: string;
};

export const services: Service[] = [
  {
    id: "web",
    number: "01",
    title: "Web Development",
    description:
      "High-performance websites and web apps built on modern frameworks, engineered for speed, SEO and long-term maintainability.",
    deliverables: ["Next.js & React", "Headless CMS", "Performance audits"],
    icon: "code",
    visual: "sphere",
    color: "#d4ff3f",
  },
  {
    id: "mobile",
    number: "02",
    title: "Mobile Applications",
    description:
      "Native-feeling iOS and Android apps with shared codebases, thoughtful motion and offline-first architecture.",
    deliverables: ["React Native", "Expo", "App Store launch"],
    icon: "smartphone",
    visual: "phone",
    color: "#7b8cff",
  },
  {
    id: "ai",
    number: "03",
    title: "AI & Machine Learning",
    description:
      "Practical AI features — assistants, search, automation and recommendation — designed around real user workflows.",
    deliverables: ["LLM integration", "RAG pipelines", "Model evaluation"],
    icon: "brain",
    visual: "neural",
    color: "#ff7a45",
  },
  {
    id: "3d",
    number: "04",
    title: "3D & Interactive Experiences",
    description:
      "Real-time WebGL worlds, product configurators and immersive storytelling that run smoothly on any device.",
    deliverables: ["Three.js / R3F", "Product configurators", "Shader art"],
    icon: "box",
    visual: "knot",
    color: "#43e5c4",
  },
  {
    id: "cloud",
    number: "05",
    title: "Cloud Solutions",
    description:
      "Scalable, observable infrastructure on AWS and edge platforms, with CI/CD pipelines your team will actually enjoy.",
    deliverables: ["AWS & Vercel", "Serverless APIs", "DevOps"],
    icon: "cloud",
    visual: "cloud",
    color: "#58b8ff",
  },
  {
    id: "transformation",
    number: "06",
    title: "Digital Transformation",
    description:
      "Roadmaps, design systems and platform migrations that help established teams move at startup speed.",
    deliverables: ["Design systems", "Platform migration", "Team enablement"],
    icon: "sparkles",
    visual: "cube",
    color: "#f2c94c",
  },
];
