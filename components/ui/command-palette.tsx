"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Briefcase, Mail, X } from "lucide-react";

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const commands: Command[] = [
    {
      id: "work",
      label: "View Projects",
      icon: <Briefcase className="w-4 h-4" />,
      action: () => router.push("/work"),
      keywords: ["work", "projects", "portfolio", "case studies"]
    },
    {
      id: "blog",
      label: "Read Blog",
      icon: <FileText className="w-4 h-4" />,
      action: () => router.push("/blog"),
      keywords: ["blog", "articles", "writing", "posts"]
    },
    {
      id: "contact",
      label: "Get in Touch",
      icon: <Mail className="w-4 h-4" />,
      action: () => router.push("/contact"),
      keywords: ["contact", "email", "hire", "reach out"]
    },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.keywords.some(kw => kw.includes(search.toLowerCase()))
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
            autoFocus
          />
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Commands List */}
        <div className="p-2 max-h-[400px] overflow-auto">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  setOpen(false);
                  setSearch("");
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
              >
                <div className="flex-shrink-0 text-neutral-600 dark:text-neutral-400">
                  {cmd.icon}
                </div>
                <span className="flex-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {cmd.label}
                </span>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-neutral-500">
              No commands found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>Press ⌘K to toggle</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
