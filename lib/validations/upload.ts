import { z } from "zod";

export const ACCEPTED_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
] as const;

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export const uploadRequestSchema = z
  .object({
    fileName: z
      .string({ required_error: "File name is required." })
      .trim()
      .min(1, "File name is required.")
      .max(180, "File name is too long."),
    contentType: z
      .string({ required_error: "Content type is required." })
      .trim()
      .refine((value) => ACCEPTED_UPLOAD_MIME_TYPES.includes(value as (typeof ACCEPTED_UPLOAD_MIME_TYPES)[number]), {
        message: "Unsupported file type."
      }),
    fileSize: z
      .number({ invalid_type_error: "File size must be a number." })
      .int()
      .positive()
      .max(MAX_UPLOAD_BYTES, "File is too large (max 10 MB).")
      .optional(),
  })
  .refine((data) => {
    if (!data.fileSize) {
      return true;
    }
    return data.fileSize > 0;
  }, "File is empty.");

export const uploadDeleteSchema = z.object({
  path: z
    .string({ required_error: "Path is required." })
    .trim()
    .min(1, "Path is required."),
});
