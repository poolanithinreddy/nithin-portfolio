"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { LogOut } from "lucide-react";

const links: Array<{ href: Route; label: string }> = [
  { href: "/admin" as Route, label: "Overview" },
  { href: "/admin/posts" as Route, label: "Posts" },
  { href: "/admin/projects" as Route, label: "Projects" },
  { href: "/admin/media" as Route, label: "Media" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: "/login"
      });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              active
                ? "bg-neutral-900 text-white shadow dark:bg-white dark:text-neutral-900"
                : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-white/10 dark:bg-[#0f1319] dark:text-neutral-200 dark:hover:bg-[#161c24]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 dark:border-rose-900/30 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
        title="Sign out"
      >
        <LogOut className="h-3.5 w-3.5" />
        {isLoggingOut ? "Signing out..." : "Logout"}
      </button>
    </nav>
  );
}
