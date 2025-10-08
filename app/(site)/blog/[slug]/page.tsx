import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import type { Route } from "next";

import { allPosts } from "contentlayer/generated";

import { Mdx } from "@/lib/mdx";
import { prisma } from "@/lib/db";
import { constructMetadata, getOgImageUrl, siteConfig } from "@/lib/seo";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents, FloatingToc } from "@/components/table-of-contents";

export const revalidate = 0;

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

async function getPost(slug: string) {
  try {
    return await prisma.post.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.warn(`[blog/${slug}] Unable to query post; using fallback`, error);
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);
  const mdxPost = post ? null : allPosts.find((entry) => entry.slug === params.slug);

  if (!post && !mdxPost) {
    return constructMetadata({
      title: "Blog",
      description: "Post not found",
      noIndex: true,
    });
  }

  const canonical = `${siteConfig.url}/blog/${post?.slug ?? mdxPost!.slug}`;
  const description = post?.excerpt ?? mdxPost?.summary ?? post?.content.slice(0, 160) ?? "";

  return constructMetadata({
    title: `${post?.title ?? mdxPost!.title} — Blog`,
    description,
    canonical,
    image: getOgImageUrl({ title: post?.title ?? mdxPost!.title, subtitle: description }),
    type: "article",
    keywords: [post?.title ?? mdxPost!.title],
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);

  if (post) {
    return (
      <>
        <ReadingProgress />
        <FloatingToc />
        
        <div className="relative min-h-screen pt-20">
          {/* Background Effects */}
          <div className="fixed inset-0 -z-10 bg-grid opacity-10" />
          <div className="fixed inset-0 -z-10 bg-gradient-to-br from-accent-a/5 via-transparent to-accent-c/5" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            <div className="grid lg:grid-cols-[1fr_280px] gap-12">
              {/* Main Content */}
              <div className="max-w-3xl">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                  <Link href={"/" as Route} className="hover:text-accent-a transition-colors">Home</Link>
                  <span>›</span>
                  <Link href={"/blog" as Route} className="hover:text-accent-a transition-colors">Blog</Link>
                  <span>›</span>
                  <span className="text-foreground">{post.title}</span>
                </nav>

                {/* Header */}
                <header className="mb-12">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                    {post.title}
                  </h1>
                  {post.excerpt && (
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </header>

                {/* Cover Image */}
                {post.coverImage && (
                  <div className="surface-card overflow-hidden mb-12">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.coverImage} alt="cover" className="w-full h-auto object-cover" />
                  </div>
                )}

                {/* Article Content */}
                <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-bold prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-12 prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8 prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-accent-a prose-a:no-underline hover:prose-a:underline prose-code:text-accent-a prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-pre:surface-card prose-pre:shadow-lg prose-img:rounded-lg prose-img:shadow-md prose-blockquote:border-l-accent-a prose-blockquote:italic">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </article>

                {/* Navigation */}
                <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
                  <Link href={"/blog" as Route} className="text-muted-foreground hover:text-accent-a transition-colors flex items-center gap-2">
                    ← Back to blog
                  </Link>
                  <Link href={"/#contact" as Route} className="btn-primary inline-flex items-center">
                    Get in touch →
                  </Link>
                </div>
              </div>

              {/* Sidebar with TOC */}
              <aside className="hidden lg:block">
                <TableOfContents />
              </aside>
            </div>
          </div>
        </div>
      </>
    );
  }

  const mdxPost = allPosts.find((entry) => entry.slug === params.slug);

  if (!mdxPost) {
    notFound();
  }

  return (
    <>
      <ReadingProgress />
      <FloatingToc />
      
      <div className="relative min-h-screen pt-20">
        {/* Background Effects */}
        <div className="fixed inset-0 -z-10 bg-grid opacity-10" />
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-accent-a/5 via-transparent to-accent-c/5" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12">
            {/* Main Content */}
            <div className="max-w-3xl">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <Link href={"/" as Route} className="hover:text-accent-a transition-colors">Home</Link>
                <span>›</span>
                <Link href={"/blog" as Route} className="hover:text-accent-a transition-colors">Blog</Link>
                <span>›</span>
                <span className="text-foreground">{mdxPost.title}</span>
              </nav>

              {/* Header */}
              <header className="mb-12">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                  {new Date(mdxPost.publishedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                  {mdxPost.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {mdxPost.summary}
                </p>
              </header>

              {/* Article Content */}
              <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-bold prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-12 prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8 prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-accent-a prose-a:no-underline hover:prose-a:underline prose-code:text-accent-a prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-pre:surface-card prose-pre:shadow-lg prose-img:rounded-lg prose-img:shadow-md prose-blockquote:border-l-accent-a prose-blockquote:italic">
                <Mdx code={mdxPost.body.code} />
              </article>

              {/* Navigation */}
              <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
                <Link href={"/blog" as Route} className="text-muted-foreground hover:text-accent-a transition-colors flex items-center gap-2">
                  ← Back to blog
                </Link>
                <Link href={"/#contact" as Route} className="btn-primary inline-flex items-center">
                  Get in touch →
                </Link>
              </div>
            </div>

            {/* Sidebar with TOC */}
            <aside className="hidden lg:block">
              <TableOfContents />
              <div className="mt-6 text-xs text-muted-foreground surface-card border border-amber-200/60 dark:border-amber-500/40 rounded-xl p-3">
                ⚠️ This article is rendered from static MDX content while the database is offline.
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
