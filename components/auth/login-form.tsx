"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type FormValues = z.infer<typeof schema>;

interface LoginFormProps {
  callbackUrl?: string;
  initialError?: string | null;
}

export function LoginForm({ callbackUrl, initialError }: LoginFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (!initialError) {
      setServerError(null);
      return;
    }

    if (initialError === "CredentialsSignin") {
      setServerError("Invalid email or password.");
      return;
    }

    setServerError("Unable to sign in. Please try again.");
  }, [initialError]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: callbackUrl ?? "/admin",
    });

    if (result?.error) {
      setServerError("Invalid email or password.");
      return;
    }

    const redirectUrl = result?.url ?? callbackUrl ?? "/admin";
    if (redirectUrl.startsWith("http")) {
      window.location.href = redirectUrl;
      return;
    }

    router.push(redirectUrl as Route);
    router.refresh();
  });

  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl border border-neutral-200/70 bg-white/80 p-7 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-[#0f1319]">
      <form onSubmit={onSubmit} className="grid gap-5">
        <div className="space-y-1">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            autoComplete="email" 
            placeholder="admin@example.com" 
            {...register("email")}
            disabled={isSubmitting}
          />
          {errors.email ? (
            <p className="text-sm text-rose-500">{errors.email.message}</p>
          ) : null}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
            disabled={isSubmitting}
          />
          {errors.password ? (
            <p className="text-sm text-rose-500">{errors.password.message}</p>
          ) : null}
        </div>
        {serverError ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 dark:border-rose-900/30 dark:bg-rose-950/30">
            <p className="text-sm text-rose-600 dark:text-rose-400">{serverError}</p>
          </div>
        ) : null}
        <Button type="submit" disabled={isSubmitting} className="h-11 rounded-full">
          {isSubmitting ? "Signing in…" : "🔐 Sign in securely"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        <p className="mb-2">Forgot the credentials? Check your environment variables.</p>
        <Link href={"/" as Route} className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
