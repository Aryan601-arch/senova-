"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { clsx } from "clsx";
import { site } from "@/data/site";
import { bag, useBag } from "@/lib/bag";
import { Logo } from "./logo";

export function Header() {
  const lines = useBag();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40">
      {/* The rose band across the top of every page in the reference */}
      <div className="h-1.5 bg-gradient-to-r from-rose-soft via-rose to-rose-soft" />
      <div
        className={clsx(
          "border-b transition-[background-color,border-color,box-shadow] duration-300",
          scrolled
            ? "border-line bg-cream/90 shadow-[0_8px_30px_-20px_rgb(147_80_63/0.4)] backdrop-blur-md"
            : "border-transparent bg-cream",
        )}
      >
        <div className="container-x flex h-[4.25rem] items-center justify-between gap-6">
          <Logo />
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative text-[0.8rem] tracking-[0.12em] text-cocoa uppercase transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-rose after:transition-transform hover:text-rose-deep hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-1">
            <Link href="/shop" className="grid size-10 place-items-center rounded-full text-cocoa hover:bg-blush" aria-label="Search products">
              <Search className="size-[1.1rem]" />
            </Link>
            <button
              type="button"
              onClick={() => bag.setOpen(true)}
              className="relative grid size-10 place-items-center rounded-full text-cocoa hover:bg-blush"
              aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
            >
              <ShoppingBag className="size-[1.1rem]" />
              {count > 0 && (
                <span className="absolute top-1 right-1 grid min-w-4 place-items-center rounded-full bg-rose px-1 text-[0.6rem] leading-4 text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid size-10 place-items-center rounded-full text-cocoa hover:bg-blush lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-cream lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="container-x flex h-[4.25rem] items-center justify-between border-b border-line">
            <Logo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="grid size-10 place-items-center rounded-full hover:bg-blush"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>
          <nav aria-label="Mobile" className="container-x flex-1 overflow-y-auto py-8">
            <ul className="space-y-1">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-line py-4 font-serif text-3xl text-cocoa"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
