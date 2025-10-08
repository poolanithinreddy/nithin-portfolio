import * as React from "react";

export default function MacWindow({
  title = "",
  children,
  footer,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[28px] border backdrop-blur-md shadow-[0_22px_90px_-32px_rgba(0,0,0,0.28)]
                    border-neutral-200/70 bg-white/80 dark:border-white/10 dark:bg-[#0f1319] ${className}`}>
      <div className="flex items-center gap-2 border-b px-4 py-3 border-neutral-200/60 dark:border-white/10">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-400/90" />
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400/90" />
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
        <span className="ml-3 h-4 rounded bg-neutral-200/80 px-2 text-[10px] leading-4 text-neutral-600
                         dark:bg-neutral-800 dark:text-neutral-300">{title || "—"}</span>
        <div className="ml-auto hidden md:flex gap-2 opacity-60">
          <div className="h-3 w-20 rounded bg-neutral-200/80 dark:bg-neutral-800" />
          <div className="h-3 w-12 rounded bg-neutral-200/80 dark:bg-neutral-800" />
        </div>
      </div>
      <div className="relative p-3">
        <div className="pointer-events-none absolute inset-0 rounded-[24px]
                        bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.06),transparent_60%)]
                        dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
        {children}
      </div>
      {footer ? (
        <div className="flex items-center justify-between gap-3 border-t border-neutral-200/60 p-3 text-sm
                        text-neutral-600 dark:border-white/10 dark:text-neutral-300">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
