"use client";

import * as React from "react";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={`h-4 w-4 rounded border border-neutral-300 text-neutral-900 focus:ring-neutral-900 dark:border-white/20 dark:bg-[#101722] dark:text-neutral-50 ${className}`}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";
