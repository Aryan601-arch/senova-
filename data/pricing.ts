export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  /** Shown after the price, e.g. "/ project" */
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
};

export const pricingIntro = {
  eyebrow: "Engagements",
  title: "Clear packages. No surprises.",
  text: "Every engagement starts with a free discovery call. Prices are starting points — we scope every project to what it actually needs.",
  currencyNote: "All prices in USD, excluding taxes.",
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$8k",
    cadence: "from / project",
    description: "A sharp, fast marketing site for early-stage teams that need to look established.",
    features: [
      "Up to 6 custom pages",
      "Motion & micro-interactions",
      "Headless CMS setup",
      "SEO & analytics foundations",
      "4 – 6 week delivery",
    ],
    cta: "Start with Starter",
  },
  {
    id: "professional",
    name: "Professional",
    price: "$24k",
    cadence: "from / project",
    description: "Immersive, 3D-driven websites and product launches built to win attention.",
    features: [
      "Everything in Starter",
      "Custom 3D & WebGL scenes",
      "Design system in Figma & code",
      "Performance budget & audits",
      "Dedicated product designer",
      "8 – 12 week delivery",
    ],
    cta: "Choose Professional",
    highlighted: true,
    badge: "Most popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    cadence: "monthly partnership",
    description: "An embedded senior team for platforms, apps and AI products at scale.",
    features: [
      "Cross-functional squad",
      "Web, mobile & AI products",
      "Cloud architecture & DevOps",
      "SLA-backed support",
      "Quarterly strategy reviews",
    ],
    cta: "Talk to us",
  },
];
