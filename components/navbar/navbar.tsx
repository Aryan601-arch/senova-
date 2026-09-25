"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { navCta, navItems } from "@/data/navigation";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";

function useActiveSection(ids: string[], enabled: boolean) {
  const [active, setActive] = useState<string>("home");
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids, enabled]);
  return active;
}

const sectionIds = navItems.map((n) => n.id);

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(sectionIds, isHome);

  // Lenis scroll callback (falls back to native scroll events when Lenis is off).
  useLenis(({ scroll, direction }) => {
    setScrolled(scroll > 24);
    setHidden(scroll > 480 && direction === 1);
  });
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-120%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex h-16 max-w-[104rem] items-center justify-between gap-4 rounded-full pl-5 pr-2.5 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 md:pl-6",
            scrolled || menuOpen
              ? "glass shadow-soft"
              : "border border-transparent bg-transparent",
          )}
        >
          <NavLink id="home" className="relative z-10 rounded-full" aria-current={undefined}>
            <Logo />
            <span className="sr-only">Home</span>
          </NavLink>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = isHome && active === item.id;
              return (
                <li key={item.id}>
                  <NavLink
                    id={item.id}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "group relative inline-flex h-10 items-center rounded-full px-4 text-sm transition-colors duration-300",
                      isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-fg/[0.07]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative overflow-hidden">
                      <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
                        {item.label}
                      </span>
                      <span aria-hidden="true" className="absolute inset-0 translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
                        {item.label}
                      </span>
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NavLink
              id={navCta.id}
              className="group/cta relative hidden h-11 items-center gap-2 overflow-hidden rounded-full bg-accent px-5 text-sm font-medium text-accent-ink transition-transform active:scale-95 sm:inline-flex"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-fg transition-transform duration-500 ease-out-expo group-hover/cta:translate-y-0" aria-hidden="true" />
              <span className="relative transition-colors duration-500 group-hover/cta:text-bg">{navCta.label}</span>
              <span className="relative size-1.5 rounded-full bg-accent-ink transition-colors duration-500 group-hover/cta:bg-accent" aria-hidden="true" />
            </NavLink>
            <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} active={isHome ? active : undefined} />
          </div>
        </nav>
      </motion.header>
    </>
  );
}
