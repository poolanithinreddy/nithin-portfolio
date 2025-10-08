import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardNav } from "@/components/admin/dashboard-nav";
import { getServerAuthSession } from "@/lib/auth";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Admin | Nithin Reddy Poola",
  description: "Manage posts, projects, and media for the portfolio.",
  noIndex: true,
});

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">Admin control</p>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">Command center</h1>
          </div>
          <DashboardNav />
        </div>
        <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/50 px-4 py-3 dark:border-white/10 dark:bg-[#0c1116]">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            🔐 Signed in as <span className="font-medium text-neutral-900 dark:text-neutral-50">{session.user.email}</span>
            {" • "}
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Session is device-specific and secure</span>
          </p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Changes sync instantly to the live site. Use the logout button to end this session.
          </p>
        </div>
      </header>
      <main className="flex-1 pb-24">{children}</main>
    </div>
  );
}
