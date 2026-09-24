"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUp } from "lucide-react";
import { navItems } from "@/data/navigation";
import { groupLabels, productGroups } from "@/data/catalog";
import { contactInfo, footerContent, siteConfig, socialLinks } from "@/data/site";
import { Logo } from "@/components/ui/logo";
import { SocialIcon } from "@/components/ui/social-icon";
import { NavLink } from "@/components/navbar/nav-link";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollTo } from "@/hooks/use-lenis-scroll";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();
  const year = new Date().getFullYear();

  // The giant statement rises letter by letter as the footer scrolls in.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo("[data-footer-char]", { yPercent: 100, y: 0 }, {
          yPercent: 0,
          y: 0,
          ease: "expo.out",
          duration: 1.2,
          stagger: 0.025,
          scrollTrigger: { trigger: "[data-footer-statement]", start: "top 92%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const statementWords = footerContent.statement.split(" ");

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-line bg-bg-sunken/60 pt-24 md:pt-32" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container-x">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="flex flex-col gap-6 md:col-span-5">
            <Logo />
            <p className="max-w-sm text-fg-muted">{siteConfig.tagline}</p>
            <a
              href={`tel:${contactInfo.phoneHref}`}
              data-cursor="hover"
              className="mt-2 w-fit text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-[-0.04em] transition-colors hover:text-accent-text"
            >
              {contactInfo.phone}
            </a>
            <p className="-mt-3 text-sm text-fg-muted">{contactInfo.email}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
            <div>
              <p className="eyebrow mb-5">Navigate</p>
              <ul className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <NavLink id={item.id} href={item.href} className="text-sm text-fg-muted transition-colors hover:text-fg">
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">Shop</p>
              <ul className="flex flex-col gap-3">
                {productGroups.map((g) => (
                  <li key={g}>
                    <Link href={`/products?group=${g}`} className="text-sm text-fg-muted transition-colors hover:text-fg">
                      {groupLabels[g]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow mb-5">Contact</p>
              <ul className="flex flex-col gap-3 text-sm">
                <li>
                  <a href={`tel:${contactInfo.phoneHref}`} className="text-fg-muted transition-colors hover:text-fg">
                    {contactInfo.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contactInfo.email}`} className="text-fg-muted transition-colors hover:text-fg">
                    Email us
                  </a>
                </li>
                <li>
                  <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="text-fg-muted transition-colors hover:text-fg">
                    Facebook page
                  </a>
                </li>
                <li>
                  <a href={contactInfo.globalSite} target="_blank" rel="noopener noreferrer" className="text-fg-muted transition-colors hover:text-fg">
                    Global brand site
                  </a>
                </li>
                <li>
                  <Link href="/admin/login" className="text-fg-muted transition-colors hover:text-fg">
                    Admin
                  </Link>
                </li>
              </ul>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social media">
                {socialLinks.map((s) => (
                  <li key={s.platform}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} (opens in a new tab)`}
                      data-cursor="hover"
                      className="grid size-10 place-items-center rounded-full border border-line text-fg-muted transition-all hover:-translate-y-0.5 hover:border-fg/40 hover:text-fg"
                    >
                      <SocialIcon platform={s.platform} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>

      {/* Large animated statement */}
      <div data-footer-statement className="container-x mt-24 md:mt-32" aria-hidden="true">
        <p className="flex flex-wrap gap-x-[0.22em] text-[clamp(3.25rem,12.5vw,13rem)] font-medium leading-[0.9] tracking-[-0.06em]">
          {statementWords.map((word, wi) => (
            <span key={wi} className="inline-flex overflow-hidden pb-[0.06em]">
              {Array.from(word).map((ch, ci) => (
                <span
                  key={ci}
                  data-footer-char
                  className={wi === statementWords.length - 1 ? "inline-block font-serif font-normal italic text-accent-text" : "inline-block"}
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>

      <div className="container-x mt-12 flex flex-col gap-6 border-t border-line py-8 text-sm text-fg-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {siteConfig.legalName}, Nepal. {footerContent.bottomNote}
        </p>
        <ul className="flex items-center gap-6">
          <li>
            <button
              type="button"
              onClick={() => scrollTo("home") || window.scrollTo({ top: 0 })}
              className="group inline-flex items-center gap-2 transition-colors hover:text-fg"
              data-cursor="hover"
            >
              Back to top
              <span className="grid size-8 place-items-center rounded-full border border-line transition-transform duration-500 ease-out-expo group-hover:-translate-y-1">
                <ArrowUp className="size-3.5" aria-hidden="true" />
              </span>
            </button>
          </li>
        </ul>
      </div>
    </footer>
  );
}
