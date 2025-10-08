"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Code2, Hammer, Shield, X, Clipboard } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const workPhases = [
  {
    id: "discovery",
    title: "Discovery",
    icon: <Search className="w-6 h-6" />,
    principle: "Understand the problem before writing code",
    artifact: {
      type: "Miro Board",
      preview:
        "System context diagram with stakeholders, constraints, and success metrics mapped",
    },
  },
  {
    id: "architecture",
    title: "Architecture",
    icon: <Code2 className="w-6 h-6" />,
    principle: "Design for change, not perfection",
    artifact: {
      type: "ADR",
      preview:
        "Architectural Decision Record documenting tech choices and trade-offs",
    },
  },
  {
    id: "build",
    title: "Build",
    icon: <Hammer className="w-6 h-6" />,
    principle: "Ship incrementally with production guardrails",
    artifact: {
      type: "PR Template",
      preview:
        "Feature flags, rollback plan, and monitoring queries included in every deploy",
    },
  },
  {
    id: "hardening",
    title: "Hardening",
    icon: <Shield className="w-6 h-6" />,
    principle: "Validate under realistic load before launch",
    artifact: {
      type: "Load Test",
      preview:
        "K6 scripts simulating peak traffic with p95 latency and error rate thresholds",
    },
  },
];

const sampleADR = `# ADR 001: Use Server Components for Dynamic Content

## Context
Need to render user-specific dashboards with real-time data while maintaining fast page loads.

## Decision
Use React Server Components (RSC) with selective client components for interactivity.

## Rationale
- **Performance**: RSC reduces client bundle by ~40% (180KB → 108KB)
- **SEO**: Server-rendered content improves crawlability
- **DX**: Simplified data fetching with async/await in components
- **Cost**: Reduced CDN egress by streaming HTML instead of JSON

## Consequences
### Positive
✓ First Contentful Paint improved from 1.8s → 0.9s  
✓ Lighthouse score: 92 → 98  
✓ Reduced API calls by 60%

### Negative
× Requires Next.js 13+ (migration needed)  
× Some third-party libraries need client wrapper  
× Learning curve for team (2-week ramp-up)

## Alternatives Considered
1. **Client-side fetching** - Rejected due to slow TTI
2. **Static + ISR** - Doesn't support real-time updates
3. **SSR only** - Higher server costs at scale

## References
- Next.js RSC Docs
- Benchmark: /docs/performance-2024-q1.md

---
**Status**: Accepted | **Date**: 2024-03-15 | **Author**: @poolanithinreddy
`;

export function HowIWork() {
  const [showADR, setShowADR] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusable = useRef<HTMLButtonElement>(null);
  const lastFocusable = useRef<HTMLButtonElement>(null);

  // Body scroll lock while modal is open
  useEffect(() => {
    if (!showADR) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showADR]);

  // Focus trap + ESC to close
  useEffect(() => {
    if (!showADR) return;
    firstFocusable.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowADR(false);
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          (last as HTMLElement).focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          (first as HTMLElement).focus();
          e.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showADR]);

  const copyADR = async () => {
    await navigator.clipboard.writeText(sampleADR);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <>
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-accent-a/5 to-transparent" />
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              <span className="block">How I</span>
              <span className="block text-gradient">Work</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A structured approach from discovery to deployment, with artifacts at every stage
            </p>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute left-1/2 top-10 -translate-x-1/2 w-[72%] h-[2px] bg-gradient-to-r from-transparent via-neutral-200/60 dark:via-neutral-800/60 to-transparent" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {workPhases.map((phase, i) => (
              <article
                key={phase.id}
                className="group relative focus-within:ring-2 focus-within:ring-emerald-500/50 rounded-2xl outline-none"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-a/10 to-accent-c/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative h-full rounded-2xl glass-card border border-neutral-200/50 dark:border-neutral-800/50 p-6 transition-all duration-300 group-hover:border-accent-a/40 group-hover:shadow-lg">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent-a mb-3">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent-a" />
                    Phase {i + 1}
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-a/10 to-accent-c/10 flex items-center justify-center mb-4 text-accent-a ring-1 ring-accent-a/20">
                    {phase.icon}
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    {phase.title}
                  </h3>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5 leading-relaxed">
                    {phase.principle}
                  </p>

                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="text-[11px] font-semibold text-neutral-500 mb-1">Artifact</div>
                    <div className="text-xs font-mono text-neutral-700 dark:text-neutral-300">
                      {phase.artifact.type}
                    </div>
                    <p className="mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2">
                      {phase.artifact.preview}
                    </p>
                  </div>

                  <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-accent-a/20 transition-all" />
                </div>
              </article>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowADR(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent-a to-accent-c text-white font-semibold shadow-md hover:shadow-lg hover:shadow-accent-a/25 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              aria-haspopup="dialog"
              aria-controls="adr-modal"
            >
              <Code2 className="w-4 h-4" />
              See a sample ADR
            </button>
          </div>
        </div>
      </section>

      {/* ADR Modal (Markdown-rendered) */}
      {showADR && (
        <div
          id="adr-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Sample ADR"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in duration-200"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowADR(false);
          }}
        >
          <div
            ref={dialogRef}
            className="relative w-full max-w-3xl max-h-[80vh] overflow-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl motion-safe:animate-in motion-safe:zoom-in-95 duration-300"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Sample ADR
              </h3>
              <div className="flex items-center gap-2">
                <button
                  ref={firstFocusable}
                  onClick={copyADR}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200/80 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                >
                  <Clipboard className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => setShowADR(false)}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                  aria-label="Close"
                  ref={lastFocusable}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content (Markdown -> styled HTML) */}
            <div className="p-4 sm:p-6">
              <article
                className={[
                  "prose max-w-none",
                  "prose-neutral dark:prose-invert",
                  "prose-headings:font-bold",
                  "prose-h1:text-2xl prose-h2:text-lg",
                  "prose-h2:mt-6 prose-h2:mb-3",
                  "prose-p:leading-relaxed prose-p:text-neutral-700 dark:prose-p:text-neutral-300",
                  "prose-strong:text-neutral-900 dark:prose-strong:text-neutral-100",
                  "prose-code:text-fuchsia-600 dark:prose-code:text-fuchsia-300 prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
                  "prose-ul:my-3 prose-ol:my-3 marker:text-neutral-400 dark:marker:text-neutral-500",
                ].join(" ")}
              >
                {/* @ts-expect-error - remark-gfm type compatibility issue */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{sampleADR}</ReactMarkdown>
              </article>

              <p className="mt-4 text-[11px] text-neutral-500 dark:text-neutral-400 text-center">
                Tip: press{" "}
                <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  Esc
                </kbd>{" "}
                to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
