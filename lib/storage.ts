import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

import { slugify } from "@/lib/utils";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const bucketName =
  process.env.SUPABASE_STORAGE_BUCKET?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() ||
  "portfolio-media";
const SIGNED_UPLOAD_TTL_SECONDS = 7200;
const cdnBase = process.env.NEXT_PUBLIC_SUPABASE_CDN_URL?.replace(/\/$/, "");

export type StoredMediaObject = {
  path: string;
  name: string;
  bucket: string;
  size: number | null;
  mimeType: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  lastAccessedAt: string | null;
  publicUrl: string | null;
};

export class SupabaseConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseConfigurationError";
  }
}

function assertStorageConfigured() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new SupabaseConfigurationError(
      "Supabase storage is not fully configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
}

function getSupabaseAdminClient(): SupabaseClient {
  assertStorageConfigured();
  return createClient(supabaseUrl!, serviceRoleKey!, {
    auth: {
      persistSession: false,
    },
  });
}

function buildPublicBaseUrl(): string | null {
  if (!bucketName) {
    return null;
  }

  if (cdnBase) {
    return `${cdnBase}/${bucketName}`;
  }

  if (!supabaseUrl) {
    return null;
  }

  const sanitizedUrl = supabaseUrl.replace(/\/$/, "");
  return `${sanitizedUrl}/storage/v1/object/public/${bucketName}`;
}

const publicBaseUrl = buildPublicBaseUrl();

function buildPublicUrl(path: string): string | null {
  if (!publicBaseUrl) {
    return null;
  }

  const safePath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${publicBaseUrl}/${safePath}`;
}

function sanitiseFileName(fileName: string) {
  const trimmed = fileName.trim();
  const lastDot = trimmed.lastIndexOf(".");
  const hasExtension = lastDot > 0;
  const extension = hasExtension ? trimmed.slice(lastDot + 1).toLowerCase() : "";
  const rawBase = hasExtension ? trimmed.slice(0, lastDot) : trimmed;
  const slug = slugify(rawBase) || "asset";
  return `${randomUUID()}-${slug}${extension ? `.${extension}` : ""}`;
}

type SignedUploadPayload = {
  fileName: string;
  contentType: string;
};

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(supabaseUrl && serviceRoleKey);
}

export function getStorageBucketName(): string {
  return bucketName;
}

export async function createSignedUploadUrl({ fileName, contentType }: SignedUploadPayload) {
  const adminClient = getSupabaseAdminClient();
  const objectKey = sanitiseFileName(fileName);

  const { data, error } = await adminClient.storage
    .from(bucketName)
    .createSignedUploadUrl(objectKey, { upsert: false });

  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? "Failed to create signed upload URL");
  }

  return {
    bucket: bucketName,
    path: objectKey,
    signedUrl: data.signedUrl,
    token: data.token,
    expiresIn: SIGNED_UPLOAD_TTL_SECONDS,
    publicUrl: buildPublicUrl(objectKey),
    headers: {
      "Content-Type": contentType,
    },
  };
}

async function listRecursive(client: SupabaseClient, prefix: string): Promise<StoredMediaObject[]> {
  const { data, error } = await client.storage.from(bucketName).list(prefix, {
    limit: 1000,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    throw new Error(error.message);
  }

  const files: StoredMediaObject[] = [];

  for (const entry of data ?? []) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (!entry) {
      continue;
    }

    if (entry.metadata) {
      files.push({
        path,
        name: entry.name,
        bucket: bucketName,
        size: entry.metadata.size ?? null,
        mimeType: entry.metadata.mimetype ?? null,
        createdAt: entry.created_at ?? null,
        updatedAt: entry.updated_at ?? null,
        lastAccessedAt: entry.last_accessed_at ?? null,
        publicUrl: buildPublicUrl(path),
      });
    } else {
      const nested = await listRecursive(client, path);
      files.push(...nested);
    }
  }

  return files;
}

export async function listMediaFiles(): Promise<StoredMediaObject[]> {
  const adminClient = getSupabaseAdminClient();
  const results = await listRecursive(adminClient, "");

  return results.sort((a, b) => {
    const aTime = a.updatedAt ? Date.parse(a.updatedAt) : 0;
    const bTime = b.updatedAt ? Date.parse(b.updatedAt) : 0;
    return bTime - aTime;
  });
}

export async function deleteMediaObject(path: string): Promise<void> {
  const adminClient = getSupabaseAdminClient();
  const { error } = await adminClient.storage.from(bucketName).remove([path]);

  if (error) {
    throw new Error(error.message);
  }
}
