import { NextResponse } from "next/server";
import { z } from "zod";

import { rateLimitByIp } from "@/lib/rateLimit";
import { sendContactEmail } from "@/lib/mailer";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  company: z.string().optional(),
  message: z.string().min(10, "Share a bit more context"),
  honeypot: z.string().optional(),
});

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "0.0.0.0";

  const rateLimit = rateLimitByIp(ip);
  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: "Too many messages. Try again in a few minutes.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation error",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  const data = parsed.data;

  if (data.honeypot) {
    return NextResponse.json({ ok: true });
  }

  try {
    await sendContactEmail({
      name: data.name,
      email: data.email,
      company: data.company,
      message: data.message,
    });
  } catch (error) {
    console.error("[contact] Failed to send email", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set({
    name: "contact-submitted",
    value: "1",
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60,
  });
  return response;
}
