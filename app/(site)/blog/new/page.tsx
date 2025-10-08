"use client";

import { useState } from "react";

const initialForm = {
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  content: "",
  published: true,
};

type FormState = typeof initialForm;

export default function NewPostPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<string | null>(null);
  const [adminSecret, setAdminSecret] = useState("");

  const updateField = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function submit() {
    if (!adminSecret) {
      setStatus("Provide the admin secret before publishing.");
      return;
    }

    setStatus("Saving...");
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setStatus("Saved ✔");
      setForm(initialForm);
      return;
    }

    const message = await response.text();
    setStatus(`Failed ✖ — ${message}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">New Post</h1>
      <p className="mt-2 text-neutral-600">Draft and publish a post. Guard this route in production.</p>

      <div className="mt-8 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          Admin secret
          <input
            value={adminSecret}
            onChange={(event) => setAdminSecret(event.target.value)}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900"
            placeholder="Value of ADMIN_SECRET"
            type="password"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          Title
          <input
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900"
            placeholder="Title"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          Slug
          <input
            value={form.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900"
            placeholder="slugified-title"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          Excerpt
          <input
            value={form.excerpt}
            onChange={(event) => updateField("excerpt", event.target.value)}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900"
            placeholder="A short summary"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          Cover image URL
          <input
            value={form.coverImage}
            onChange={(event) => updateField("coverImage", event.target.value)}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900"
            placeholder="https://..."
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          Content
          <textarea
            value={form.content}
            onChange={(event) => updateField("content", event.target.value)}
            rows={12}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900"
            placeholder="Write in markdown/plain text"
            required
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-800">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(event) => updateField("published", event.target.checked)}
            className="h-4 w-4 rounded border-neutral-300"
          />
          Published
        </label>
        <button
          onClick={submit}
          className="mt-2 rounded-xl bg-black px-4 py-2 text-base font-medium text-white transition hover:bg-neutral-800"
        >
          Publish post
        </button>
        {status && <p className="text-sm text-neutral-500">{status}</p>}
      </div>
    </main>
  );
}
