"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const items: TocItem[] = Array.from(elements).map((element) => ({
      id: element.id,
      text: element.textContent || "",
      level: parseInt(element.tagName.substring(1)),
    }));

    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 hidden lg:block">
      <div className="surface-card p-6 max-w-xs">
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Table of Contents
        </h4>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
            >
              <a
                href={`#${heading.id}`}
                className={`block py-1 transition-colors hover:text-accent-a ${
                  activeId === heading.id
                    ? "text-accent-a font-medium"
                    : "text-muted-foreground"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                {heading.text}
              </a>
              {activeId === heading.id && (
                <motion.div
                  layoutId="activeHeading"
                  className="absolute left-0 w-0.5 h-6 bg-accent-a -ml-6"
                  initial={false}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export function FloatingToc() {
  const [isOpen, setIsOpen] = useState(false);
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const items: TocItem[] = Array.from(elements).map((element) => ({
      id: element.id,
      text: element.textContent || "",
      level: parseInt(element.tagName.substring(1)),
    }));

    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-8 z-40 lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="surface-card p-3 rounded-full shadow-lg backdrop-blur-xl hover:shadow-glow transition-all duration-200"
        aria-label="Toggle table of contents"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-16 left-0 surface-card p-6 rounded-lg shadow-xl backdrop-blur-xl max-h-96 overflow-y-auto min-w-64"
        >
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Table of Contents
          </h4>
          <ul className="space-y-2 text-sm">
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
              >
                <a
                  href={`#${heading.id}`}
                  className={`block py-1 transition-colors hover:text-accent-a ${
                    activeId === heading.id
                      ? "text-accent-a font-medium"
                      : "text-muted-foreground"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
