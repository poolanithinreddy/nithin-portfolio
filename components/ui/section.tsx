// components/ui/section.tsx
import { cn } from "@/lib/utils";

export function Section({
  id,
  className,
  children,
}: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className={cn(
        "rounded-3xl border border-neutral-200/70 bg-white/70 p-8 shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_18px_48px_-22px_rgba(0,0,0,0.22)] backdrop-blur-md",
        "dark:border-white/10 dark:bg-[#0f1319]",
        className
      )}
    >
      {children}
    </section>
  );
}

export function Container({ children, className }:{children:React.ReactNode; className?:string}) {
  return <div className={cn("mx-auto max-w-7xl px-6", className)}>{children}</div>;
}

export function Kicker({ children }:{children:React.ReactNode}) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
      {children}
    </p>
  );
}

export function H2({ children }:{children:React.ReactNode}) {
  return (
    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
      {children}
    </h2>
  );
}
