import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { LegalDoc } from "@/data/legal";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <article className="container-x relative pb-28 pt-40 md:pb-40 md:pt-52">
      <Link href="/" className="eyebrow mb-12 inline-flex items-center gap-2 transition-colors hover:text-fg">
        <ArrowLeft className="size-3.5" aria-hidden="true" /> Back home
      </Link>
      <header className="mb-16 grid gap-6 border-b border-line pb-12 md:grid-cols-12">
        <h1 className="text-headline font-medium md:col-span-8">{doc.title}</h1>
        <p className="eyebrow md:col-span-4 md:self-end md:text-right">Last updated — {doc.updated}</p>
      </header>
      <div className="grid gap-12 md:grid-cols-12">
        <p className="text-xl leading-relaxed text-fg md:col-span-4">{doc.intro}</p>
        <div className="flex flex-col gap-10 md:col-span-7 md:col-start-6">
          {doc.sections.map((s, i) => (
            <section key={s.heading} className="grid gap-3 border-t border-line pt-8 md:grid-cols-7">
              <h2 className="text-lg font-medium md:col-span-3">
                <span className="mr-3 font-mono text-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                {s.heading}
              </h2>
              <p className="leading-relaxed text-fg-muted md:col-span-4">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
