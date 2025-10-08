import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const titleSchema = z
  .string()
  .trim()
  .min(3, "Title must be at least 3 characters.")
  .max(160, "Title must be 160 characters or fewer.");

const slugSchema = z
  .string()
  .trim()
  .min(3, "Slug must be at least 3 characters.")
  .max(120, "Slug is too long.")
  .regex(slugRegex, "Use lowercase letters, numbers, and hyphens only.");

const summarySchema = z
  .string()
  .trim()
  .min(10, "Summary must be at least 10 characters.")
  .max(280, "Summary must be 280 characters or fewer.");

const descriptionSchema = z
  .string()
  .trim()
  .min(50, "Description must be at least 50 characters.")
  .max(10_000, "Description is too long.");

const urlSchema = z.string().trim().url("Enter a valid URL.");

const techItemSchema = z
  .string()
  .trim()
  .min(1, "Technology entries must not be empty.")
  .max(60, "Technology labels should be 60 characters or fewer.");

export const projectCreateSchema = z.object({
  title: titleSchema,
  slug: slugSchema,
  summary: summarySchema,
  description: descriptionSchema,
  coverImage: urlSchema.optional(),
  gallery: z.array(urlSchema).optional().default([]),
  repoUrl: urlSchema.optional(),
  demoUrl: urlSchema.optional(),
  tech: z.array(techItemSchema).min(1, "Add at least one technology."),
  featured: z.boolean(),
});

export const projectPatchSchema = z
  .object({
    title: titleSchema.optional(),
    slug: slugSchema.optional(),
    summary: summarySchema.optional(),
    description: descriptionSchema.optional(),
    coverImage: urlSchema.optional().or(z.literal(null)),
    gallery: z.array(urlSchema).optional(),
    repoUrl: urlSchema.optional().or(z.literal(null)),
    demoUrl: urlSchema.optional().or(z.literal(null)),
    tech: z.array(techItemSchema).min(1, "Add at least one technology.").optional(),
    featured: z.boolean().optional(),
  })
  .refine((values) => Object.values(values).some((value) => value !== undefined), {
    message: "Provide at least one field to update.",
  });

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectPatchInput = z.infer<typeof projectPatchSchema>;
