import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseDelimitedList(input: string) {
  return Array.from(
    new Set(
      input
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    )
  );
}

export function joinList(values: string[]) {
  return values.join("\n");
}
