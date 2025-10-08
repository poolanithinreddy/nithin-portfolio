"use client";

import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(2, "Tell me your name"),
  email: z.string().email("Enter a valid email"),
  company: z.string().optional(),
  message: z.string().min(10, "Share a bit more context"),
  honeypot: z.string().max(0),
});

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>({ status: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      company: formData.get("company")?.toString() ?? "",
      message: formData.get("message")?.toString() ?? "",
      honeypot: formData.get("url")?.toString() ?? "",
    };

    const parse = contactSchema.safeParse(payload);
    if (!parse.success) {
      setErrors(
        parse.error.issues.reduce((acc, issue) => {
          if (issue.path[0]) {
            acc[issue.path[0].toString()] = issue.message;
          }
          return acc;
        }, {} as Record<string, string>)
      );
      return;
    }

    setErrors({});
    setFormState({ status: "submitting" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error ?? "Something went wrong");
      }

      setFormState({ status: "success" });
      event.currentTarget.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setFormState({ status: "error", message });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-neutral-700" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            placeholder="How should I address you?"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            placeholder="we@yourcompany.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-neutral-700" htmlFor="company">
          Company / Team
        </label>
        <input
          id="company"
          name="company"
          className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          placeholder="Where are you building?"
        />
        {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-neutral-700" htmlFor="message">
          Project details
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          placeholder="What are we shipping? Timelines, integrations, success metrics…"
        />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
      </div>
      <div className="hidden">
        <label htmlFor="url">Leave this empty</label>
        <input id="url" name="url" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={formState.status === "submitting"}>
          {formState.status === "submitting" ? "Sending…" : "Send message"}
        </Button>
        {formState.status === "success" && (
          <p className="text-sm text-neutral-500">Thanks! I’ll get back within 1 business day.</p>
        )}
        {formState.status === "error" && (
          <p className="text-sm text-red-500">{formState.message}</p>
        )}
      </div>
    </form>
  );
}
