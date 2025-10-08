"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Route } from "next";

const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "fintech", label: "Fintech" },
  { id: "b2b-saas", label: "B2B SaaS" },
  { id: "healthtech", label: "Healthtech" },
  { id: "open-source", label: "Open Source" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

interface ProjectWithOutcome {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  tech: string[];
  featured: boolean;
  createdAt: Date;
  category?: CategoryId | string;
  outcome?: {
    metric: string; // e.g. "Latency"
    value: string;  // e.g. "-60%"
    trend: "up" | "down";
  };
}

interface ProjectGridProps {
  projects: ProjectWithOutcome[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [active, setActive] = useState<CategoryId>("all");
  const tablistRef = useRef<HTMLDivElement>(null);

  // Counts per category (for badges)
  const counts = useMemo(() => {
    const base = Object.fromEntries(CATEGORIES.map(c => [c.id, 0])) as Record<CategoryId, number>;
    for (const p of projects) {
      const id = (p.category as CategoryId) ?? "all";
      if (CATEGORIES.some(c => c.id === id)) base[id] += 1;
    }
    base.all = projects.length;
    return base;
  }, [projects]);

  const filtered = useMemo(
    () => (active === "all" ? projects : projects.filter(p => p.category === active)),
    [active, projects]
  );

  // Keyboard nav for tabs (←/→)
  useEffect(() => {
    const el = tablistRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement)) return;
      const idx = CATEGORIES.findIndex(c => c.id === active);
      if (e.key === "ArrowRight") {
        setActive(CATEGORIES[(idx + 1) % CATEGORIES.length].id);
      } else if (e.key === "ArrowLeft") {
        setActive(CATEGORIES[(idx - 1 + CATEGORIES.length) % CATEGORIES.length].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <section className="space-y-8" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="sr-only">Projects</h2>

      {/* Filters (tabs) */}
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Project categories"
        className="flex flex-wrap items-center gap-2"
      >
        {CATEGORIES.map((cat) => {
          const selected = active === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={selected}
              aria-controls={`projects-panel-${cat.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(cat.id)}
              className={[
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
                selected
                  ? "bg-gradient-to-r from-accent-a to-accent-c text-white shadow-lg shadow-accent-a/25"
                  : "glass-card text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100",
              ].join(" ")}
            >
              <span>{cat.label}</span>
              <span className="ml-2 inline-flex min-w-[1.5rem] justify-center rounded-full bg-black/5 dark:bg-white/10 px-2 py-0.5 text-[11px] font-bold text-neutral-700 dark:text-neutral-200">
                {counts[cat.id as CategoryId] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div
        id={`projects-panel-${active}`}
        role="tabpanel"
        aria-labelledby={active}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.length === 0 && (
          <div className="col-span-full surface-card p-8 text-center rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60">
            <p className="text-lg font-semibold mb-1">Nothing here yet</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No projects tagged <span className="font-semibold">{CATEGORIES.find(c => c.id === active)?.label}</span>.
            </p>
          </div>
        )}

        {filtered.map((project, i) => (
          <Link
            key={project.id}
            href={`/work/${project.slug}` as Route}
            className="group relative block rounded-2xl aura-border surface-card-hover p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            style={{
              animationDelay:
                typeof window !== "undefined" &&
                window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
                  ? undefined
                  : `${i * 70}ms`,
            }}
          >
            {/* Outcome badge */}
            {project.outcome && (
              <div
                className={[
                  "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm",
                  project.outcome.trend === "up"
                    ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-blue-500/12 text-blue-600 dark:text-blue-400 border border-blue-500/20",
                ].join(" ")}
                aria-label={`${project.outcome.metric} ${project.outcome.value} ${project.outcome.trend === "up" ? "improved" : "reduced"}`}
              >
                {project.outcome.trend === "up" ? "▲" : "▼"} {project.outcome.metric} {project.outcome.value}
              </div>
            )}

            {/* Category pill */}
            {project.category && (
              <div className="mb-3">
                <span className="pill text-[11px] capitalize">{String(project.category).replace("-", " ")}</span>
              </div>
            )}

            {/* Title */}
            <h3 className="text-xl font-bold text-neutral-950 dark:text-neutral-50 mb-2 group-hover:text-gradient transition-all">
              {project.title}
            </h3>

            {/* Summary */}
            {project.summary && (
              <p className="text-sm line-clamp-3 text-neutral-600 dark:text-neutral-300 mb-4">
                {project.summary}
              </p>
            )}

            {/* Tech stack */}
            {!!project.tech?.length && (
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tech.slice(0, 4).map((t) => (
                  <span key={t} className="chip text-[11px]">{t}</span>
                ))}
                {project.tech.length > 4 && (
                  <span className="chip text-[11px] opacity-70">+{project.tech.length - 4}</span>
                )}
              </div>
            )}

            {/* Footer micro-IA */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-[12px] text-neutral-500">
                <span>Client</span>
                <span>→</span>
                <span className="font-semibold text-accent-a">API</span>
                <span>→</span>
                <span>DB</span>
              </div>

              <span className="text-[12px] font-semibold text-neutral-700 dark:text-neutral-300 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition">
                View case study →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
