/**
 * Global site configuration.
 * Change brand copy, hero text, contact details and social links here —
 * no component needs to be touched.
 */

export const siteConfig = {
  name: "Senova",
  legalName: "Senova Studio",
  tagline: "Digital experiences designed with technology, motion and imagination.",
  description:
    "Senova is an independent digital studio crafting immersive websites, products and 3D experiences for ambitious companies. Strategy, design and engineering under one roof.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://senova.studio",
  locale: "en_US",
  keywords: [
    "digital studio",
    "web development",
    "3D websites",
    "WebGL",
    "product design",
    "Next.js agency",
    "AI solutions",
    "interactive experiences",
  ],
  twitterHandle: "@senovastudio",
  foundedYear: 2019,
} as const;

export const heroContent = {
  eyebrow: "Independent digital studio — Est. 2019",
  /** Each entry renders on its own line. Words animate in one by one. */
  headline: ["Build", "what's next."],
  supporting: "Digital experiences designed with technology, motion and imagination.",
  primaryCta: { label: "Explore", href: "#about" },
  secondaryCta: { label: "Start a Project", href: "#contact" },
  /** Small meta labels shown in the hero corners. */
  meta: [
    { label: "Currently", value: "Booking Q1 2027" },
    { label: "Based in", value: "Kathmandu / Remote" },
  ],
} as const;

export const contactInfo = {
  email: "hello@senova.studio",
  phone: "+977 980 000 0000",
  phoneHref: "+9779800000000",
  location: "Kathmandu, Nepal — working worldwide",
  hours: "Mon – Fri, 9:00 – 18:00 NPT",
  responseTime: "We reply within one business day.",
} as const;

export type SocialPlatform = "x" | "linkedin" | "instagram" | "github" | "dribbble";

export const socialLinks: { platform: SocialPlatform; label: string; href: string }[] = [
  { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/" },
  { platform: "x", label: "X (Twitter)", href: "https://x.com/" },
  { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
  { platform: "github", label: "GitHub", href: "https://github.com/" },
  { platform: "dribbble", label: "Dribbble", href: "https://dribbble.com/" },
];

export const footerContent = {
  statement: "Let's build what's next.",
  newsletterTitle: "The Senova Dispatch",
  newsletterText: "One considered email a month on design, engineering and the web we want to build.",
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;
