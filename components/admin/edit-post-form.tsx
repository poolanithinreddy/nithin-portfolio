"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { postCreateSchema, postPatchSchema } from "@/lib/validations/post";

const excerptField = (postCreateSchema.shape.excerpt as z.ZodOptional<z.ZodString>).unwrap();
const coverImageField = (postCreateSchema.shape.coverImage as z.ZodOptional<z.ZodString>).unwrap();

const formSchema = z.object({
  title: postCreateSchema.shape.title,
  excerpt: z.union([excerptField, z.literal("")]),
  content: postCreateSchema.shape.content,
  coverImage: z.union([coverImageField, z.literal("")]),
  published: postCreateSchema.shape.published,
});

type FormValues = z.infer<typeof formSchema>;

type SubmitState = {
  status: "idle" | "saving" | "success" | "error";
  message?: string;
};

type EditablePost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
};

interface EditPostFormProps {
  post: EditablePost;
}
export function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  const [{ status, message }, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [deleteState, setDeleteState] = useState<"idle" | "pending" | "error">("idle");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      excerpt: post.excerpt ?? "",
      content: post.content,
      coverImage: post.coverImage ?? "",
      published: post.published,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState({ status: "saving" });
    const parsed = postPatchSchema.parse({
      title: values.title,
      excerpt: values.excerpt.trim() ? values.excerpt : null,
      content: values.content,
      coverImage: values.coverImage.trim() ? values.coverImage : null,
      published: values.published,
    });

    const payload = {
      ...parsed,
      excerpt: parsed.excerpt === null ? null : parsed.excerpt,
      coverImage: parsed.coverImage === null ? null : parsed.coverImage,
    };
    try {
      const response = await fetch(`/api/posts/${post.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await safeJson(response);
        setSubmitState({ status: "error", message: extractErrorMessage(data?.error, "Failed to update post.") });
        return;
      }

      setSubmitState({ status: "success", message: "Post updated." });
      reset({
        title: values.title,
        excerpt: values.excerpt,
        content: values.content,
        coverImage: values.coverImage,
        published: values.published,
      });
    } catch (error) {
      console.error("Failed to update post", error);
      setSubmitState({ status: "error", message: "Unexpected error. Please try again." });
    }
  });

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this post? This action cannot be undone.");
    if (!confirmed) {
      return;
    }
    setDeleteState("pending");
    try {
      const response = await fetch(`/api/posts/${post.slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await safeJson(response);
        setDeleteState("error");
        setSubmitState({ status: "error", message: extractErrorMessage(data?.error, "Failed to delete post.") });
        return;
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete post", error);
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
        <Input id="title" placeholder="Post title" {...register("title")} />
        {errors.title ? <p className="text-sm text-rose-500">{errors.title.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" value={post.slug} disabled readOnly />
        <p className="text-xs text-neutral-500">Slug changes reflow URLs; edit directly in the database if required.</p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" rows={3} {...register("excerpt")} />
        {errors.excerpt ? <p className="text-sm text-rose-500">{errors.excerpt.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" rows={12} {...register("content")} />
        {errors.content ? <p className="text-sm text-rose-500">{errors.content.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="coverImage">Cover image URL</Label>
        <Input id="coverImage" placeholder="https://images.supabase.co/..." {...register("coverImage")} />
        {errors.coverImage ? <p className="text-sm text-rose-500">{errors.coverImage.message}</p> : null}
      </div>

      <Controller
        control={control}
        name="published"
        render={({ field }) => (
          <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-200">
            <Checkbox
              id="published"
              checked={field.value}
              onChange={(event) => field.onChange(event.target.checked)}
            />
            <span>Published</span>
          </label>
        )}
      />
      {errors.published ? <p className="text-sm text-rose-500">{errors.published.message}</p> : null}

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
