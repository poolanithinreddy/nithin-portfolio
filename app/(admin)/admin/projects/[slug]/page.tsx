import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EditProjectForm } from "@/components/admin/edit-project-form";
import { prisma } from "@/lib/db";
import { constructMetadata } from "@/lib/seo";

interface AdminProjectPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Edit project | Admin",
  description: "Modify case studies, update tech stacks, and manage featured work.",
  noIndex: true,
});

export default async function EditAdminProjectPage({ params }: AdminProjectPageProps) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project) {
    notFound();
  }

  const serializableProject = {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    description: project.description,
    coverImage: project.coverImage,
    repoUrl: project.repoUrl,
    demoUrl: project.demoUrl,
    gallery: project.gallery,
    tech: project.tech,
    featured: project.featured,
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Editing</p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">{project.title}</h1>
        </div>
        <Link
          href={"/admin/projects" as Route}
          className="text-sm font-medium text-neutral-600 hover:underline dark:text-neutral-300"
        >
          ← Back to projects
        </Link>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0f1319]">
        <EditProjectForm project={serializableProject} />
      </div>
    </div>
  );
}
