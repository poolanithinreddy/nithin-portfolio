import { MediaManager } from "@/components/admin/media-manager";

export const dynamic = "force-dynamic";

export default function AdminMediaPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Media library</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Upload and manage image assets stored in Supabase. Copy URLs to use as cover images for posts, projects, and
          hero sections.
        </p>
      </div>
      <MediaManager />
    </section>
  );
}
