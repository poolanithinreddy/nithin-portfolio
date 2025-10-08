import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

type ProjectCardProps = {
  title: string;
  summary: string;
  href: Route;
  stack: string[];
  image?: string;
  eyebrow?: string;
};

export function ProjectCard({ title, summary, href, stack, image, eyebrow }: ProjectCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      {image ? (
        <Image
          src={image}
          alt=""
          width={1200}
          height={675}
          className="h-48 w-full object-cover"
          priority={false}
        />
      ) : (
        <div className="h-48 w-full bg-neutral-100" aria-hidden />
      )}
      <div className="flex flex-1 flex-col gap-4 p-6">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            {eyebrow}
          </span>
        )}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          <p className="text-sm leading-relaxed text-neutral-600">{summary}</p>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
