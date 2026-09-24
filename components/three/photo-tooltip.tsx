"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/data/catalog";
import { hoveredPhotoStore, isTouchScreen, photoNavigation, pointer } from "@/lib/stores";

/**
 * Details card for the product photo under the pointer in any 3D scene.
 * Follows the pointer, appears on hover and disappears when the pointer leaves.
 */
export function PhotoTooltip() {
  const photo = hoveredPhotoStore.use();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  // Let the 3D cards open product pages with client-side navigation.
  useEffect(() => {
    photoNavigation.open = (id) => router.push(`/product/${id}`);
    return () => {
      photoNavigation.open = null;
    };
  }, [router]);

  useEffect(() => {
    if (!photo) return;
    let raf = 0;
    const touch = isTouchScreen();
    const follow = () => {
      const el = ref.current;
      if (el) {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        if (touch) {
          // Phones: a card centred near the bottom of the screen, clear of the finger.
          el.style.transform = `translate3d(${(window.innerWidth - w) / 2}px, ${window.innerHeight - h - 104}px, 0)`;
          raf = requestAnimationFrame(follow);
          return;
        }
        // Sit to the lower right of the pointer, flipping near the screen edges.
        const x = pointer.clientX + 48 + w > window.innerWidth ? pointer.clientX - w - 48 : pointer.clientX + 48;
        const y = pointer.clientY + 36 + h > window.innerHeight ? pointer.clientY - h - 36 : pointer.clientY + 36;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      raf = requestAnimationFrame(follow);
    };
    follow();
    // Hide on scroll: the card under the pointer moves away with the page.
    const hide = () => hoveredPhotoStore.set(null);
    window.addEventListener("wheel", hide, { passive: true });
    window.addEventListener("touchmove", hide, { passive: true });
    // Touch screens have no "pointer leaves": close the card after a few seconds.
    const timer = touch ? window.setTimeout(hide, 5000) : 0;
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", hide);
      window.removeEventListener("touchmove", hide);
      window.clearTimeout(timer);
    };
  }, [photo]);

  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[60]" aria-hidden="true">
      <AnimatePresence>
        {photo && (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-60 flex-col gap-1.5 rounded-2xl border border-line-strong bg-bg-elevated p-4 shadow-soft"
          >
            <p className="eyebrow">{photo.category}</p>
            <p className="font-mono text-lg font-medium leading-tight">{photo.model}</p>
            <p className="whitespace-nowrap font-mono text-base" style={{ fontVariantNumeric: "tabular-nums" }}>
              {formatPrice(photo.price)}
              <span className="ml-1.5 font-sans text-xs text-fg-subtle">incl. VAT</span>
            </p>
            <p className="mt-1 flex items-center gap-1 border-t border-line pt-2 text-xs text-fg-muted">
              {isTouchScreen() ? "Tap again to see full details" : "Click to see full details"}{" "}
              <ArrowUpRight className="size-3.5" />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
