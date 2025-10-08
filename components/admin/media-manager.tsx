"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type MediaItem = {
  path: string;
  name: string;
  bucket: string;
  size: number | null;
  mimeType: string | null;
  updatedAt: string | null;
  createdAt: string | null;
  lastAccessedAt: string | null;
  publicUrl: string | null;
};

type UploadState = {
  status: "idle" | "request" | "upload" | "success" | "error";
  message?: string;
};

type FetchState = {
  isLoading: boolean;
  error?: string;
};

const bucketFromEnv = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "portfolio-media";

export function MediaManager() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [configured, setConfigured] = useState<boolean>(true);
  const [fetchState, setFetchState] = useState<FetchState>({ isLoading: true });
  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle" });
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const bucketName = useMemo(() => bucketFromEnv.trim(), []);

  const loadMedia = useCallback(async () => {
    setFetchState({ isLoading: true });
    try {
      const response = await fetch("/api/uploads", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        const data = await safeJson(response);
        throw new Error(data?.error ?? "Failed to load media assets.");
      }

      const data = (await response.json()) as { configured?: boolean; files?: MediaItem[] };
      setConfigured(data.configured ?? true);
      setItems(data.files ?? []);
      setFetchState({ isLoading: false });
    } catch (error) {
      console.error("Failed to fetch media assets", error);
      setFetchState({ isLoading: false, error: (error as Error).message });
    }
  }, []);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  const handleUpload = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const file = fileInputRef.current?.files?.[0];

      if (!file) {
        setUploadState({ status: "error", message: "Select a file to upload." });
        return;
      }

      setUploadState({ status: "request" });

      try {
        const response = await fetch("/api/uploads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type || "application/octet-stream",
            fileSize: file.size,
          }),
        });

        if (!response.ok) {
          const data = await safeJson(response);
          throw new Error(extractErrorMessage(data?.error, "Failed to create upload session."));
        }

        const data = (await response.json()) as {
          path: string;
          token: string;
          signedUrl: string;
          publicUrl: string | null;
          bucket: string;
          headers?: Record<string, string>;
        };

        setUploadState({ status: "upload" });

        const overallBucket = data.bucket || bucketName;
        const contentTypeHeader = data.headers?.["Content-Type"] || file.type || "application/octet-stream";
        let uploadError: string | null = null;

        try {
          if (supabase) {
            const { error } = await supabase.storage
              .from(overallBucket)
              .uploadToSignedUrl(data.path, data.token, file, {
                contentType: contentTypeHeader,
              });
            if (error) {
              uploadError = error.message;
            }
          } else {
            const uploadResponse = await fetch(data.signedUrl, {
              method: "PUT",
              headers: {
                "Content-Type": contentTypeHeader,
                "x-upsert": "false",
              },
              body: file,
            });
            if (!uploadResponse.ok) {
              const uploadErrorPayload = await safeJson(uploadResponse);
              uploadError = extractErrorMessage(uploadErrorPayload, "Upload failed.");
            }
          }
        } catch (error) {
          uploadError = (error as Error).message;
        }

        if (uploadError) {
          setUploadState({ status: "error", message: uploadError });
          return;
        }

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setUploadState({ status: "success", message: "Upload complete." });
        setTimeout(() => {
          setUploadState({ status: "idle" });
        }, 2500);
        await loadMedia();
      } catch (error) {
        console.error("Upload failed", error);
        setUploadState({ status: "error", message: (error as Error).message });
      }
    },
    [bucketName, loadMedia]
  );

  const handleDelete = useCallback(
    async (path: string) => {
      const confirmed = window.confirm("Delete this file from storage? This cannot be undone.");
      if (!confirmed) {
        return;
      }

      setDeletingPath(path);
      try {
        const response = await fetch("/api/uploads", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path }),
        });

        if (!response.ok) {
          const data = await safeJson(response);
          throw new Error(extractErrorMessage(data?.error, "Failed to delete file."));
        }

        setItems((previous) => previous.filter((item) => item.path !== path));
      } catch (error) {
        console.error("Failed to delete file", error);
        alert((error as Error).message);
      } finally {
        setDeletingPath(null);
      }
    },
    []
  );

  const handleCopy = useCallback(async (path: string, url: string | null) => {
    if (!url) {
      alert(
        "No public URL available for this asset. Ensure the Supabase bucket is public or provide a CDN URL."
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2000);
    } catch (error) {
      console.error("Failed to copy URL", error);
      alert("Copy failed. Manually copy the URL above.");
    }
  }, []);

  const infoBanner = useMemo(() => {
    if (fetchState.error) {
      return (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
          {fetchState.error}
        </div>
      );
    }

    if (!configured) {
      return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
          Supabase storage isn&apos;t fully configured. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and
          SUPABASE_SERVICE_ROLE_KEY to enable uploads.
        </div>
      );
    }

    return null;
  }, [configured, fetchState.error]);

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0f1319]">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Upload new asset</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          Images upload directly to Supabase Storage. Copy the resulting URL to use as cover images across posts or
          projects.
        </p>
        <form onSubmit={handleUpload} className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
          <label className="flex items-center justify-between rounded-full border border-dashed border-neutral-300 bg-neutral-50 px-5 py-3 text-sm text-neutral-600 transition hover:border-neutral-400 dark:border-white/20 dark:bg-[#131821] dark:text-neutral-300">
            <span>{fileInputRef.current?.files?.[0]?.name ?? "Choose an image (max 10 MB)"}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              aria-label="Upload media file"
            />
          </label>
          <Button type="submit" className="justify-self-start sm:justify-self-end" disabled={uploadState.status === "request" || uploadState.status === "upload"}>
            {uploadState.status === "upload"
              ? "Uploading…"
              : uploadState.status === "request"
              ? "Starting…"
              : "Upload"}
          </Button>
        </form>
        {uploadState.status === "error" && uploadState.message ? (
          <p className="mt-3 text-sm text-rose-500">{uploadState.message}</p>
        ) : null}
        {uploadState.status === "success" && uploadState.message ? (
          <p className="mt-3 text-sm text-emerald-500">{uploadState.message}</p>
        ) : null}
      </section>

      {infoBanner}

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Library</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              {items.length > 0
                ? `Stored in ${bucketName}. Click copy to grab a CDN-safe URL.`
                : "Uploads will appear here once available."}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void loadMedia();
            }}
            disabled={fetchState.isLoading}
          >
            Refresh
          </Button>
        </div>

        {fetchState.isLoading ? (
          <LoadingGrid />
        ) : items.length === 0 ? (
          <EmptyState configured={configured} />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const updatedLabel = item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "Unknown";
              const sizeLabel = item.size ? formatBytes(item.size) : "Unknown size";
              return (
                <li
                  key={item.path}
                  className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#0f1319]"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-[#131821]">
                    {item.publicUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.publicUrl}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                        No preview available
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 px-5 py-4">
                    <div className="space-y-1.5">
                      <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-50">{item.name}</p>
                      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{item.path}</p>
                      <p className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                        <span>{sizeLabel}</span>
                        <span aria-hidden="true">•</span>
                        <span>{updatedLabel}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCopy(item.path, item.publicUrl)}
                      >
                        {copiedPath === item.path ? "Copied!" : "Copy URL"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                        disabled={deletingPath === item.path}
                        onClick={() => void handleDelete(item.path)}
                      >
                        {deletingPath === item.path ? "Deleting…" : "Delete"}
                      </Button>
                    </div>
                    {item.publicUrl ? (
                      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {item.publicUrl}
                      </p>
                    ) : (
                      <p className="text-xs text-amber-600 dark:text-amber-300">
                        Make the bucket public or define NEXT_PUBLIC_SUPABASE_CDN_URL to expose URLs.
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="animate-pulse rounded-3xl border border-neutral-200 bg-neutral-100/80 dark:border-white/10 dark:bg-white/5"
        >
          <div className="aspect-video w-full rounded-t-3xl bg-white/40" />
          <div className="space-y-2 px-5 py-4">
            <div className="h-4 w-2/3 rounded-full bg-white/60" />
            <div className="h-3 w-1/2 rounded-full bg-white/50" />
            <div className="h-3 w-1/3 rounded-full bg-white/40" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ configured }: { configured: boolean }) {
  return (
    <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500 dark:border-white/20 dark:bg-[#0f1319]">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{configured ? "No uploads yet" : "Storage disabled"}</h3>
      <p className="mt-2">
        {configured
          ? "Upload images to populate the media library."
          : "Add Supabase credentials to enable media uploads."}
      </p>
    </div>
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

function formatBytes(bytes: number) {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / Math.pow(1024, exponent);
  return `${size.toFixed(size < 10 && exponent > 0 ? 1 : 0)} ${units[exponent]}`;
}
