// app/(site)/blog/page.tsx
import type { Route } from "next";
import Link from "next/link";
import ClientList from "@/app/(site)/blog/ClientList";

import { prisma } from "@/lib/db";
import { constructMetadata, siteConfig } from "@/lib/seo";
import { getFallbackPosts } from "@/lib/fallback-data";

export const revalidate = 0;

export const metadata = constructMetadata({
  title: "Blog",
  description:
    "Engineering notes on SAML, vCenter automation, and building production-ready systems.",
  canonical: `${siteConfig.url}/blog`,
  keywords: [
    "Engineering blog",
    "SAML",
    "vCenter automation",
    "Systems design",
    "Observability",
  ],
  type: "article",
});

const fmt = (d: Date) =>
  d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export default async function BlogIndex() {
  let posts = [] as Awaited<ReturnType<typeof prisma.post.findMany>>;
  let usedFallback = false;

  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("[blog/page] Unable to query posts; using fallback", error);
    posts = [];
    usedFallback = true;
  }

  type BlogPost = (typeof posts)[number];

  // Fallback to Contentlayer MDX when Prisma has nothing
  const mdxFallback =
    posts.length === 0
      ? getFallbackPosts().map((post) => ({
          ...post,
          url: post.url as Route,
        }))
      : [];

  // Structured data (SEO): Blog + ItemList
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Nithin Reddy Poola — Engineering Blog",
    url: `${siteConfig.url}/blog`,
    description:
      "Engineering notes on SAML, vCenter automation, and building production-ready systems.",
    blogPost: posts.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      datePublished: p.createdAt,
      url: `${siteConfig.url}/blog/${p.slug}`,
    })),
  };

  const hasFeatured = posts.length > 0;
  const [featured, ...rest] = posts;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="relative pt-32 pb-10 sm:pb-14 overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-radial opacity-30" />
        <div className="fixed inset-0 -z-10 bg-grid opacity-10" />

        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold">Engineering Notes</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-5 leading-[1.08]">
            <span className="block">Technical</span>
            <span className="block text-gradient">Deep-Dives</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            System design patterns, performance wins, and lessons learned from
            shipping real production systems.
          </p>
        </div>
      </section>

      <main className="container-narrow pb-24">
        {/* optional client-side filters/search you already have */}
        <ClientList />

        {/* ===== When you have DB posts: show a featured card + grid ===== */}
        {hasFeatured ? (
          <>
            {/* Featured */}
            <Link
              href={`/blog/${featured.slug}` as Route}
              className="group relative block overflow-hidden rounded-3xl mb-8 md:mb-12 border border-neutral-200/60 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* glow */}
              <div className="pointer-events-none absolute -inset-1 rounded-[inherit] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 blur-xl transition" />

              <div className="relative p-6 sm:p-8 md:p-10">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {fmt(featured.createdAt)}
                </p>
                <h2 className="mt-2 md:mt-3 text-3xl md:text-4xl font-extrabold leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {featured.title}
                  </span>
                </h2>
                {featured.excerpt ? (
                  <p className="mt-3 md:mt-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {featured.excerpt}
                  </p>
                ) : null}

                <div className="mt-5 flex items-center gap-3 text-sm font-semibold">
                  <span className="btn-secondary rounded-xl px-4 py-2">
                    Read Article
                  </span>
                  <span className="text-muted-foreground hidden sm:inline">
                    ~5 min read
                  </span>
                </div>
              </div>
            </Link>

            {/* Grid of the rest */}
            <div className="grid gap-5 sm:grid-cols-2">
              {rest.map((post: BlogPost) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}` as Route}
                  className="group relative overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="pointer-events-none absolute -inset-0.5 rounded-[inherit] bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 blur-xl transition" />
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {fmt(post.createdAt)}
                  </p>
                  <h3 className="mt-2 text-xl font-bold leading-snug transition-colors group-hover:text-accent-a">
                    {post.title}
                  </h3>
                  {post.excerpt ? (
                    <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 line-clamp-3">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>~5 min read</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : // ===== When no DB posts: show Contentlayer fallback nicely =====
        mdxFallback.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {mdxFallback.map((post) => (
              <Link
                key={post.slug}
                href={post.url as Route}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="pointer-events-none absolute -inset-0.5 rounded-[inherit] bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 blur-xl transition" />
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <h3 className="mt-2 text-xl font-bold leading-snug transition-colors group-hover:text-accent-a">
                  {post.title}
                </h3>
                {post.excerpt ? (
                  <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 line-clamp-3">
                    {post.excerpt}
                  </p>
                ) : null}
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>~5 min read</span>
                </div>
              </Link>
            ))}

            <p className="sm:col-span-2 text-sm text-muted-foreground surface-card p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-800/50">
              📝 Showing content from static MDX files.
              {usedFallback
                ? " The database is currently unreachable, so these entries are served from version-controlled content."
                : " New entries appear instantly after publishing through the admin panel."}
            </p>
          </div>
        ) : (
          // ===== Totally empty state =====
          <div className="surface-card p-16 text-center rounded-3xl border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-6">
              Publish your first post through the admin panel.
            </p>
            <Link
              href={"/blog/new" as Route}
              className="btn-primary inline-flex items-center"
            >
              Create Post →
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
