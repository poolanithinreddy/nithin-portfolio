import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { postPatchSchema } from "@/lib/validations/post";

interface RouteContext {
  params: { slug: string };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawBody = (await req.json().catch(() => null)) as unknown;
  if (!rawBody || typeof rawBody !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const dataRecord = rawBody as Record<string, unknown>;

  const payload = postPatchSchema.safeParse({
    title: dataRecord.title,
    slug: dataRecord.slug,
    excerpt: dataRecord.excerpt ?? undefined,
    content: dataRecord.content,
    coverImage: dataRecord.coverImage ?? undefined,
    published: dataRecord.published,
  });

  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  try {
    const { excerpt, coverImage, ...rest } = payload.data;
    const updateData: Record<string, unknown> = { ...rest };

    if (excerpt !== undefined) {
      updateData.excerpt = excerpt;
    }

    if (coverImage !== undefined) {
      updateData.coverImage = coverImage;
    }

    const post = await prisma.post.update({
      where: { slug: params.slug },
      data: updateData,
    });

    if (payload.data.slug && payload.data.slug !== params.slug) {
      revalidatePath(`/blog/${params.slug}`);
      revalidatePath(`/blog/${payload.data.slug}`);
    } else {
      revalidatePath(`/blog/${params.slug}`);
    }
    revalidatePath("/blog");
    revalidatePath("/");

    return NextResponse.json(post);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    console.error("Failed to update post", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.post.delete({
      where: { slug: params.slug },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${params.slug}`);
    revalidatePath("/");

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.error("Failed to delete post", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
