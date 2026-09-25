export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  duration: string;
  outputs: string[];
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description: "We interview stakeholders and users, audit what exists and define what success looks like.",
    duration: "1 – 2 weeks",
    outputs: ["Research synthesis", "Success metrics"],
  },
  {
    number: "02",
    title: "Strategy",
    description: "We turn insight into a focused plan: positioning, scope, architecture and a realistic roadmap.",
    duration: "1 week",
    outputs: ["Product roadmap", "Technical plan"],
  },
  {
    number: "03",
    title: "Design",
    description: "Interfaces, motion and 3D are prototyped early and tested with real people, not just approved in meetings.",
    duration: "3 – 6 weeks",
    outputs: ["Design system", "Interactive prototype"],
  },
  {
    number: "04",
    title: "Build",
    description: "Engineers and designers ship in weekly increments with a live staging link from day one.",
    duration: "6 – 12 weeks",
    outputs: ["Production code", "Automated tests"],
  },
  {
    number: "05",
    title: "Launch",
    description: "Performance, accessibility and SEO checks, then a calm, well-rehearsed release.",
    duration: "1 week",
    outputs: ["Launch checklist", "Analytics setup"],
  },
  {
    number: "06",
    title: "Scale",
    description: "We stay on as a partner: measuring, iterating and growing the product with your team.",
    duration: "Ongoing",
    outputs: ["Growth experiments", "Quarterly reviews"],
  },
];
