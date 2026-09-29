"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Mail, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { clsx } from "clsx";
import { site } from "@/data/site";
import { bag, useBag, useBagOpen } from "@/lib/bag";
import { getProduct } from "@/lib/catalog";
import { ProductImage } from "./product-image";

/** Slide-in bag. Orders go to the shop as a WhatsApp message or an email. */
export function BagDrawer() {
  const open = useBagOpen();
  const lines = useBag()
    .map((l) => ({ ...l, product: getProduct(l.slug) }))
    .filter((l) => l.product);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && bag.setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const summary = [
    `Hello ${site.name}, I would like to order:`,
    ...lines.map((l) => `• ${l.product!.name} × ${l.qty}`),
  ].join("\n");
  const whatsapp = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(summary)}`;
  const email = `mailto:${site.contact.email}?subject=${encodeURIComponent(`Order from ${site.name} website`)}&body=${encodeURIComponent(summary)}`;

  return (
    <div className={clsx("fixed inset-0 z-50", !open && "pointer-events-none")} aria-hidden={!open}>
      <div
        onClick={() => bag.setOpen(false)}
        className={clsx("absolute inset-0 bg-cocoa/30 backdrop-blur-[2px] transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className={clsx(
          "absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-cream transition-[translate,box-shadow] duration-500 ease-(--ease-soft)",
          open ? "translate-x-0 shadow-2xl" : "translate-x-full shadow-none",
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-3xl">Your Bag</h2>
          <button
            type="button"
            onClick={() => bag.setOpen(false)}
            className="grid size-10 place-items-center rounded-full hover:bg-blush"
            aria-label="Close bag"
            tabIndex={open ? 0 : -1}
          >
            <X className="size-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="size-10 text-rose-soft" />
            <p className="font-serif text-2xl">Your bag is empty</p>
            <Link href="/shop" onClick={() => bag.setOpen(false)} className="btn btn-rose" tabIndex={open ? 0 : -1}>
              Shop now
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map(({ slug, qty, product }) => (
                <li key={slug} className="flex items-center gap-4 py-4">
                  <ProductImage product={product!} sizes="80px" className="size-20 shrink-0 rounded bg-blush" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug font-medium">{product!.name}</p>
                    <p className="mt-0.5 text-xs tracking-wider text-rose uppercase">{product!.category}</p>
                    <div className="mt-2 inline-flex items-center rounded border border-line bg-white">
                      <button type="button" onClick={() => bag.setQty(slug, qty - 1)} className="grid size-8 place-items-center" aria-label={`One less ${product!.name}`} tabIndex={open ? 0 : -1}>
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm" aria-live="polite">{qty}</span>
                      <button type="button" onClick={() => bag.setQty(slug, qty + 1)} className="grid size-8 place-items-center" aria-label={`One more ${product!.name}`} tabIndex={open ? 0 : -1}>
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <button type="button" onClick={() => bag.setQty(slug, 0)} className="text-xs text-cocoa-muted underline-offset-4 hover:text-rose-deep hover:underline" tabIndex={open ? 0 : -1}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-line bg-white/60 px-6 py-5">
              <p className="text-sm text-cocoa-muted">Send your order and we will confirm prices and delivery with you.</p>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-rose w-full" tabIndex={open ? 0 : -1}>
                Order on WhatsApp
              </a>
              <a href={email} className="btn btn-outline w-full" tabIndex={open ? 0 : -1}>
                <Mail className="size-3.5" aria-hidden="true" /> Order by email
              </a>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
