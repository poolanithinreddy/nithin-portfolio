import type { Route } from "next";
import Link from "next/link";

import { CreateProjectForm } from "@/components/admin/create-project-form";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  type ProjectItem = (typeof projects)[number];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <aside className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0f1319]">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Create project</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          Publish new case studies with rich descriptions, optional media galleries, and tech stack labels.
        </p>
        <div className="mt-6">
          <CreateProjectForm />
        </div>
      </aside>

      <section>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Projects</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              These entries power the /work listing and individual case study pages once migrated off MDX.
            </p>
          </div>
          <Link href="/work" className="text-sm font-medium text-neutral-900 hover:underline dark:text-neutral-50">
            View work →
          </Link>
        </div>
        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Use the form to add your first case study."
          />
        ) : (
          <ul className="mt-6 space-y-4">
            {projects.map((project: ProjectItem) => (
              <li
                key={project.id}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#0f1319]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  {project.featured ? (
                    <span className="rounded-full border border-neutral-200 px-3 py-1 text-[11px] font-semibold text-neutral-600 dark:border-white/10 dark:text-neutral-300">
                      Featured
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 text-xl font-semibold text-neutral-900 dark:text-neutral-50">{project.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{project.summary}</p>
                {project.tech.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    {project.tech.map((item: string) => (
                      <span key={item} className="rounded-full bg-neutral-100 px-2.5 py-1 dark:bg-white/10 dark:text-neutral-200">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <Link
                    href={`/work/${project.slug}` as Route}
                    className="text-neutral-900 hover:underline dark:text-neutral-50"
                  >
                    View →
                  </Link>
                  <Link
                    href={`/admin/projects/${project.slug}` as Route}
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
