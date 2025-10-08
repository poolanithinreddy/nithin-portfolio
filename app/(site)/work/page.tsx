import type { Route } from "next";
import Link from "next/link";
import { Briefcase, ExternalLink, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { constructMetadata, siteConfig } from "@/lib/seo";
import { WorkFilters } from "@/components/work-filters";
import { getFallbackProjects } from "@/lib/fallback-data";

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Work",
  description: "Case studies covering CyberRange, AgentX, FluCast, AI Interview, and more.",
  canonical: `${siteConfig.url}/work`,
  keywords: [
    "Portfolio",
    "Case studies",
    "CyberRange",
    "AgentX",
    "FluCast",
    "AI Interview",
  ],
});

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
};

export default async function WorkPage() {
  let projects: ProjectViewModel[] = [];

  try {
    const dbProjects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });

    projects = dbProjects.map((project) => ({
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
    }));
  } catch (error) {
    console.warn("[work/page] Unable to query projects; using fallback", error);
  }

  if (projects.length === 0) {
    const fallbackProjects = await getFallbackProjects();
    if (fallbackProjects.length > 0) {
      projects = fallbackProjects.map((project) => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        summary: project.summary,
        description: project.description,
        coverImage: project.coverImage,
        gallery: project.gallery,
        repoUrl: project.repoUrl,
        demoUrl: project.demoUrl,
        tech: project.tech,
        featured: project.featured,
        createdAt: new Date(project.createdAt),
      }));
    }
  }

  const featuredProjects = projects.filter((p) => p.featured);
  const regularProjects = projects.filter((p) => !p.featured);
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10 gradient-radial opacity-30" />
        
        <div className="container-wide text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Briefcase className="h-4 w-4 text-accent-a" />
            <span className="text-sm font-semibold">Portfolio</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="block">Selected</span>
            <span className="block text-gradient">Case Studies</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            End-to-end delivery: <span className="text-foreground font-semibold">UI</span>, 
            <span className="text-foreground font-semibold"> API</span>, 
            <span className="text-foreground font-semibold"> infrastructure</span>, and 
            <span className="text-foreground font-semibold"> operations</span>. 
            Every project shipped with production guardrails.
          </p>

          {/* CTA */}
          <Button asChild size="lg" className="btn-primary text-lg h-14 px-8">
            <Link href={"/contact" as Route}>Let&apos;s Build Together</Link>
          </Button>
        </div>
      </section>

      <div className="container-wide pb-24">
        {/* Filters */}
        <div className="mb-12">
          <WorkFilters />
        </div>

        {/* Fallback data is handled silently to avoid disrupting the browsing experience. */}

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-2 mb-8">
              <Star className="h-5 w-5 text-accent-a" />
              <h2 className="text-2xl md:text-3xl font-bold">Featured Projects</h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {featuredProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}` as Route}
                  className="group glass-card-hover p-8"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="badge-accent">
                      <Star className="h-3 w-3" />
                      <span>Featured</span>
                    </span>
                    <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-accent-a transition-colors" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-gradient transition-all">
                    {project.title}
                  </h3>

                  {project.summary && (
                    <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                      {project.summary}
                    </p>
                  )}

                  {project.tech?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {project.tech.slice(0, 6).map((tech: string) => (
                        <span key={tech} className="tag text-xs">{tech}</span>
                      ))}
                      {project.tech.length > 6 && (
                        <span className="tag text-xs font-bold">+{project.tech.length - 6}</span>
                      )}
                    </div>
                  ) : null}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Projects */}
        {regularProjects.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-8">All Projects</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regularProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}` as Route}
                  className="group surface-card-hover p-6"
                >
                  <h3 className="text-xl font-bold mb-3 group-hover:text-gradient transition-all">
                    {project.title}
                  </h3>

                  {project.summary && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {project.summary}
                    </p>
                  )}

                  {project.tech?.length ? (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.tech.slice(0, 4).map((tech: string) => (
                        <span key={tech} className="text-xs px-2 py-1 rounded-md bg-muted/50 text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="text-xs px-2 py-1 rounded-md bg-muted/50 text-muted-foreground font-bold">
                          +{project.tech.length - 4}
                        </span>
                      )}
                    </div>
                  ) : null}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="glass-card p-20 text-center">
            <div className="text-6xl mb-6">📁</div>
            <h3 className="text-3xl font-bold mb-4">No projects yet</h3>
            <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
              Check back soon for new case studies showcasing end-to-end engineering solutions.
            </p>
            <Button asChild size="lg" className="btn-primary">
              <Link href={"/contact" as Route}>Discuss Your Project</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
