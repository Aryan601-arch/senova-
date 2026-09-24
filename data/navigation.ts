export type NavItem = {
  label: string;
  /** Section id on the home page (without #). */
  id: string;
  /** Set for items that are their own page instead of a home-page section. */
  href?: string;
};

export const navItems: NavItem[] = [
  { label: "Home", id: "home" },
  { label: "Products", id: "products", href: "/products" },
  { label: "Promotions", id: "promotions" },
  { label: "About", id: "about" },
  { label: "FAQ", id: "faq" },
  { label: "Contact", id: "contact" },
];

export const navCta = { label: "Call 980-1111669", href: "tel:9801111669" };
