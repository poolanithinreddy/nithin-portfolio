import Link from "next/link";
import { notFound } from "next/navigation";

import { EditPostForm } from "@/components/admin/edit-post-form";
import { prisma } from "@/lib/db";
import { constructMetadata } from "@/lib/seo";

interface AdminPostPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Edit post | Admin",
  description: "Update existing posts, adjust publish status, and manage metadata.",
  noIndex: true,
});

export default async function EditAdminPostPage({ params }: AdminPostPageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    notFound();
  }

  const serializablePost = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    published: post.published,
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Editing</p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">{post.title}</h1>
        </div>
        <Link
          href="/admin/posts"
          className="text-sm font-medium text-neutral-600 hover:underline dark:text-neutral-300"
        >
          ← Back to posts
        </Link>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0f1319]">
        <EditPostForm post={serializablePost} />
      </div>
    </div>
  );
}
