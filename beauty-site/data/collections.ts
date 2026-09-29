import type { Category } from "@/lib/types";

export type Collection = {
  title: string;
  kicker: string;
  line: string;
  category: Category;
  /** Product slugs shown in the card's artwork. */
  picks: string[];
};

export const collections: Collection[] = [
  {
    kicker: "The",
    title: "Face Ritual",
    line: "Cleanser, toner and serum for a complete daily routine.",
    category: "Face",
    picks: ["green-tea-soothing-amino-acid-gentle-cleanser", "rose-toner", "hyaluronic-acid-serum"],
  },
  {
    kicker: "The",
    title: "Body Bliss",
    line: "Petal shower gels and silky lotions from head to toe.",
    category: "Body",
    picks: ["sakura-petal-shower-gel", "cocoa-butter-moist-body-lotion", "rose-hand-cream"],
  },
  {
    kicker: "The",
    title: "Lip Love",
    line: "Glossy oils for day, repairing balms for night.",
    category: "Lips",
    picks: ["rose-oil-hydra-nourish-lip-oil", "vitamin-e-honey-repair-lip-balm", "strawberry-hydra-nourish-lip-oil"],
  },
];
