"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode, MouseEvent } from "react";
import { useScrollTo } from "@/hooks/use-lenis-scroll";

type NavLinkProps = {
  id: string;
  /** A separate page (e.g. /products). Without it, the link targets a home-page section. */
  href?: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
  "aria-current"?: "location" | "page" | undefined;
  tabIndex?: number;
};

/** Smooth-scrolls to a home-page section, or navigates to /#section (or a page) from elsewhere. */
export function NavLink({ id, href: pageHref, className, children, onNavigate, ...rest }: NavLinkProps) {
  const pathname = usePathname();
  const scrollTo = useScrollTo();
  const href = pageHref ?? (id === "home" ? "/" : `/#${id}`);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();
    if (pageHref || pathname !== "/") return; // let Next.js navigate
    e.preventDefault();
    if (onNavigate) {
      // Wait for the mobile menu to close and smooth scrolling to resume.
      window.setTimeout(() => scrollTo(id), 120);
    } else {
      scrollTo(id);
    }
  };

  return (
    <Link href={href} onClick={onClick} className={className} data-cursor="hover" scroll={!!pageHref || id === "home"} {...rest}>
      {children}
    </Link>
  );
}
