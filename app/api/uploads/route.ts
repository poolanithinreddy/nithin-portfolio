import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import {
  SupabaseConfigurationError,
  createSignedUploadUrl,
  deleteMediaObject,
  isSupabaseStorageConfigured,
  listMediaFiles,
} from "@/lib/storage";
import { uploadDeleteSchema, uploadRequestSchema } from "@/lib/validations/upload";

async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseStorageConfigured()) {
    return NextResponse.json({ configured: false, files: [] });
  }

  try {
    const files = await listMediaFiles();
    return NextResponse.json({ configured: true, files });
  } catch (error) {
    console.error("Failed to list Supabase media", error);
    return NextResponse.json({ error: "Failed to list media assets." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawBody = (await req.json().catch(() => null)) as unknown;
  if (!rawBody || typeof rawBody !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = uploadRequestSchema.safeParse(rawBody);
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  if (!isSupabaseStorageConfigured()) {
    return NextResponse.json({ error: "Supabase storage is not configured." }, { status: 500 });
  }

  try {
    const { fileName, contentType } = payload.data;
    const signedUpload = await createSignedUploadUrl({ fileName, contentType });
    return NextResponse.json({ configured: true, ...signedUpload });
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.error("Failed to create signed upload URL", error);
    return NextResponse.json({ error: "Failed to start upload." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawBody = (await req.json().catch(() => null)) as unknown;
  if (!rawBody || typeof rawBody !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = uploadDeleteSchema.safeParse(rawBody);
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  if (!isSupabaseStorageConfigured()) {
    return NextResponse.json({ error: "Supabase storage is not configured." }, { status: 500 });
  }

  try {
    await deleteMediaObject(payload.data.path);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.error("Failed to delete media object", error);
    return NextResponse.json({ error: "Failed to delete media object." }, { status: 500 });
  }
}
