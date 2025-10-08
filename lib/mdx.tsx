import type { MDXComponents } from "mdx/types";
import { useMDXComponent } from "next-contentlayer/hooks";

import { cn } from "@/lib/utils";

const components: MDXComponents = {
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-16 scroll-m-20 text-3xl font-semibold tracking-tight text-neutral-900 first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-12 scroll-m-20 text-2xl font-semibold tracking-tight text-neutral-900",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("mt-6 leading-relaxed text-neutral-600", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("mt-6 list-disc space-y-2 pl-6 text-neutral-600", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("mt-6 list-decimal space-y-2 pl-6 text-neutral-600", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("leading-relaxed", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "mt-6 border-l-4 border-neutral-200 pl-4 text-neutral-600 italic",
        className
      )}
      {...props}
    />
  ),
  hr: (props) => <hr className="my-10 border-neutral-200" {...props} />,
  table: ({ className, ...props }) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className={cn("w-full text-left text-sm text-neutral-600", className)} {...props} />
    </div>
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn("font-semibold text-neutral-900 underline underline-offset-4", className)}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-sm text-neutral-900",
        className
      )}
      {...props}
    />
  ),
};

export function Mdx({ code }: { code: string }) {
  const Component = useMDXComponent(code);

  return (
    <div className="prose prose-neutral max-w-none">
      <Component components={components} />
    </div>
  );
}
