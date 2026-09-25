export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  /** Longer copy shown on the project detail page. */
  overview: string;
  results: { value: string; label: string }[];
  technologies: string[];
  year: number;
  client: string;
  /** Path under /public. Replace with your own screenshots (WebP/AVIF/JPG/PNG). */
  image: string;
  imageAlt: string;
  /** Accent color used for hover glows and the detail page. */
  color: string;
};

export const projects: Project[] = [
  {
    slug: "aurora-analytics",
    title: "Aurora Analytics",
    category: "SaaS Platform",
    description: "A real-time analytics platform that turns streams of energy data into decisions.",
    overview:
      "Aurora needed a product that made grid-scale energy data legible to operators under pressure. We designed a calm, dense interface with live WebGL visualisations and a component system that ships new dashboards in days rather than weeks.",
    results: [
      { value: "3.2×", label: "Faster time-to-insight" },
      { value: "98", label: "Lighthouse performance" },
      { value: "40%", label: "Less support tickets" },
    ],
    technologies: ["Next.js", "Three.js", "TypeScript", "AWS"],
    year: 2026,
    client: "Aurora Energy (demo)",
    image: "/images/projects/aurora.webp",
    imageAlt: "Abstract render of a glowing glass torus knot in lime light",
    color: "#d4ff3f",
  },
  {
    slug: "halo-wellness",
    title: "Halo Wellness",
    category: "Mobile App",
    description: "A mindful health companion with adaptive routines and gentle motion design.",
    overview:
      "Halo blends sleep, movement and breathing into one daily ritual. We built a cross-platform app with an offline-first core, a motion language based on breathing rhythms and an onboarding flow that doubled activation.",
    results: [
      { value: "2×", label: "Activation rate" },
      { value: "4.8", label: "App Store rating" },
      { value: "120k", label: "Monthly users" },
    ],
    technologies: ["React Native", "Expo", "Firebase", "Figma"],
    year: 2025,
    client: "Halo Health (demo)",
    image: "/images/projects/halo.webp",
    imageAlt: "Abstract render of soft violet spheres floating in fog",
    color: "#7b8cff",
  },
  {
    slug: "kinetic-commerce",
    title: "Kinetic Commerce",
    category: "3D E-commerce",
    description: "A real-time 3D product configurator for a premium mobility brand.",
    overview:
      "Customers configure every material, colour and component of an electric bike in real time. The configurator streams compressed GLB models, renders at 60fps on mid-range phones and feeds orders straight into the brand's ERP.",
    results: [
      { value: "+34%", label: "Conversion rate" },
      { value: "60fps", label: "On mid-range mobile" },
      { value: "1.4MB", label: "Initial 3D payload" },
    ],
    technologies: ["React Three Fiber", "Shopify", "Node.js", "Blender"],
    year: 2025,
    client: "Kinetic Mobility (demo)",
    image: "/images/projects/kinetic.webp",
    imageAlt: "Abstract render of polished metallic rings in warm orange light",
    color: "#ff7a45",
  },
  {
    slug: "atlas-ai",
    title: "Atlas AI",
    category: "AI Product",
    description: "A research assistant that reads, cites and reasons across a company's knowledge.",
    overview:
      "Atlas connects to internal documents and answers questions with verifiable citations. We shaped the product from zero: retrieval pipeline, evaluation harness and an interface that makes uncertainty visible instead of hiding it.",
    results: [
      { value: "92%", label: "Answer accuracy" },
      { value: "6h", label: "Saved per analyst / week" },
      { value: "SOC 2", label: "Ready architecture" },
    ],
    technologies: ["Python", "AI", "Next.js", "AWS"],
    year: 2026,
    client: "Atlas Research (demo)",
    image: "/images/projects/atlas.webp",
    imageAlt: "Abstract render of a teal crystalline network of nodes",
    color: "#43e5c4",
  },
  {
    slug: "meridian-bank",
    title: "Meridian",
    category: "Fintech Brand & Web",
    description: "Brand platform and marketing site for a new digital-first bank.",
    overview:
      "Meridian launched into a crowded market with a brand built on clarity. We delivered the identity system, a WebGL-driven launch site and a design system shared by marketing and product teams.",
    results: [
      { value: "250k", label: "Waitlist sign-ups" },
      { value: "0.8s", label: "Largest contentful paint" },
      { value: "AA", label: "WCAG 2.2 compliant" },
    ],
    technologies: ["Next.js", "GSAP", "Sanity", "Vercel"],
    year: 2024,
    client: "Meridian Financial (demo)",
    image: "/images/projects/meridian.webp",
    imageAlt: "Abstract render of golden glass panels arranged in a spiral",
    color: "#f2c94c",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
