import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { projectCreateSchema } from "@/lib/validations/project";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
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

  const payload = projectCreateSchema.safeParse({
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    description: data.description,
    coverImage: data.coverImage ?? undefined,
    gallery: Array.isArray(data.gallery) ? (data.gallery as unknown[]).filter((item) => typeof item === "string") : [],
    repoUrl: data.repoUrl ?? undefined,
    demoUrl: data.demoUrl ?? undefined,
    tech: Array.isArray(data.tech) ? (data.tech as unknown[]).filter((item) => typeof item === "string") : [],
    featured: typeof data.featured === "boolean" ? data.featured : false,
  });

  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  try {
    const { coverImage, demoUrl, repoUrl, ...rest } = payload.data;

    const project = await prisma.project.create({
      data: {
        ...rest,
        coverImage: coverImage ?? null,
        demoUrl: demoUrl ?? null,
        repoUrl: repoUrl ?? null,
      },
    });

    revalidatePath("/work");
    revalidatePath("/");
    revalidatePath(`/work/${project.slug}`);

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code?: string };
      if (prismaError.code === "P2002") {
        return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
      }
    }

    console.error("Failed to create project", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
