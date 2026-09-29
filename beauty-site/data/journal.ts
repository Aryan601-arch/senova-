export type Article = {
  title: string;
  excerpt: string;
  tag: string;
  tone: "rose" | "sage" | "sand";
};

export const articles: Article[] = [
  {
    title: "Build a Glow Routine",
    excerpt: "Cleanse, tone, treat and protect. The four steps that do the most for everyday radiance.",
    tag: "Skincare",
    tone: "rose",
  },
  {
    title: "Serums, Simply Explained",
    excerpt: "Vitamin C, hyaluronic acid, retinol or niacinamide? How to pick the one your skin is asking for.",
    tag: "Ingredients",
    tone: "sand",
  },
  {
    title: "Soft Lips, All Year",
    excerpt: "Why a nightly balm and a daytime lip oil make the perfect pair for smooth, healthy lips.",
    tag: "Lip Care",
    tone: "sage",
  },
];
