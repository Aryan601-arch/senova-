export const aboutContent = {
  eyebrow: "About Senova",
  statement:
    "We are a small, senior team of designers and engineers turning complex ideas into digital experiences people remember.",
  intro: [
    "Senova was founded on a simple belief: the best digital work happens when strategy, design and engineering sit at the same table from day one.",
    "We partner with founders, product teams and brands to ship websites, apps and interactive systems that are fast, accessible and unmistakably theirs.",
  ],
  principles: ["Senior-only team", "Design + engineering in one loop", "Performance as a feature"],
};

export type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  detail: string;
};

/** Edit these numbers freely — counters animate to whatever you set. */
export const stats: Stat[] = [
  { value: 50, suffix: "+", label: "Projects", detail: "Shipped across web, mobile and 3D" },
  { value: 20, suffix: "+", label: "Clients", detail: "From seed-stage to enterprise" },
  { value: 10, suffix: "+", label: "Countries", detail: "Teams we have worked with" },
  { value: 99, suffix: "%", label: "Commitment", detail: "The remaining 1% is coffee" },
];
