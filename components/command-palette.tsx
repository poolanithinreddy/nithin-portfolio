"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const pages = [
  { title: "Home", href: "/" as Route, icon: "🏠" },
  { title: "Work", href: "/work" as Route, icon: "💼" },
  { title: "Blog", href: "/blog" as Route, icon: "📝" },
  { title: "About", href: "/about" as Route, icon: "👤" },
  { title: "Contact", href: "/contact" as Route, icon: "✉️" },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSelect = (href: Route) => {
    router.push(href);
    onClose();
    setSearch("");
  };

  return (
    <div className="fixed inset-0 z-50 animate-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Command Palette */}
      <div className="fixed left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/3 w-full max-w-2xl px-4">
        <Command 
          className="surface-card-elevated overflow-hidden animate-slide-up"
          shouldFilter={false}
        >
          <div className="flex items-center border-b px-4">
            <span className="text-muted-foreground mr-2">⌘K</span>
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search pages..."
              className="flex h-14 w-full bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground"
            />
          </div>
          
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            
            <Command.Group heading="Pages" className="text-xs uppercase tracking-wider text-muted-foreground px-2 py-2">
              {pages.map((page) => (
                <Command.Item
                  key={page.href}
                  value={page.title}
                  onSelect={() => handleSelect(page.href)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer",
                    "hover:bg-muted transition-colors",
                    "data-[selected=true]:bg-muted"
                  )}
                >
                  <span className="text-xl">{page.icon}</span>
                  <span className="font-medium">{page.title}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return {
    isOpen,
    setIsOpen,
    toggle: () => setIsOpen((open) => !open),
  };
}
