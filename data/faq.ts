export type FaqItem = { question: string; answer: string };

export const faqItems: FaqItem[] = [
  {
    question: "How long does a typical project take?",
    answer:
      "Marketing sites usually take 4 to 8 weeks. Products, apps and 3D experiences range from 8 to 16 weeks. After discovery you receive a week-by-week plan, and you get a live staging link from the first sprint.",
  },
  {
    question: "Do 3D websites hurt performance or SEO?",
    answer:
      "Not when they are built properly. We lazy-load every 3D scene, adapt quality to the device, keep all content as semantic HTML and ship a static fallback when WebGL is unavailable. Our sites routinely score 90+ on Lighthouse.",
  },
  {
    question: "Can you work with our existing team and codebase?",
    answer:
      "Yes. Around half of our work is with in-house teams. We adapt to your tools, review process and conventions, and we document everything so your team owns the result.",
  },
  {
    question: "What does working with Senova cost?",
    answer:
      "Projects start at $8k for focused marketing sites. Most immersive websites and products land between $24k and $120k. Ongoing partnerships are billed monthly. See the packages above for details.",
  },
  {
    question: "Do you offer support after launch?",
    answer:
      "Every project includes 30 days of post-launch support. Many clients continue with a monthly retainer for improvements, experiments and new features.",
  },
  {
    question: "Who owns the code and designs?",
    answer:
      "You do. On final payment, all source code, design files and assets are transferred to you with no licensing strings attached.",
  },
];
