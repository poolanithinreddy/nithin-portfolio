import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import type { Route } from "next";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { constructMetadata, getOgImageUrl, siteConfig } from "@/lib/seo";
import { ReadingProgress } from "@/components/reading-progress";
import { TableOfContents } from "@/components/table-of-contents";
import { getFallbackProjectBySlug } from "@/lib/fallback-data";

export const dynamic = "force-dynamic";

type Props = {
  params: {
    slug: string;
  };
};

type ProjectViewModel = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string | null;
  gallery: string[];
  repoUrl: string | null;
  demoUrl: string | null;
  tech: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

async function getProjectFromParams(slug: string): Promise<ProjectViewModel | null> {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
    });

    if (!project) {
      return null;
    }

    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      description: project.description,
      coverImage: project.coverImage ?? null,
      gallery: project.gallery ?? [],
      repoUrl: project.repoUrl ?? null,
      demoUrl: project.demoUrl ?? null,
      tech: project.tech ?? [],
      featured: project.featured ?? false,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  } catch (error) {
    console.warn(`[work/${slug}] Unable to query project; using fallback`, error);
    return null;
  }
}

async function getFallbackProject(slug: string): Promise<ProjectViewModel | null> {
  const fallback = await getFallbackProjectBySlug(slug);
  if (!fallback) {
    return null;
  }

  const createdAt = new Date(fallback.createdAt);
  return {
    id: fallback.id,
    title: fallback.title,
    slug: fallback.slug,
    summary: fallback.summary,
    description: fallback.description,
    coverImage: fallback.coverImage,
    gallery: fallback.gallery,
    repoUrl: fallback.repoUrl,
    demoUrl: fallback.demoUrl,
    tech: fallback.tech,
    featured: fallback.featured,
    createdAt,
    updatedAt: createdAt,
  };
}

export async function generateMetadata({ params }: Props) {
  const project =
    (await getProjectFromParams(params.slug)) ?? (await getFallbackProject(params.slug));

  if (!project) {
    return constructMetadata({
      title: "Case study",
      description: "Project not found",
      noIndex: true,
    });
  }

  const canonical = `${siteConfig.url}/work/${project.slug}`;

  return constructMetadata({
    title: `${project.title} — Case study`,
    description: project.summary,
    canonical,
    image: getOgImageUrl({ title: project.title, subtitle: project.summary }),
    type: "article",
    keywords: [...project.tech, project.title, "Case study"],
  });
}

export default async function ProjectPage({ params }: Props) {
  const project =
    (await getProjectFromParams(params.slug)) ?? (await getFallbackProject(params.slug));

  if (!project) {
    notFound();
  }

  const isFallback = project.id.startsWith("fallback-");

  return (
    <>
      <ReadingProgress />
      
      <div className="relative min-h-screen pt-16 sm:pt-20 overflow-x-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 -z-10 bg-grid opacity-10" />
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-accent-a/5 via-transparent to-accent-b/5" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 max-w-7xl">
          <div className="grid lg:grid-cols-[1fr_280px] gap-8 lg:gap-12">
            {/* Main Content */}
            <article className="max-w-3xl w-full min-w-0">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <Link href={"/" as Route} className="hover:text-accent-a transition-colors whitespace-nowrap">Home</Link>
                <span className="shrink-0">›</span>
                <Link href={"/work" as Route} className="hover:text-accent-a transition-colors whitespace-nowrap">Work</Link>
                <span className="shrink-0">›</span>
                <span className="text-foreground min-w-0 truncate">{project.title}</span>
              </nav>

              {/* Header */}
              <header className="mb-8 sm:mb-12">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs uppercase tracking-wider text-muted-foreground mb-3 sm:mb-4">
                  <span className="pill-accent">Case Study</span>
                  <span>•</span>
                  <span>{new Date(project.createdAt).getFullYear()}</span>
                  {project.featured && (
                    <>
                      <span>•</span>
                      <span className="text-accent-a">✨ Featured</span>
                    </>
                  )}
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
                  {project.title}
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                  {project.summary}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                  {project.tech.map((item: string) => (
                    <span key={item} className="pill text-xs sm:text-sm">
                      {item}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                {(project.repoUrl || project.demoUrl) && (
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6 sm:mb-8">
                    {project.demoUrl && (
                      <Button asChild className="btn-primary w-full sm:w-auto min-h-[44px] sm:min-h-0">
                        <a href={project.demoUrl} target="_blank" rel="noreferrer">
                          View Live Demo →
                        </a>
                      </Button>
                    )}
                    {project.repoUrl && (
                      <Button asChild variant="outline" className="w-full sm:w-auto min-h-[44px] sm:min-h-0">
                        <a href={project.repoUrl} target="_blank" rel="noreferrer">
                          View Source Code
                        </a>
                      </Button>
                    )}
                  </div>
                )}

                {/* Cover Image */}
                {project.coverImage && (
                  <div className="surface-card overflow-hidden mb-6 sm:mb-8 rounded-lg">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </header>

              {/* Project Description */}
              <div className="prose prose-neutral max-w-none dark:prose-invert 
                prose-headings:scroll-mt-24 prose-headings:font-bold 
                prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mb-3 sm:prose-h2:mb-4 prose-h2:mt-8 sm:prose-h2:mt-12 
                prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mb-2 sm:prose-h3:mb-3 prose-h3:mt-6 sm:prose-h3:mt-8 
                prose-p:text-sm sm:prose-p:text-base prose-p:text-muted-foreground prose-p:leading-relaxed 
                prose-a:text-accent-a prose-a:no-underline hover:prose-a:underline prose-a:break-words
                prose-code:text-xs sm:prose-code:text-sm prose-code:text-accent-a prose-code:bg-muted prose-code:px-1.5 sm:prose-code:px-2 prose-code:py-0.5 sm:prose-code:py-1 prose-code:rounded-md prose-code:break-words
                prose-pre:text-xs sm:prose-pre:text-sm prose-pre:surface-card prose-pre:shadow-lg prose-pre:overflow-x-auto prose-pre:max-w-full
                prose-ul:text-sm sm:prose-ul:text-base prose-ol:text-sm sm:prose-ol:text-base
                prose-li:text-sm sm:prose-li:text-base
                prose-img:rounded-lg prose-img:shadow-md prose-img:w-full
                prose-table:text-xs sm:prose-table:text-sm prose-table:overflow-x-auto prose-table:block sm:prose-table:table
                overflow-wrap-anywhere">
                <ReactMarkdown>{project.description}</ReactMarkdown>
              </div>

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="mt-12 sm:mt-16">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Project Gallery</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {project.gallery.map((image: string, idx: number) => (
                      <div key={idx} className="surface-card overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`${project.title} screenshot ${idx + 1}`}
                          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Link href={"/work" as Route} className="text-sm sm:text-base text-muted-foreground hover:text-accent-a transition-colors flex items-center gap-2 min-h-[44px] sm:min-h-0">
                  ← Back to all projects
                </Link>
                <Link href={"/#contact" as Route} className="btn-primary inline-flex items-center w-full sm:w-auto justify-center text-sm sm:text-base min-h-[44px] sm:min-h-0 px-6">
                  Let&apos;s work together →
                </Link>
              </div>
            </article>

            {/* Sidebar with TOC */}
            <aside className="hidden lg:block">
              <TableOfContents />
              {isFallback && (
                <div className="mt-6 text-xs text-muted-foreground surface-card border border-amber-200/60 dark:border-amber-500/40 rounded-xl p-3">
                  ⚠️ This case study is rendered from static MDX content while the database is offline.
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
