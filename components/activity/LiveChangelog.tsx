"use client";

import {
  Activity,
  GitCommit,
  FileText,
  Rocket,
  Coffee,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

/** TYPES */
type Kind = "deploy" | "blog" | "commit" | "update";

export interface ChangelogItem {
  id: string;
  type: Kind;
  message: string;
  timestamp: Date | string; // ISO ok
  icon?: React.ReactNode;
}

type Props = {
  items?: ChangelogItem[];
  rotateMs?: number; // time per item (default 4000ms)
  startPaused?: boolean; // default false
  className?: string; // optional wrapper classes
};

/** UTIL */
const TYPE_STYLES: Record<Kind, { text: string; bg: string }> = {
  deploy: { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  blog:   { text: "text-blue-600 dark:text-blue-400",       bg: "bg-blue-500/10" },
  commit: { text: "text-purple-600 dark:text-purple-400",   bg: "bg-purple-500/10" },
  update: { text: "text-orange-600 dark:text-orange-400",   bg: "bg-orange-500/10" },
};

const fallbackIcon = (t: Kind) =>
  t === "deploy" ? <Rocket className="h-4 w-4" /> :
  t === "blog"   ? <FileText className="h-4 w-4" /> :
  t === "commit" ? <GitCommit className="h-4 w-4" /> :
                   <Activity className="h-4 w-4" />;

const toDate = (d: Date | string) => (d instanceof Date ? d : new Date(d));
const isValidDate = (d: Date) => !Number.isNaN(d.getTime());

const relativeTime = (ts: Date): string => {
  if (!isValidDate(ts)) return "—";
  const diffMs = Date.now() - ts.getTime();
  if (diffMs < 0) return "just now";
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

/** DEMO DATA (only if no props.items) */
const now = Date.now();
const d = (h: number) => new Date(now - h * 60 * 60 * 1000);
const DEMO: ChangelogItem[] = [
  { id: "1", type: "deploy", message: "Deployed v2.4.0 to production",         timestamp: d(2),  icon: <Rocket className="h-4 w-4" /> },
  { id: "2", type: "blog",   message: "Published: Building Resilient Systems",  timestamp: d(5),  icon: <FileText className="h-4 w-4" /> },
  { id: "3", type: "commit", message: "Optimized DB queries (−40% latency)",    timestamp: d(8),  icon: <GitCommit className="h-4 w-4" /> },
  { id: "4", type: "update", message: "Added new project: Fintech Dashboard",   timestamp: d(24), icon: <Activity className="h-4 w-4" /> },
  { id: "5", type: "deploy", message: "Perf rollout v2.3.8",                    timestamp: d(36), icon: <Rocket className="h-4 w-4" /> },
  { id: "6", type: "blog",   message: "Published: API Design Patterns",         timestamp: d(72), icon: <FileText className="h-4 w-4" /> },
];

/** COMPONENT */
export function LiveChangelog({
  items: raw = DEMO,
  rotateMs = 4000,
  startPaused = false,
  className = "",
}: Props) {
  /** Normalize + guard */
  const items = useMemo(() => {
    const list = (raw ?? []).map((it) => {
      const ts = toDate(it.timestamp);
      return {
        ...it,
        timestamp: isValidDate(ts) ? ts : new Date(),
        icon: it.icon ?? fallbackIcon(it.type),
      };
    });
    return list.length ? list : DEMO;
  }, [raw]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(startPaused);
  const [progress, setProgress] = useState(0); // 0..100

  /** Reduced motion */
  const isReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  /** Auto-advance via RAF for butter-smooth progress */
  const rafRef = useRef<number | null>(null);
  const t0Ref = useRef<number>(0);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % items.length),
    [items.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + items.length) % items.length),
    [items.length]
  );

  // Reset progress when index changes or we unpause
  useEffect(() => {
    setProgress(0);
    t0Ref.current = performance.now();
  }, [index, paused, rotateMs]);

  useEffect(() => {
    if (paused || isReducedMotion) return;

    const loop = (t: number) => {
      if (!t0Ref.current) t0Ref.current = t;
      const elapsed = t - t0Ref.current;
      const pct = Math.min(100, (elapsed / rotateMs) * 100);
      setProgress(pct);
      if (pct >= 100) {
        t0Ref.current = t; // reset baseline for next slide
        next();
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [paused, isReducedMotion, rotateMs, next]);

  /** Pause when tab hidden; resume only if user hadn’t paused */
  const pausedByTabRef = useRef(false);
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        if (!paused) {
          pausedByTabRef.current = true;
          setPaused(true);
        }
      } else if (pausedByTabRef.current) {
        setPaused(false);
        pausedByTabRef.current = false;
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [paused]);

  /** Keep relative timestamps fresh every minute */
  const [, rerenderTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => rerenderTick((x) => x + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  /** Keyboard + swipe */
  const tickerRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault(); setPaused(true); next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault(); setPaused(true); prev();
    } else if (e.key === " ") {
      e.preventDefault(); setPaused((p) => !p);
    }
  };

  // Simple touch swipe
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 42) {
      setPaused(true);
      if (dx < 0) {
        next();
      } else {
        prev();
      }
    }
    touchStartX.current = null;
  };

  /** Derivatives */
  const current = items[index];
  const styles = TYPE_STYLES[current.type];

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="relative">
            <Activity className="h-5 w-5 text-emerald-500" />
            {!isReducedMotion && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Activity Feed
          </h3>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Real-time updates • Always shipping
        </p>
      </div>

      {/* Main ticker */}
      <div
        className="glass p-5 sm:p-6 radius-lg inner-glow max-w-2xl mx-auto"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setPaused(true); prev(); }}
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              aria-label="Previous update"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              aria-label={paused ? "Play rotation" : "Pause rotation"}
            >
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => { setPaused(true); next(); }}
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              aria-label="Next update"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => { setPaused(true); setIndex(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 bg-neutral-900 dark:bg-neutral-100"
                    : "w-1.5 bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500"
                }`}
                aria-label={`Go to update ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Card (keyboard & swipe) */}
        <div
          ref={tickerRef}
          role="region"
          aria-live="polite"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="flex items-center gap-4 outline-none"
        >
          <div className={`p-3 rounded-xl ${styles.bg} ${styles.text}`}>
            {current.icon}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {current.message}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">
              {relativeTime(current.timestamp as Date)}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              isReducedMotion
                ? "w-0"
                : "bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"
            } transition-[width] duration-150 ease-linear`}
            style={{ width: `${paused || isReducedMotion ? 0 : progress}%` }}
          />
        </div>
      </div>

      {/* Timeline (last 4) */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="space-y-3">
          {items.slice(0, 4).map((item, i) => {
            const s = TYPE_STYLES[item.type];
            return (
              <button
                key={item.id}
                onClick={() => { setPaused(true); setIndex(i); }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 text-left ${
                  i === index
                    ? "bg-neutral-100 dark:bg-neutral-800/50"
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                }`}
                aria-label={`Open update: ${item.message}`}
              >
                <span className={`p-2 rounded-lg ${s.bg} ${s.text}`}>
                  {item.icon ?? fallbackIcon(item.type)}
                </span>
                <span className="flex-1 min-w-0 text-sm text-neutral-700 dark:text-neutral-300 truncate">
                  {item.message}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono whitespace-nowrap">
                  {relativeTime(toDate(item.timestamp))}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <button
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-200"
            aria-label="View full changelog"
            // Hook to /changelog when ready
          >
            View full changelog →
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm">
        <Coffee className="h-4 w-4 text-neutral-400" />
        <span className="text-neutral-500 dark:text-neutral-400">
          Actively building • Last update {relativeTime(items[0].timestamp as Date)}
        </span>
      </div>
    </div>
  );
}
