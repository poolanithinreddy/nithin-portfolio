import Link from "next/link";
import type { Route } from "next";

import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [postCount, projectCount] = await Promise.all([
    prisma.post.count(),
    prisma.project.count(),
  ]);

  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#0f1319]">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Snapshot</h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <Metric label="Published posts" value={postCount} />
          <Metric label="Projects" value={projectCount} />
          <Metric label="Storage uploads" value="Managed via Supabase" subtle />
        </dl>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AdminCard
          title="Create a post"
          description="Draft long-form writing with markdown, cover images, and publish toggles."
          href="/admin/posts"
        />
        <AdminCard
          title="Launch a project"
          description="Update case studies, stack labels, and feature high-priority work."
          href="/admin/projects"
        />
        <AdminCard
          title="Manage media"
          description="Upload assets to Supabase storage and grab public URLs for posts or projects."
          href="/admin/media"
        />
        <AdminCard
          title="View site"
          description="Open the public portfolio in a new tab to verify updates."
          href="/"
          target="_blank"
        />
      </div>
    </section>
  );
}

function Metric({ label, value, subtle }: { label: string; value: number | string; subtle?: boolean }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0c1116]">
      <dt className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">{label}</dt>
      <dd className={`mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-50 ${subtle ? "text-2xl" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function AdminCard({
  title,
  description,
  href,
  target,
}: {
  title: string;
  description: string;
  href: Route | string;
  target?: string;
}) {
  return (
    <Link
      href={href as Route}
      target={target}
      className="group flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-[#0f1319]"
    >
      <h3 className="text-xl font-semibold text-neutral-900 transition group-hover:text-neutral-700 dark:text-neutral-50">{title}</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
      <span className="text-sm font-medium text-neutral-900 transition group-hover:translate-x-1 dark:text-neutral-50">
        Go →
      </span>
    </Link>
  );
}
