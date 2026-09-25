export type NavItem = {
  label: string;
  /** Section id on the home page (without #). */
  id: string;
};

export const navItems: NavItem[] = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Work", id: "work" },
  { label: "Technology", id: "technology" },
  { label: "Contact", id: "contact" },
];

export const navCta = { label: "Start a Project", id: "contact" };
