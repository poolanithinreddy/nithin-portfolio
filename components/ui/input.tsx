import * as React from "react";
import { twMerge } from "tailwind-merge";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={twMerge(
          "flex h-11 w-full rounded-xl border border-neutral-300 bg-white px-4 text-base text-neutral-900 transition placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/60 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-[#0f1319] dark:text-neutral-50 dark:placeholder:text-neutral-500",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
