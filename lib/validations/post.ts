import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const postCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(160, "Title must be 160 characters or fewer."),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters.")
    .max(120, "Slug is too long.")
    .regex(slugRegex, "Use lowercase letters, numbers, and hyphens only."),
  excerpt: z
    .string()
    .trim()
    .max(240, "Excerpt must be 240 characters or fewer.")
    .optional(),
  content: z
    .string()
    .trim()
    .min(20, "Content must be at least 20 characters.")
    .max(30_000, "Content is too long."),
  coverImage: z.string().trim().url("Enter a valid URL.").optional(),
  published: z.boolean({ required_error: "Choose whether the post is published." }),
});

export const postPatchSchema = z
  .object({
    title: postCreateSchema.shape.title.optional(),
    slug: postCreateSchema.shape.slug.optional(),
    excerpt: postCreateSchema.shape.excerpt.or(z.literal(null)),
    content: postCreateSchema.shape.content.optional(),
    coverImage: postCreateSchema.shape.coverImage.or(z.literal(null)),
    published: postCreateSchema.shape.published.optional(),
  })
  .refine((values) => Object.values(values).some((value) => value !== undefined), {
    message: "Provide at least one field to update.",
  });

export type PostCreateInput = z.infer<typeof postCreateSchema>;
export type PostPatchInput = z.infer<typeof postPatchSchema>;
