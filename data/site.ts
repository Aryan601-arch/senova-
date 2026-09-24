import { siteUrl } from "@/lib/utils";

/**
 * Global site configuration.
 * Change brand copy, hero text, contact details and social links here —
 * no component needs to be touched.
 */

export const siteConfig = {
  name: "Webor",
  legalName: "Webor Appliances",
  tagline: "Creating easy life — genuine Webor home appliances for households across Nepal.",
  description:
    "Webor Appliances — genuine Webor televisions, refrigerators, washing machines, air conditioners and home appliances in Nepal. Full official price list. Call 980-1111669.",
  url: siteUrl,
  locale: "en_US",
  keywords: [
    "Webor",
    "Webor Appliances",
    "home appliances Nepal",
    "refrigerator price Nepal",
    "air conditioner Nepal",
    "washing machine Nepal",
    "Webor TV",
    "Nexon Corporation",
  ],
} as const;

export const heroContent = {
  eyebrow: "Webor Appliances — Nepal",
  /** Each entry renders on its own line. Words animate in one by one. */
  headline: ["Creating", "easy life."],
  supporting:
    "Genuine Webor televisions, refrigerators, washing machines, air conditioners and everyday appliances — with one phone number to call when you need us.",
  primaryCta: { label: "Shop the range", href: "/products" },
  secondaryCta: { label: "Call 980-1111669", href: "tel:9801111669" },
  /** Small meta labels shown in the hero corners. */
  meta: [
    { label: "Facebook", value: "29,000+ followers" },
    { label: "Serving", value: "Households across Nepal" },
  ],
} as const;

export const contactInfo = {
  email: "nepal@weborelectronics.com",
  phone: "980-1111669",
  phoneHref: "9801111669",
  facebook: "https://www.facebook.com/weborappliances",
  globalSite: "https://www.weborelectronics.com",
  location: "Nepal",
} as const;

export type SocialPlatform = "facebook" | "web";

export const socialLinks: { platform: SocialPlatform; label: string; href: string }[] = [
  { platform: "facebook", label: "Facebook", href: contactInfo.facebook },
  { platform: "web", label: "Global brand site", href: contactInfo.globalSite },
];

export const footerContent = {
  statement: "Ready when you are.",
  bottomNote: "Part of the global Webor home appliances line.",
} as const;
