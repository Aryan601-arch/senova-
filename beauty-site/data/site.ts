/** Everything brand-specific lives here, so it is easy to change in one place. */
export const site = {
  name: "Senova",
  tagline: "Skincare that empowers confidence",
  description:
    "Senova Skincare enhances your skin by combining the finest natural ingredients with state-of-the-art research. Feel nourished, protected and glowing every day.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  currency: "Rs.",
  contact: {
    email: "global@senovainternational.com",
    phone: "+86 135 8042 3684",
    /** Digits only, used for the WhatsApp order link. */
    whatsapp: "8613580423684",
    address: "Unit 1406A, 14/F, The Belgian Bank Building, 721-725 Nathan Road, Kowloon, Hong Kong",
  },
  /** Add Instagram, TikTok and others here as { label, href }. */
  social: [{ label: "Facebook", href: "https://www.facebook.com/senovanepal/" }],
  nav: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Best Sellers", href: "/#best-sellers" },
    { label: "About", href: "/#about" },
    { label: "Journal", href: "/#journal" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;
