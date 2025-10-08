import type { Route } from "next";
import Link from "next/link";

import { CreatePostForm } from "@/components/admin/create-post-form";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
  type PostItem = (typeof posts)[number];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <aside className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0f1319]">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Create post</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          Draft new writing with markdown support, optional cover image, and publish toggle. All required fields must be
          filled before publishing.
        </p>
        <div className="mt-6">
          <CreatePostForm />
        </div>
      </aside>

      <section>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Recent posts</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Posts are served via Postgres first. If empty, the public site falls back to MDX content.
            </p>
          </div>
          <Link href="/blog" className="text-sm font-medium text-neutral-900 hover:underline dark:text-neutral-50">
            View blog →
          </Link>
        </div>
        {posts.length === 0 ? (
          <EmptyState
            title="No posts yet"
            description="Use the form to publish your first post."
          />
        ) : (
          <ul className="mt-6 space-y-4">
            {posts.map((post: PostItem) => (
              <li
                key={post.id}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#0f1319]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-white/10 dark:text-neutral-300">
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-neutral-900 dark:text-neutral-50">{post.title}</h3>
                {post.excerpt && <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{post.excerpt}</p>}
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <Link
                    href={`/blog/${post.slug}` as Route}
                    className="text-neutral-900 hover:underline dark:text-neutral-50"
                  >
                    View →
                  </Link>
                  <Link
                    href={`/admin/posts/${post.slug}` as Route}
                    className="text-neutral-700 hover:underline dark:text-neutral-300"
                  >
                    Edit →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="mt-10 rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500 dark:border-white/20 dark:bg-[#0f1319]">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{title}</h3>
      <p className="mt-2">{description}</p>
    </div>
  );
}
