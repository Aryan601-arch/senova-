import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { site } from "@/data/site";
import { categories } from "@/lib/catalog";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer id="contact" className="bg-cream">
      {/* Contact band */}
      <div className="container-x">
        <div
          data-reveal
          className="relative -mb-16 overflow-hidden rounded-md bg-gradient-to-r from-rose to-rose-deep px-6 py-12 text-center text-white shadow-lift md:px-12"
        >
          <div aria-hidden="true" className="absolute -top-24 -right-16 size-72 rounded-full bg-white/10 blur-2xl" />
          <h2 className="text-heading">Glow With Us</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/85">
            Questions about a product or your routine? Message us and we will help you choose.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/${site.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white text-rose-deep hover:bg-cream"
            >
              <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp us
            </a>
            <a href={`mailto:${site.contact.email}`} className="btn border border-white/60 text-white hover:bg-white/10">
              <Mail className="size-4" aria-hidden="true" /> Email us
            </a>
          </div>
        </div>
      </div>

      <div className="bg-blush/70 pt-28 pb-10">
        <div className="container-x grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cocoa-muted">{site.tagline}.</p>
            <ul className="mt-5 flex gap-4 text-sm">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-rose-deep underline-offset-4 hover:underline">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Shop</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/shop" className="hover:text-rose-deep">All products</Link></li>
              {categories.map((c) => (
                <li key={c}>
                  <Link href={`/shop?category=${c}`} className="hover:text-rose-deep">{c}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Explore</p>
            <ul className="mt-4 space-y-2 text-sm">
              {site.nav.slice(2).map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-rose-deep">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Contact</p>
            <ul className="mt-4 space-y-3 text-sm text-cocoa-muted">
              <li className="flex gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-rose" aria-hidden="true" />
                <a href={`mailto:${site.contact.email}`} className="break-all hover:text-rose-deep">{site.contact.email}</a>
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-rose" aria-hidden="true" />
                <a href={`tel:+${site.contact.whatsapp}`} className="hover:text-rose-deep">{site.contact.phone}</a>
              </li>
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-rose" aria-hidden="true" />
                <span>{site.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="container-x mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-cocoa-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Made with care for every skin.</p>
        </div>
      </div>
    </footer>
  );
}
