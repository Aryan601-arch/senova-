import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProject, projects } from "@/data/projects";
import { SmartImage } from "@/components/ui/smart-image";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.category}`,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${project.category}`,
      description: project.description,
      images: [{ url: project.image, width: 1600, height: 1000, alt: project.imageAlt }],
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="relative pb-24 pt-36 md:pt-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 -z-10 aspect-square w-[60vw] rounded-full opacity-20 blur-[140px]"
        style={{ background: project.color }}
      />
      <div className="container-x">
        <Link href="/#work" className="eyebrow mb-12 inline-flex items-center gap-2 transition-colors hover:text-fg">
          <ArrowLeft className="size-3.5" aria-hidden="true" /> All work
        </Link>

        <header className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span className="size-2 rounded-full" style={{ background: project.color }} aria-hidden="true" />
              {project.category}
            </p>
            <h1 className="text-display font-medium">{project.title}</h1>
          </div>
          <dl className="grid grid-cols-2 gap-6 text-sm md:col-span-4">
            <div>
              <dt className="eyebrow mb-1.5">Client</dt>
              <dd>{project.client}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-1.5">Year</dt>
              <dd>{project.year}</dd>
            </div>
            <div className="col-span-2">
              <dt className="eyebrow mb-1.5">Technology</dt>
              <dd className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-fg-muted">
                    {t}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </header>

        <Reveal className="relative mt-16 aspect-[16/10] overflow-hidden rounded-[2rem] border border-line md:mt-24">
          <SmartImage
            src={project.image}
            alt={project.imageAlt}
            fill
            priority
            sizes="(min-width: 1664px) 1600px, 100vw"
            className="object-cover"
            accent={project.color}
            fallbackLabel={project.title}
          />
        </Reveal>

        <div className="mt-20 grid gap-12 md:mt-28 md:grid-cols-12">
          <h2 className="eyebrow md:col-span-3">Overview</h2>
          <div className="flex flex-col gap-8 md:col-span-8 md:col-start-5">
            <p className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.2] tracking-[-0.03em]">{project.description}</p>
            <p className="max-w-2xl text-lg leading-relaxed text-fg-muted">{project.overview}</p>
          </div>
        </div>

        <section aria-label="Results" className="mt-20 grid border-t border-line sm:grid-cols-3 md:mt-28">
          {project.results.map((r) => (
            <div key={r.label} className="flex flex-col gap-2 border-b border-line py-10 sm:border-b-0 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:pl-8">
              <p className="text-[clamp(3rem,6vw,5rem)] font-medium leading-none tracking-[-0.05em]" style={{ color: project.color }}>
                {r.value}
              </p>
              <p className="text-fg-muted">{r.label}</p>
            </div>
          ))}
        </section>

        <nav aria-label="Next project" className="mt-24 border-t border-line pt-12 md:mt-32">
          <p className="eyebrow mb-6">Next project</p>
          <Link
            href={`/work/${next.slug}`}
            data-cursor="hover"
            data-cursor-label="Next"
            className="group flex items-center justify-between gap-6"
          >
            <span className="text-headline font-medium transition-colors duration-500 group-hover:text-accent-text">{next.title}</span>
            <span className="grid size-16 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-accent group-hover:text-accent-ink md:size-24">
              <ArrowUpRight className="size-6" aria-hidden="true" />
            </span>
          </Link>
        </nav>

        <div className="mt-20 flex justify-center">
          <ButtonLink href="/#contact" size="lg">
            Start a Project
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
