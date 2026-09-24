"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-x flex min-h-[90svh] flex-col items-start justify-center gap-8 pt-32">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="text-headline max-w-[14ch] font-medium">We hit an unexpected glitch.</h1>
      <p className="max-w-md text-lg text-fg-muted">
        It&apos;s not you, it&apos;s us. Try again, and if it keeps happening please let us know.
      </p>
      <Button onClick={reset} size="lg" icon={<RotateCcw className="size-4" aria-hidden="true" />}>
        Try again
      </Button>
    </section>
  );
}
