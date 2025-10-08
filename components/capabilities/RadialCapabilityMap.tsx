"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Code2,
  Database,
  Cloud,
  Smartphone,
  Gauge,
  Shield,
  Cpu,
  Layers,
} from "lucide-react";

type Capability = {
  id: string;
  name: string;
  icon: JSX.Element;
  level: number; // 1–10
  why: string;
  tech: string[];
};

const CAPS: Capability[] = [
  {
    id: "frontend",
    name: "Frontend",
    icon: <Code2 className="h-6 w-6" />,
    level: 9,
    why:
      "Component-driven architecture with accessibility and performance as first-class concerns. Love building interfaces that feel native.",
    tech: ["React", "Next.js", "TypeScript", "Tailwind"],
  },
  {
    id: "backend",
    name: "Backend",
    icon: <Cpu className="h-6 w-6" />,
    level: 9,
    why:
      "Event-driven systems, API design, and resilient architectures. Focus on observability and graceful degradation.",
    tech: ["Node.js", "Python", "Go", "REST/GraphQL"],
  },
  {
    id: "database",
    name: "Data",
    icon: <Database className="h-6 w-6" />,
    level: 8,
    why:
      "Schema design for scale. Understand when to use SQL vs NoSQL, caching strategies, and data consistency patterns.",
    tech: ["PostgreSQL", "MongoDB", "Redis", "Prisma"],
  },
  {
    id: "cloud",
    name: "Cloud",
    icon: <Cloud className="h-6 w-6" />,
    level: 8,
    why:
      "Infrastructure as code, containerization, and CI/CD pipelines. Prefer serverless for rapid iteration.",
    tech: ["AWS", "Vercel", "Docker", "GitHub Actions"],
  },
  {
    id: "mobile",
    name: "Mobile",
    icon: <Smartphone className="h-6 w-6" />,
    level: 7,
    why:
      "Cross-platform with React Native. Focus on offline-first patterns and native feel through gesture handling.",
    tech: ["React Native", "Expo", "iOS/Android"],
  },
  {
    id: "performance",
    name: "Performance",
    icon: <Gauge className="h-6 w-6" />,
    level: 9,
    why:
      "Obsessed with Core Web Vitals. Profile everything, optimize the critical path, measure real user experience.",
    tech: ["Lighthouse", "Web Vitals", "CDN", "Code Splitting"],
  },
  {
    id: "security",
    name: "Security",
    icon: <Shield className="h-6 w-6" />,
    level: 8,
    why:
      "Defense in depth. OWASP Top 10, secure auth flows, secret management, and regular dependency audits.",
    tech: ["OAuth", "JWT", "HTTPS", "CSP"],
  },
  {
    id: "architecture",
    name: "Architecture",
    icon: <Layers className="h-6 w-6" />,
    level: 9,
    why:
      "System design for scale and maintainability. Document decisions (ADRs), design for failure, embrace constraints.",
    tech: ["Microservices", "Event-Driven", "DDD", "ADRs"],
  },
];

export function RadialCapabilityMap() {
  // Keep one selected at all times to avoid placeholder jumps
  const [activeId, setActiveId] = useState<string>("frontend");

  // Debounce hover to stop “shaking” when moving across nodes quickly
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onHover = (id: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setActiveId(id), 80);
  };
  const cancelHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  // Responsive radius computed from container size (no hardcoded padding)
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [ringRadius, setRingRadius] = useState(140); // sensible default
  const NODE_DIAMETER = 80; // button size in px (w/h)
  useEffect(() => {
    if (!ringRef.current) return;
    const el = ringRef.current;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      // radius: half of the smaller side, minus node size + comfy margin
      const r = Math.max(
        90,
        Math.floor(Math.min(w, h) / 2 - NODE_DIAMETER / 2 - 12)
      );
      setRingRadius(r);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const active = CAPS.find((c) => c.id === activeId)!;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-12">
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Technical Capabilities
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mt-2 text-sm sm:text-base">
          Hover or tap a node to see philosophy and preferred tools
        </p>
      </div>

      {/* Layout: ring left (md+) / top (mobile), panel right/below */}
      <div className="grid gap-8 md:grid-cols-[minmax(280px,420px),1fr] items-start">
        {/* Ring */}
        <div
          ref={ringRef}
          className="relative mx-auto aspect-square w-full max-w-sm select-none"
          role="tablist"
          aria-label="Capabilities"
        >
          {/* Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass w-24 h-24 rounded-full flex items-center justify-center shadow-lg z-10 inner-glow border border-neutral-200 dark:border-neutral-700">
              <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Full Stack
              </span>
            </div>
          </div>

          {/* Nodes */}
          {CAPS.map((cap, i) => {
            const angle = (i / CAPS.length) * 2 * Math.PI; // radians
            const x = Math.cos(angle - Math.PI / 2) * ringRadius;
            const y = Math.sin(angle - Math.PI / 2) * ringRadius;
            const isActive = activeId === cap.id;

            return (
              <div
                key={cap.id}
                className="absolute top-1/2 left-1/2 will-change-transform"
                style={{
                  transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0)`,
                }}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`cap-panel-${cap.id}`}
                  onMouseEnter={() => onHover(cap.id)}
                  onMouseLeave={cancelHover}
                  onFocus={() => setActiveId(cap.id)}
                  onClick={() => setActiveId(cap.id)}
                  className={[
                    "w-20 h-20 rounded-full flex flex-col items-center justify-center gap-1",
                    "bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700",
                    "shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60",
                    "transition-[transform,box-shadow,background-color,color,border-color] duration-200",
                    isActive
                      ? "ring-2 ring-emerald-500/70 shadow-xl scale-[1.06]"
                      : "ring-0",
                    isReducedMotion ? "transition-none" : "",
                  ].join(" ")}
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transformOrigin: "center",
                  }}
                >
                  <div
                    className={[
                      "transition-colors duration-200",
                      isActive
                        ? "text-neutral-900 dark:text-neutral-100"
                        : "text-neutral-700 dark:text-neutral-400",
                      isReducedMotion ? "transition-none" : "",
                    ].join(" ")}
                  >
                    {cap.icon}
                  </div>
                  <span
                    className={[
                      "text-xs font-semibold transition-colors duration-200",
                      isActive
                        ? "text-neutral-900 dark:text-neutral-100"
                        : "text-neutral-800 dark:text-neutral-300",
                      isReducedMotion ? "transition-none" : "",
                    ].join(" ")}
                  >
                    {cap.name}
                  </span>

                  {/* 3-dot proficiency summary */}
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(3)].map((_, idx) => {
                      const filled = idx < Math.ceil(cap.level / 3.5);
                      return (
                        <span
                          key={idx}
                          className={[
                            "block w-1 h-1 rounded-full",
                            filled
                              ? isActive
                                ? "bg-emerald-500"
                                : "bg-neutral-500 dark:bg-neutral-400"
                              : "bg-neutral-300 dark:bg-neutral-700",
                          ].join(" ")}
                        />
                      );
                    })}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Panel */}
        <div className="w-full" id={`cap-panel-${active.id}`} role="tabpanel" aria-live="polite">
          <div className="glass p-6 sm:p-8 radius-lg w-full inner-glow border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-neutral-900 dark:bg-white/10 text-white dark:text-neutral-100 shadow-md">
                {active.icon}
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {active.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <span
                        key={i}
                        className={["w-2 h-2 rounded-full", i < active.level ? "bg-emerald-500" : "bg-neutral-300 dark:bg-neutral-700"].join(" ")}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-mono text-neutral-700 dark:text-neutral-400">
                    {active.level}/10
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
                  Why I prefer this
                </p>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {active.why}
                </p>
              </div>

              <div>
                <p className="text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
                  Core Tools
                </p>
                <div className="flex flex-wrap gap-2">
                  {active.tech.map((t) => (
                    <span key={t} className="chip text-[11px] sm:text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </div>
  );
}
