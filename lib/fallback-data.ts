type ContentlayerExports = typeof import("contentlayer/generated");

let contentlayerPromise: Promise<ContentlayerExports> | null = null;

async function loadContentlayer(): Promise<ContentlayerExports> {
  if (!contentlayerPromise) {
    contentlayerPromise = import("../.contentlayer/generated/index.mjs") as Promise<ContentlayerExports>;
  }

  return contentlayerPromise!;
}

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

type ProjectDoc = ContentlayerExports["allProjects"][number];

function pickRepoLink(links: ProjectDoc["links"] | undefined): string | null {
  if (!links?.length) {
    return null;
  }

  const matcher = /(github|gitlab|bitbucket)/i;
  const repo = links.find((link) => matcher.test(link.href));
  return repo?.href ?? null;
}

function pickDemoLink(links: ProjectDoc["links"] | undefined): string | null {
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

export async function getFallbackProjects(): Promise<FallbackProject[]> {
  const { allProjects } = await loadContentlayer();

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

export async function getFallbackProjectBySlug(slug: string): Promise<FallbackProject | undefined> {
  const projects = await getFallbackProjects();
  return projects.find((project) => project.slug === slug);
}

export type FallbackPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  code: string;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  url: string;
};

export async function getFallbackPosts(): Promise<FallbackPost[]> {
  const { allPosts } = await loadContentlayer();

  return [...allPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .map((post) => ({
      id: `fallback-${post.slug}`,
      title: post.title,
      slug: post.slug,
      excerpt: post.summary,
      content: post.body.raw,
      code: post.body.code,
      coverImage: null,
      published: true,
      createdAt: new Date(post.publishedAt).toISOString(),
      url: post.url,
    }));
}

export async function getFallbackPostBySlug(slug: string): Promise<FallbackPost | undefined> {
  const posts = await getFallbackPosts();
  return posts.find((post) => post.slug === slug);
}
