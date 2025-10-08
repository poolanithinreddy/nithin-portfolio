import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { projectPatchSchema } from "@/lib/validations/project";

interface RouteContext {
  params: { slug: string };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(project);
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

  const data = rawBody as Record<string, unknown>;

  const payload = projectPatchSchema.safeParse({
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    description: data.description,
    coverImage: data.coverImage ?? undefined,
    repoUrl: data.repoUrl ?? undefined,
    demoUrl: data.demoUrl ?? undefined,
    gallery: Array.isArray(data.gallery) ? (data.gallery as unknown[]).filter((item) => typeof item === "string") : undefined,
    tech: Array.isArray(data.tech) ? (data.tech as unknown[]).filter((item) => typeof item === "string") : undefined,
    featured: data.featured,
  });

  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  try {
    const { coverImage, demoUrl, repoUrl, ...rest } = payload.data;
    const updateData: Record<string, unknown> = { ...rest };

    if (coverImage !== undefined) {
      updateData.coverImage = coverImage;
    }
    if (demoUrl !== undefined) {
      updateData.demoUrl = demoUrl;
    }
    if (repoUrl !== undefined) {
      updateData.repoUrl = repoUrl;
    }

    const project = await prisma.project.update({
      where: { slug: params.slug },
      data: updateData,
    });

  revalidatePath("/work");
  revalidatePath("/");
  revalidatePath(`/work/${params.slug}`);

    return NextResponse.json(project);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code?: string };
      if (prismaError.code === "P2025") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      if (prismaError.code === "P2002") {
        return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
      }
    }

    console.error("Failed to update project", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.project.delete({
      where: { slug: params.slug },
    });

    revalidatePath("/work");
    revalidatePath(`/work/${params.slug}`);
    revalidatePath("/");

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code?: string };
      if (prismaError.code === "P2025") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    }

    console.error("Failed to delete project", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
