"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { navItems } from "@/data/navigation";
import { contactInfo, socialLinks } from "@/data/site";
import { SocialIcon } from "@/components/ui/social-icon";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { NavLink } from "./nav-link";

type MobileMenuProps = { open: boolean; onOpenChange: (open: boolean) => void; active?: string };

export function MobileMenu({ open, onOpenChange, active }: MobileMenuProps) {
  const lenis = useLenis();
  const mounted = useMounted();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock scrolling, handle Escape, trap focus, and restore focus on close.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const button = buttonRef.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
      if (e.key === "Tab" && panelRef.current) {
        const focusables = [button, ...panelRef.current.querySelectorAll<HTMLElement>("a, button")].filter(Boolean) as HTMLElement[];
        const idx = focusables.indexOf(document.activeElement as HTMLElement);
        const next = e.shiftKey ? idx - 1 : idx + 1;
        if (next < 0 || next >= focusables.length) {
          e.preventDefault();
          focusables[(next + focusables.length) % focusables.length].focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
      button?.focus({ preventScroll: true });
    };
  }, [open, lenis, onOpenChange]);

  // Close when resizing up to desktop.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mql.matches && onOpenChange(false);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [onOpenChange]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => onOpenChange(!open)}
        className="relative grid size-11 place-items-center rounded-full border border-line text-fg transition-colors hover:bg-fg/5 lg:hidden"
      >
        <span className="relative block h-3 w-5" aria-hidden="true">
          <span
            className={cn(
              "absolute left-0 top-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-500 ease-out-expo",
              open && "translate-y-[5.25px] rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute bottom-0 left-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-500 ease-out-expo",
              open && "-translate-y-[5.25px] -rotate-45",
            )}
          />
        </span>
      </button>

      {mounted &&
        createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            data-lenis-prevent
            initial={{ clipPath: "circle(0% at calc(100% - 2.75rem) 2.75rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.75rem) 2.75rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.75rem) 2.75rem)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[45] flex flex-col overflow-y-auto bg-bg px-6 pb-8 pt-28 lg:hidden"
          >
            <div className="grid-lines mask-radial pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
            <nav aria-label="Mobile" className="relative flex-1">
              <ul className="flex flex-col">
                {navItems.map((item, i) => (
                  <li key={item.id} className="overflow-hidden border-b border-line">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.7, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <NavLink
                        id={item.id}
                        onNavigate={() => onOpenChange(false)}
                        aria-current={active === item.id ? "location" : undefined}
                        className="flex items-baseline justify-between py-4 text-[2.6rem] font-medium leading-none tracking-[-0.04em]"
                      >
                        <span className={cn(active === item.id ? "text-fg" : "text-fg/80")}>{item.label}</span>
                        <span className="font-mono text-xs text-fg-subtle">0{i + 1}</span>
                      </NavLink>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="relative mt-10 flex flex-col gap-5"
            >
              <a href={`mailto:${contactInfo.email}`} className="text-lg">
                {contactInfo.email}
              </a>
              <ul className="flex gap-2">
                {socialLinks.map((s) => (
                  <li key={s.platform}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="grid size-11 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:text-fg"
                    >
                      <SocialIcon platform={s.platform} />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
