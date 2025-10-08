"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseDelimitedList, slugify } from "@/lib/utils";
import { projectCreateSchema } from "@/lib/validations/project";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const formSchema = z.object({
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
  summary: z
    .string()
    .trim()
    .min(10, "Summary must be at least 10 characters.")
    .max(280, "Summary must be 280 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(50, "Description must be at least 50 characters."),
  coverImage: z
    .string()
    .trim()
    .url("Enter a valid URL.")
    .or(z.literal(""))
    .optional(),
  repoUrl: z
    .string()
    .trim()
    .url("Enter a valid URL.")
    .or(z.literal(""))
    .optional(),
  demoUrl: z
    .string()
    .trim()
    .url("Enter a valid URL.")
    .or(z.literal(""))
    .optional(),
  tech: z
    .string()
    .trim()
    .min(1, "Add at least one technology."),
  gallery: z.string().trim().optional(),
  featured: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

type SubmitState = {
  status: "idle" | "saving" | "success" | "error";
  message?: string;
};

export function CreateProjectForm() {
  const router = useRouter();
  const [{ status, message }, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [slugEditedManually, setSlugEditedManually] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      description: "",
      coverImage: "",
      repoUrl: "",
      demoUrl: "",
      tech: "",
      gallery: "",
      featured: false,
    },
  });

  const titleValue = watch("title");

  useEffect(() => {
    if (slugEditedManually) {
      return;
    }
    setValue("slug", slugify(titleValue));
  }, [slugEditedManually, setValue, titleValue]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState({ status: "saving" });

    const techList = parseDelimitedList(values.tech);
    if (techList.length === 0) {
      setSubmitState({ status: "error", message: "Add at least one technology." });
      return;
    }

    const galleryList = values.gallery ? parseDelimitedList(values.gallery) : [];

    const parsed = projectCreateSchema.parse({
      title: values.title,
      slug: values.slug,
      summary: values.summary,
      description: values.description,
      coverImage: values.coverImage?.trim() ? values.coverImage : undefined,
      repoUrl: values.repoUrl?.trim() ? values.repoUrl : undefined,
      demoUrl: values.demoUrl?.trim() ? values.demoUrl : undefined,
      gallery: galleryList,
      tech: techList,
      featured: values.featured,
    });

    const payload = {
      ...parsed,
      coverImage: parsed.coverImage ?? null,
      repoUrl: parsed.repoUrl ?? null,
      demoUrl: parsed.demoUrl ?? null,
    };

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await safeJson(response);
        const errorMessage =
          response.status === 409
            ? "Slug already exists."
            : extractErrorMessage(data?.error, "Failed to create project.");
        setSubmitState({ status: "error", message: errorMessage });
        return;
      }

      reset({
        title: "",
        slug: "",
        summary: "",
        description: "",
        coverImage: "",
        repoUrl: "",
        demoUrl: "",
        tech: "",
        gallery: "",
        featured: false,
      });
      setSlugEditedManually(false);
      setSubmitState({ status: "success", message: "Project created successfully." });
      router.refresh();
    } catch (error) {
      console.error("Failed to create project", error);
      setSubmitState({ status: "error", message: "Unexpected error. Please try again." });
    }
  });

  const disabled = isSubmitting || status === "saving";

  const feedback = useMemo(() => {
    if (status === "error" && message) {
      return <p className="text-sm text-rose-500">{message}</p>;
    }
    if (status === "success" && message) {
      return <p className="text-sm text-emerald-500">{message}</p>;
    }
    return null;
  }, [status, message]);

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Project title" {...register("title")} />
        {errors.title ? <p className="text-sm text-rose-500">{errors.title.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          placeholder="project-slug"
          {...register("slug", {
            onChange(event) {
              setSlugEditedManually(event.target.value.length > 0);
            },
          })}
        />
        {errors.slug ? <p className="text-sm text-rose-500">{errors.slug.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" rows={3} placeholder="Short blurb shown on listing cards." {...register("summary")} />
        {errors.summary ? <p className="text-sm text-rose-500">{errors.summary.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={8}
          placeholder="Full case study overview displayed on the project detail page."
          {...register("description")}
        />
        {errors.description ? <p className="text-sm text-rose-500">{errors.description.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="coverImage">Cover image URL</Label>
        <Input id="coverImage" placeholder="https://images.supabase.co/..." {...register("coverImage")}
        />
        {errors.coverImage ? <p className="text-sm text-rose-500">{errors.coverImage.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="repoUrl">Repository URL</Label>
        <Input id="repoUrl" placeholder="https://github.com/..." {...register("repoUrl")}
        />
        {errors.repoUrl ? <p className="text-sm text-rose-500">{errors.repoUrl.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="demoUrl">Demo URL</Label>
        <Input id="demoUrl" placeholder="https://example.com/demo" {...register("demoUrl")}
        />
        {errors.demoUrl ? <p className="text-sm text-rose-500">{errors.demoUrl.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="tech">Tech stack</Label>
        <Textarea
          id="tech"
          rows={2}
          placeholder="Comma or newline separated list, e.g. Next.js, PostgreSQL, Prisma"
          {...register("tech")}
        />
        {errors.tech ? <p className="text-sm text-rose-500">{errors.tech.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="gallery">Gallery image URLs</Label>
        <Textarea
          id="gallery"
          rows={3}
          placeholder="Optional. One image URL per line."
          {...register("gallery")}
        />
        {errors.gallery ? <p className="text-sm text-rose-500">{errors.gallery.message}</p> : null}
      </div>

      <Controller
        control={control}
        name="featured"
        render={({ field }) => (
          <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-200">
            <Checkbox id="featured" checked={field.value} onChange={(event) => field.onChange(event.target.checked)} />
            <span>Featured project</span>
          </label>
        )}
      />

      {feedback}

      <Button type="submit" disabled={disabled} className="h-11 rounded-full">
        {disabled ? "Saving…" : "Create project"}
      </Button>
    </form>
  );
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function extractErrorMessage(error: unknown, fallback: string) {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object") {
    if ("message" in error && typeof (error as { message?: unknown }).message === "string") {
      return (error as { message: string }).message;
    }

    if ("formErrors" in error || "fieldErrors" in error) {
      const flat = error as { formErrors?: string[]; fieldErrors?: Record<string, string[]> };
      const firstFieldError = flat.fieldErrors
        ? Object.values(flat.fieldErrors).flat().find((item) => typeof item === "string")
        : undefined;
      if (firstFieldError) {
        return firstFieldError;
      }

      const firstFormError = flat.formErrors?.find((item) => typeof item === "string");
      if (firstFormError) {
        return firstFormError;
      }
    }
  }

  return fallback;
}
