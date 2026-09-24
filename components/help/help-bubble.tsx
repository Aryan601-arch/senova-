"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { contactInfo } from "@/data/site";
import { ButtonLink } from "@/components/ui/button";

/** Floating "Need a hand?" button with the phone number and Facebook link. */
export function HelpBubble() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            id="help-panel"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="glass flex w-72 flex-col gap-3 rounded-3xl p-5 shadow-soft"
          >
            <p className="text-lg font-medium tracking-[-0.02em]">Need a hand?</p>
            <p className="text-sm text-fg-muted">Real people, not a bot — call or message us directly.</p>
            <ButtonLink href={`tel:${contactInfo.phoneHref}`} magnetic={false}>
              Call {contactInfo.phone}
            </ButtonLink>
            <ButtonLink href={contactInfo.facebook} variant="secondary" magnetic={false} target="_blank" rel="noopener noreferrer">
              Message on Facebook
            </ButtonLink>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="help-panel"
        aria-label={open ? "Close help" : "Need help? Call or message us"}
        data-cursor="hover"
        className="grid size-14 place-items-center rounded-full bg-accent text-accent-ink shadow-soft transition-transform active:scale-95"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <MessageCircle className="size-5" aria-hidden="true" />}
      </button>
    </div>
  );
}
