import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-x relative flex min-h-[90svh] flex-col items-start justify-center gap-10 pt-32">
      <div className="grid-lines mask-radial pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <p className="eyebrow">Error 404</p>
      <h1 className="text-display font-medium">
        Lost in <span className="font-serif font-normal italic text-accent-text">space.</span>
      </h1>
      <p className="max-w-md text-lg text-fg-muted">
        That page or product isn&apos;t here. Browse the full price list, or call 980-1111669 and we&apos;ll help.
      </p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/" size="lg">
          Back home
        </ButtonLink>
        <Link href="/products" className="inline-flex h-14 items-center px-4 text-fg-muted underline-offset-4 hover:text-fg hover:underline">
          Browse products
        </Link>
      </div>
    </section>
  );
}
