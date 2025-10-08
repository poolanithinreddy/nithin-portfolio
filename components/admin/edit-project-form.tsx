"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { joinList, parseDelimitedList } from "@/lib/utils";
import { projectCreateSchema, projectPatchSchema } from "@/lib/validations/project";

const formSchema = z.object({
  title: projectCreateSchema.shape.title,
  summary: projectCreateSchema.shape.summary,
  description: projectCreateSchema.shape.description,
  coverImage: z.string().trim().url("Enter a valid URL.").or(z.literal("")),
  repoUrl: z.string().trim().url("Enter a valid URL.").or(z.literal("")),
  demoUrl: z.string().trim().url("Enter a valid URL.").or(z.literal("")),
  tech: z.string().trim().min(1, "Add at least one technology."),
  gallery: z.string().trim().optional(),
  featured: projectCreateSchema.shape.featured,
});

type FormValues = z.infer<typeof formSchema>;

type SubmitState = {
  status: "idle" | "saving" | "success" | "error";
  message?: string;
};

type EditableProject = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  coverImage: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  gallery: string[];
  tech: string[];
  featured: boolean;
};

interface EditProjectFormProps {
  project: EditableProject;
}

export function EditProjectForm({ project }: EditProjectFormProps) {
  const router = useRouter();
  const [{ status, message }, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [deleteState, setDeleteState] = useState<"idle" | "pending" | "error">("idle");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project.title,
      summary: project.summary,
      description: project.description,
      coverImage: project.coverImage ?? "",
      repoUrl: project.repoUrl ?? "",
      demoUrl: project.demoUrl ?? "",
      tech: project.tech.length > 0 ? project.tech.join(", ") : "",
      gallery: project.gallery.length > 0 ? joinList(project.gallery) : "",
      featured: project.featured,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState({ status: "saving" });

    const techList = parseDelimitedList(values.tech);
    if (techList.length === 0) {
      setSubmitState({ status: "error", message: "Add at least one technology." });
      return;
    }

    const galleryList = values.gallery ? parseDelimitedList(values.gallery) : [];

    const parsed = projectPatchSchema.parse({
      title: values.title,
      summary: values.summary,
      description: values.description,
      coverImage: values.coverImage ? values.coverImage : null,
      repoUrl: values.repoUrl ? values.repoUrl : null,
      demoUrl: values.demoUrl ? values.demoUrl : null,
      gallery: galleryList,
      tech: techList,
      featured: values.featured,
    });

    const payload = {
      ...parsed,
      coverImage: parsed.coverImage === undefined ? undefined : parsed.coverImage,
      repoUrl: parsed.repoUrl === undefined ? undefined : parsed.repoUrl,
      demoUrl: parsed.demoUrl === undefined ? undefined : parsed.demoUrl,
      gallery: parsed.gallery,
    };

    try {
      const response = await fetch(`/api/projects/${project.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await safeJson(response);
        setSubmitState({ status: "error", message: extractErrorMessage(data?.error, "Failed to update project.") });
        return;
      }

      setSubmitState({ status: "success", message: "Project updated." });
      reset({
        title: values.title,
        summary: values.summary,
        description: values.description,
        coverImage: values.coverImage,
        repoUrl: values.repoUrl,
        demoUrl: values.demoUrl,
        tech: values.tech,
        gallery: values.gallery,
        featured: values.featured,
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to update project", error);
      setSubmitState({ status: "error", message: "Unexpected error. Please try again." });
    }
  });

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this project? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    setDeleteState("pending");
    try {
      const response = await fetch(`/api/projects/${project.slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await safeJson(response);
        setDeleteState("error");
        setSubmitState({ status: "error", message: extractErrorMessage(data?.error, "Failed to delete project.") });
        return;
      }

  router.push("/admin/projects" as Route);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete project", error);
      setDeleteState("error");
      setSubmitState({ status: "error", message: "Unexpected error. Please try again." });
    }
  };

  const feedback = useMemo(() => {
    if (status === "error" && message) {
      return <p className="text-sm text-rose-500">{message}</p>;
    }
    if (status === "success" && message) {
      return <p className="text-sm text-emerald-500">{message}</p>;
    }
    return null;
  }, [status, message]);

  const disabled = isSubmitting || status === "saving";

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Project title" {...register("title")} />
        {errors.title ? <p className="text-sm text-rose-500">{errors.title.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" disabled readOnly value={project.slug} />
        <p className="text-xs text-neutral-500">Slug changes require a migration. Edit directly in the database if needed.</p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" rows={3} {...register("summary")} />
        {errors.summary ? <p className="text-sm text-rose-500">{errors.summary.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={10} {...register("description")} />
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
        <Textarea id="tech" rows={2} {...register("tech")} />
        {errors.tech ? <p className="text-sm text-rose-500">{errors.tech.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="gallery">Gallery image URLs</Label>
        <Textarea id="gallery" rows={3} {...register("gallery")} />
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

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={disabled || !isDirty}>
          {disabled ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => reset()} disabled={!isDirty || disabled}>
          Reset
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="text-rose-600 hover:text-rose-600"
          onClick={handleDelete}
          disabled={deleteState === "pending"}
        >
          {deleteState === "pending" ? "Deleting…" : "Delete"}
        </Button>
      </div>
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
