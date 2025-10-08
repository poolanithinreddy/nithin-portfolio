import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { postCreateSchema } from "@/lib/validations/post";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawBody = (await req.json().catch(() => null)) as unknown;
  if (!rawBody || typeof rawBody !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const data = rawBody as Record<string, unknown>;

  const payload = postCreateSchema.safeParse({
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt ?? undefined,
    content: data.content,
    coverImage: data.coverImage ?? undefined,
    published: typeof data.published === "boolean" ? data.published : true,
  });

  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  try {
    const { excerpt, coverImage, ...rest } = payload.data;
    const post = await prisma.post.create({
      data: {
        ...rest,
        excerpt: excerpt ?? null,
        coverImage: coverImage ?? null,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/");

    if (post.slug) {
      revalidatePath(`/blog/${post.slug}`);
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    console.error("Failed to create post", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
