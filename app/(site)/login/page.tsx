import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getServerAuthSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Login | Nithin Reddy Poola",
  description: "Sign in to manage posts, projects, and content for Nithin Reddy Poola's portfolio.",
};

type LoginPageProps = {
  searchParams?: {
    callbackUrl?: string;
    error?: string;
  };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerAuthSession();
  const callbackUrl = typeof searchParams?.callbackUrl === "string" ? searchParams.callbackUrl : undefined;
  const initialError = typeof searchParams?.error === "string" ? searchParams.error : null;

  if (session?.user?.email) {
    redirect(callbackUrl ?? "/admin");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-4xl flex-col items-center justify-center px-6 py-24">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
          🔒 Secure Admin Access
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Control Room
        </h1>
        <p className="mt-3 max-w-xl text-sm text-neutral-600 dark:text-neutral-300">
          Enter your credentials to access the admin dashboard. Sessions are device-specific and encrypted.
        </p>
      </div>

      <div className="mt-10 w-full max-w-sm">
        <LoginForm callbackUrl={callbackUrl} initialError={initialError} />
      </div>

      <div className="mt-8 rounded-2xl border border-blue-200/70 bg-blue-50/50 px-4 py-3 text-center dark:border-blue-900/30 dark:bg-blue-950/20">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          🛡️ <strong>Security Note:</strong> Your session will be active only on this device and browser.
          <br />
          Use the logout button to end your session when finished.
        </p>
      </div>
    </main>
  );
}
