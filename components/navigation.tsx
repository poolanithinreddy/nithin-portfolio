"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import type { Route } from "next";
import { cn } from "@/lib/utils";

const NAV: Array<{ name: string; href: Route }> = [
  { name: "Work", href: "/work" as Route },
  { name: "Blog", href: "/blog" as Route },
  { name: "About", href: "/about" as Route },
  { name: "Contact", href: "/contact" as Route },
];

export function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // scroll-aware chrome (hide on down, show on up)
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  // mobile menu
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  // lock body scroll when menu open
  useEffect(() => {
    if (!mounted) return;
    const body = document.body;
    if (open) {
      const prev = body.style.overflow;
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = prev;
      };
    }
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 16);
      const goingUp = y < lastY.current;
      const nearTop = y < 96;
      setVisible(goingUp || nearTop);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  // close menu on route changes
  useEffect(() => {
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!mounted) return null;

  const isDark = (theme ?? resolvedTheme) === "dark";

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 z-50 transition-transform duration-500 will-change-transform",
        "pt-[env(safe-area-inset-top)]",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
      aria-label="Primary"
    >
      <div className="container-wide px-4">
        <div
          className={cn(
            "mt-3 flex h-14 sm:h-16 items-center justify-between rounded-2xl px-3 sm:px-4",
            "backdrop-blur supports-[backdrop-filter]:bg-neutral-900/0",
            scrolled ? "glass-card shadow-lg" : "bg-transparent"
          )}
        >
          {/* Brand */}
          <Link
            href={"/" as Route}
            className="text-xl sm:text-2xl font-extrabold tracking-tight text-gradient focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 rounded-lg px-1"
            aria-label="Home"
          >
            NR
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1.5">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                    "hover:bg-neutral-950/5 dark:hover:bg-white/10",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60",
                    active
                      ? "text-accent-a bg-neutral-950/5 dark:bg-white/10"
                      : "text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* theme toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="ml-1 p-2.5 rounded-xl hover:bg-neutral-950/5 dark:hover:bg-white/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* CTA — perfectly vertically centered */}
            <Link
              href={"/contact" as Route}
              className={cn(
                "ml-2 inline-flex items-center justify-center rounded-xl",
                "h-10 sm:h-11 px-5 text-sm font-semibold leading-none",
                "btn-primary min-w-[118px]" // width so text doesn’t jiggle
              )}
            >
              Let&apos;s Talk
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2.5 rounded-xl hover:bg-neutral-950/5 dark:hover:bg-white/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setOpen((v) => !v)}
              className="p-2.5 rounded-xl hover:bg-neutral-950/5 dark:hover:bg-white/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        className={cn(
          "md:hidden fixed inset-x-0 top-[4.25rem] sm:top-[4.75rem] z-40 origin-top",
          "px-4",
          open
            ? "pointer-events-auto opacity-100 scale-100"
            : "pointer-events-none opacity-0 -translate-y-2",
          "transition-[opacity,transform] duration-200"
        )}
      >
        {/* overlay */}
        <div
          className={cn(
            "fixed inset-0 -z-10",
            open ? "opacity-100" : "opacity-0",
            "bg-black/30 backdrop-blur-sm transition-opacity duration-200"
          )}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <div className="glass-card shadow-xl rounded-2xl p-3.5">
          <div className="flex flex-col">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl text-base font-semibold transition-colors",
                    "hover:bg-neutral-950/5 dark:hover:bg-white/10",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60",
                    active
                      ? "text-accent-a bg-neutral-950/5 dark:bg-white/10"
                      : "text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link
              href={"/contact" as Route}
              className={cn(
                "mt-2 w-full justify-center inline-flex items-center rounded-xl",
                "h-12 px-5 text-base font-semibold leading-none",
                "btn-primary"
              )}
            >
              Let&apos;s Talk
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
