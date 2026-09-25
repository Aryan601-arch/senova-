"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { faqItems } from "@/data/faq";
import { contactInfo } from "@/data/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

function FaqRow({ question, answer, open, onToggle, index }: { question: string; answer: string; open: boolean; onToggle: () => void; index: number }) {
  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  return (
    <li className="border-b border-line">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          data-cursor="hover"
          className="group flex w-full items-center gap-6 py-7 text-left md:py-8"
        >
          <span className="font-mono text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
          <span className="flex-1 text-lg font-medium tracking-[-0.02em] transition-colors group-hover:text-fg md:text-2xl">
            {question}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-out-expo",
              open ? "rotate-45 border-transparent bg-accent text-accent-ink" : "border-line group-hover:border-line-strong",
            )}
          >
            <Plus className="size-4" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-8 pl-10 text-base leading-relaxed text-fg-muted md:pl-12 md:text-lg">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-28 md:py-44">
      <div className="container-x grid gap-14 md:grid-cols-12">
        <div className="flex flex-col gap-8 md:col-span-5">
          <SectionHeading index="09" eyebrow="FAQ" id="faq-title" title="Questions, answered." />
          <p className="max-w-sm text-lg leading-relaxed text-fg-muted">
            Something else on your mind? Write to{" "}
            <a href={`mailto:${contactInfo.email}`} className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent">
              {contactInfo.email}
            </a>
            .
          </p>
        </div>
        <ul className="border-t border-line md:col-span-7">
          {faqItems.map((item, i) => (
            <FaqRow
              key={item.question}
              index={i}
              question={item.question}
              answer={item.answer}
              open={open === i}
              onToggle={() => setOpen((o) => (o === i ? null : i))}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
