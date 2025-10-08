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
import { slugify } from "@/lib/utils";
import { postCreateSchema } from "@/lib/validations/post";

type FormValues = z.input<typeof postCreateSchema>;

type SubmitState = {
  status: "idle" | "saving" | "success" | "error";
  message?: string;
};

export function CreatePostForm() {
  const router = useRouter();
  const [{ status, message }, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [slugEditedManually, setSlugEditedManually] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      published: true,
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

    const parsed = postCreateSchema.parse({
      ...values,
      excerpt: values.excerpt?.trim() ? values.excerpt : undefined,
      coverImage: values.coverImage?.trim() ? values.coverImage : undefined,
    });

    const payload = {
      ...parsed,
      excerpt: parsed.excerpt ?? null,
      coverImage: parsed.coverImage ?? null,
    };

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await safeJson(response);
        const errorMessage =
          response.status === 409
            ? "Slug already exists."
            : extractErrorMessage(data?.error, "Failed to create post.");
        setSubmitState({ status: "error", message: errorMessage });
        return;
      }

      reset({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        published: true,
      });
      setSlugEditedManually(false);
      setSubmitState({ status: "success", message: "Post created successfully." });
      router.refresh();
    } catch (error) {
      console.error("Failed to create post", error);
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
        <Input id="title" placeholder="Example: Automating vCenter backups" {...register("title")}
          onBlur={() => setValue("title", titleValue.trim())}
        />
        {errors.title ? <p className="text-sm text-rose-500">{errors.title.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          placeholder="automating-vcenter-backups"
          {...register("slug", {
            onChange(event) {
              setSlugEditedManually(event.target.value.length > 0);
            },
          })}
        />
        {errors.slug ? <p className="text-sm text-rose-500">{errors.slug.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          rows={3}
          placeholder="Short summary displayed on the blog index."
          {...register("excerpt")}
        />
        {errors.excerpt ? <p className="text-sm text-rose-500">{errors.excerpt.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          rows={10}
          placeholder="Write your post in markdown or plain text."
          {...register("content")}
        />
        {errors.content ? <p className="text-sm text-rose-500">{errors.content.message}</p> : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="coverImage">Cover image URL</Label>
        <Input id="coverImage" placeholder="https://images.supabase.co/..." {...register("coverImage")}
        />
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

      <Button type="submit" disabled={disabled} className="h-11 rounded-full">
        {disabled ? "Saving…" : "Publish post"}
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
