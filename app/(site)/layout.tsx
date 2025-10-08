import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        // structure
        "min-h-screen flex flex-col",
        // color & type rendering
        "bg-white text-neutral-900 dark:bg-[#0b0f14] dark:text-neutral-100",
        "antialiased [text-rendering:optimizeLegibility]",
        // user interactions (mobile polish)
        "overscroll-y-none touch-manipulation",
        // nice text selection
        "selection:bg-neutral-900/90 selection:text-white dark:selection:bg-white/20",
        // account for notches/home indicator
        "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
      ].join(" ")}
    >
      {/* Skip link – highly visible when focused */}
      <a
        href="#main-content"
        className={[
          "sr-only focus:not-sr-only",
          "focus:fixed focus:left-4 focus:top-4 z-[1000]",
          "focus:rounded-full focus:bg-neutral-900 focus:text-white",
          "focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg",
        ].join(" ")}
      >
        Skip to content
      </a>

      {/* Main content */}
      <main
        id="main-content"
        // Keep padding light here so each page can control its own container.
        className="flex-1 focus:outline-none"
        // Helps some mobile browsers avoid repaint jank on scroll
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        {children}
      </main>

      {/* Footer with safe-area breathing room on phones */}
      <div className="px-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        <SiteFooter />
      </div>
    </div>
  );
}
