import Link from "next/link";
import { site } from "@/data/site";

export function LotusMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M24 29 C18 22 18 12 24 4 C30 12 30 22 24 29 Z" />
      <path d="M24 29 C16 27 10 20 9 11 C16 12 22 18 24 29 Z" />
      <path d="M24 29 C32 27 38 20 39 11 C32 12 26 18 24 29 Z" />
      <path d="M24 29 C14 30 6 26 2 19 C9 17 18 21 24 29 Z" />
      <path d="M24 29 C34 30 42 26 46 19 C39 17 30 21 24 29 Z" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2 text-rose" aria-label={`${site.name} home`}>
      <LotusMark className="h-7 w-10 transition-transform duration-500 group-hover:-translate-y-0.5" />
      <span className="font-serif text-[1.7rem] leading-none tracking-wide text-cocoa">{site.name}</span>
    </Link>
  );
}
