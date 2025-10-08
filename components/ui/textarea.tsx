import * as React from "react";
import { twMerge } from "tailwind-merge";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={twMerge(
        "flex w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 transition placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/60 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-[#0f1319] dark:text-neutral-50 dark:placeholder:text-neutral-500",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
