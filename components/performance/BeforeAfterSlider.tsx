"use client";

import { useMemo, useState } from "react";
import {
  TrendingDown,
  Zap,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// ------------ Types & Data ------------
type Unit = "ms" | "s" | "KB";

interface MetricData {
  key: string;
  label: string;
  before: number;
  after: number;
  unit: Unit;
  // target = “good” threshold used for pass/fail/colored gauge
  target: number;
  // upper = “poor” threshold (for gauge coloring)
  poor: number;
  // whether this feeds Core Web Vitals pass/fail
  webVital?: boolean;
}

const METRICS: MetricData[] = [
  {
    key: "ttfb",
    label: "Time to First Byte (TTFB)",
    before: 890,
    after: 180,
    unit: "ms",
    target: 200, // fast
    poor: 600, // poor
  },
  {
    key: "p95",
    label: "P95 Latency",
    before: 450,
    after: 95,
    unit: "ms",
    target: 200,
    poor: 600,
  },
  {
    key: "fcp",
    label: "First Contentful Paint",
    before: 2.4,
    after: 0.8,
    unit: "s",
    target: 1.8, // CWV good
    poor: 3.0, // CWV poor
    webVital: true,
  },
  {
    key: "lcp",
    label: "Largest Contentful Paint",
    before: 3.8,
    after: 1.6,
    unit: "s",
    target: 2.5, // CWV good
    poor: 4.0, // CWV poor
    webVital: true,
  },
  {
    key: "tti",
    label: "Time to Interactive",
    before: 4.2,
    after: 1.9,
    unit: "s",
    target: 2.5,
    poor: 4.0,
    webVital: true,
  },
  {
    key: "bundle",
    label: "Bundle Size",
    before: 420,
    after: 180,
    unit: "KB",
    target: 200,
    poor: 500,
  },
];

// ------------ Helpers ------------
const formatValue = (val: number, unit: Unit) =>
  unit === "s" ? `${val.toFixed(1)}${unit}` : `${Math.round(val)}${unit}`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function zoneColor(value: number, target: number, poor: number) {
  if (value <= target) return "text-emerald-500";
  if (value >= poor) return "text-rose-500";
  return "text-amber-500";
}

function zoneBg(value: number, target: number, poor: number) {
  if (value <= target) return "bg-emerald-500";
  if (value >= poor) return "bg-rose-500";
  return "bg-amber-500";
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

// ------------ Component ------------
export function BeforeAfterSlider() {
  const [t, setT] = useState(0.5); // 0 = before, 1 = after

  // Current interpolated values
  const current = useMemo(
    () =>
      METRICS.map((m) => ({
        ...m,
        value: lerp(m.before, m.after, t),
        improvementPct: Math.round(((m.before - m.after) / m.before) * 100),
      })),
    [t]
  );

  // Core Web Vitals status (simple pass if all webVital metrics are <= target)
  const cwv = useMemo(() => {
    const vitals = current.filter((m) => m.webVital);
    const pass = vitals.every((m) => m.value <= m.target);
    return {
      pass,
      label: pass ? "PASS" : "FAIL",
      color: pass ? "text-emerald-500" : "text-rose-500",
      icon: pass ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />,
    };
  }, [current]);

  const avgImprovement = useMemo(() => {
    const sum = current.reduce((acc, m) => acc + m.improvementPct, 0);
    return Math.round(sum / current.length);
  }, [current]);

  const lighthouse = Math.round(65 + t * 35); // demo score

  return (
    <section className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
          Performance Impact
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Slide to compare <span className="font-semibold">Before</span> vs{" "}
          <span className="font-semibold">After</span> metrics from a recent optimization.
        </p>
      </div>

      {/* Slider panel */}
      <div className="surface-card p-6 md:p-8 rounded-2xl max-w-4xl mx-auto mb-8 border border-neutral-200/60 dark:border-neutral-800/60">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
              BEFORE
            </p>
            <p
              className={`text-2xl font-bold transition-opacity duration-300 ${
                t < 0.5 ? "opacity-100" : "opacity-40"
              } text-rose-500`}
            >
              Slow
            </p>
          </div>

          <div className="text-center flex-1">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white dark:bg-white/10 dark:text-neutral-200 shadow-lg"
              aria-live="polite"
            >
              <Zap className="h-4 w-4" />
              <span className="text-sm font-mono font-semibold">
                {Math.round(t * 100)}% optimized
              </span>
            </div>
          </div>

          <div className="text-center flex-1">
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
              AFTER
            </p>
            <p
              className={`text-2xl font-bold transition-opacity duration-300 ${
                t > 0.5 ? "opacity-100" : "opacity-40"
              } text-emerald-500`}
            >
              Fast
            </p>
          </div>
        </div>

        {/* Accessible slider */}
        <div className="relative">
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(t * 100)}
            onChange={(e) => setT(Number(e.target.value) / 100)}
            aria-label="Optimization percentage"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(t * 100)}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(244 63 94) 0%, rgb(244 63 94) ${
                t * 100
              }%, rgb(16 185 129) ${t * 100}%, rgb(16 185 129) 100%)`,
            }}
          />

          {/* custom thumbs */}
          <style jsx>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 2px solid #0a0a0a;
              background: white;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }
            input[type="range"]::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 2px solid #0a0a0a;
              background: white;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }
          `}</style>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {current.map((m) => {
          const color = zoneColor(m.value, m.target, m.poor);
          const bg = zoneBg(m.value, m.target, m.poor);

          // Gauge percentages (normalize between 0 and poor for a nice bar)
          const maxForGauge = Math.max(m.poor, m.before, m.after, m.target);
          const beforePct = clamp01(m.before / maxForGauge) * 100;
          const afterPct = clamp01(m.after / maxForGauge) * 100;
          const valuePct = clamp01(m.value / maxForGauge) * 100;
          const targetPct = clamp01(m.target / maxForGauge) * 100;

          return (
            <div key={m.key} className="surface-card p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    {m.label}
                  </p>
                  <span title={`Target ≤ ${formatValue(m.target, m.unit)}`}>
                    <Info className="w-4 h-4 text-neutral-400" />
                  </span>
                </div>
                <div className="flex items-center gap-1 text-emerald-500">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-xs font-bold">-{m.improvementPct}%</span>
                </div>
              </div>

              {/* Value */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-3xl font-bold font-mono ${color.replace("text-", "text-")}`}>
                  {formatValue(m.value, m.unit)}
                </span>
                <span className="text-lg text-neutral-500 dark:text-neutral-400">{m.unit}</span>
              </div>

              {/* Before / After labels */}
              <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                <span className="text-rose-500">{formatValue(m.before, m.unit)}</span>
                <span className="text-neutral-400">→</span>
                <span className="text-emerald-500">{formatValue(m.after, m.unit)}</span>
              </div>

              {/* Gauge with markers */}
              <div className="relative h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                {/* colored gradient from poor→target→good */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 opacity-20" />
                {/* current fill */}
                <div
                  className={`absolute left-0 top-0 h-full transition-all duration-300 ${bg}`}
                  style={{ width: `${valuePct}%` }}
                />
                {/* markers */}
                <span
                  className="absolute -top-1.5 h-5 w-[2px] bg-rose-500/80"
                  style={{ left: `calc(${beforePct}% - 1px)` }}
                  title="Before"
                />
                <span
                  className="absolute -top-1.5 h-5 w-[2px] bg-emerald-500/80"
                  style={{ left: `calc(${afterPct}% - 1px)` }}
                  title="After"
                />
                <span
                  className="absolute -bottom-1.5 h-5 w-[2px] bg-amber-500/80"
                  style={{ left: `calc(${targetPct}% - 1px)` }}
                  title="Target"
                />
              </div>

              {/* Legend */}
              <div className="mt-3 flex items-center gap-3 text-[11px] text-neutral-500 dark:text-neutral-400">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500/80" /> Before
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-500/80" /> Target
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500/80" /> After
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary band */}
      <div className="mt-8 text-center">
        <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-6 surface-card rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800/60">
          {/* Avg improvement */}
          <div className="min-w-[180px]">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
              Avg Improvement
            </p>
            <p className="text-2xl font-bold text-emerald-500">-{avgImprovement}%</p>
          </div>

          <div className="hidden sm:block w-px h-12 bg-neutral-300 dark:bg-neutral-700" />

          {/* Core Web Vitals */}
          <div className="min-w-[180px]">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
              Core Web Vitals
            </p>
            <p className={`inline-flex items-center gap-2 text-2xl font-bold ${cwv.color}`}>
              {cwv.icon}
              {cwv.label}
            </p>
          </div>

          <div className="hidden sm:block w-px h-12 bg-neutral-300 dark:bg-neutral-700" />

          {/* Lighthouse */}
          <div className="min-w-[180px]">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
              Lighthouse Score
            </p>
            <p className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
              {lighthouse}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
