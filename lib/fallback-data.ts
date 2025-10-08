import type { Project } from "contentlayer/generated";
import { allProjects, allPosts } from "contentlayer/generated";

function toIsoFromYear(year?: number): string {
  if (!year) {
    return new Date().toISOString();
  }

  const date = new Date(year, 0, 1);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

function pickRepoLink(links: Project["links"] | undefined): string | null {
  if (!links?.length) {
    return null;
  }

  const matcher = /(github|gitlab|bitbucket)/i;
  const repo = links.find((link) => matcher.test(link.href));
  return repo?.href ?? null;
}

function pickDemoLink(links: Project["links"] | undefined): string | null {
  if (!links?.length) {
    return null;
  }

  const matcher = /(github|gitlab|bitbucket)/i;
  const demo = links.find((link) => !matcher.test(link.href));
  return (demo ?? links[0]).href;
}

export type FallbackProject = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  featured: boolean;
  tech: string[];
  createdAt: string;
  coverImage: string | null;
  gallery: string[];
  repoUrl: string | null;
  demoUrl: string | null;
};

export function getFallbackProjects(): FallbackProject[] {
  return [...allProjects]
    .sort((a, b) => {
      const aDate = toIsoFromYear(a.year);
      const bDate = toIsoFromYear(b.year);
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    })
    .map((project) => ({
      id: `fallback-${project.slug}`,
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      description: project.body.raw,
      featured: project.featured ?? false,
      tech: project.stack ?? [],
      createdAt: toIsoFromYear(project.year),
      coverImage: null,
      gallery: [],
      repoUrl: pickRepoLink(project.links),
      demoUrl: pickDemoLink(project.links),
    }));
}

export function getFallbackProjectBySlug(slug: string): FallbackProject | undefined {
  return getFallbackProjects().find((project) => project.slug === slug);
}

export type FallbackPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  url: string;
};

export function getFallbackPosts(): FallbackPost[] {
  return [...allPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .map((post) => ({
      id: `fallback-${post.slug}`,
      title: post.title,
      slug: post.slug,
      excerpt: post.summary,
      content: post.body.raw,
      coverImage: null,
      published: true,
      createdAt: new Date(post.publishedAt).toISOString(),
      url: post.url,
    }));
}

export function getFallbackPostBySlug(slug: string): FallbackPost | undefined {
  return getFallbackPosts().find((post) => post.slug === slug);
}
