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
        The page you&apos;re looking for drifted out of orbit. Let&apos;s get you back to somewhere familiar.
      </p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/" size="lg">
          Back home
        </ButtonLink>
        <Link href="/#contact" className="inline-flex h-14 items-center px-4 text-fg-muted underline-offset-4 hover:text-fg hover:underline">
          Contact us
        </Link>
      </div>
    </section>
  );
}
