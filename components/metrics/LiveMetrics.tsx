"use client";

import { useEffect, useState } from "react";
import { Activity, Clock, Rocket } from "lucide-react";

interface MetricBadgeProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "stable";
}

function MetricBadge({ label, value, icon, trend }: MetricBadgeProps) {
  return (
    <div className="group relative w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-a/20 to-accent-c/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative glass-card px-4 py-3 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 hover:border-accent-a/30 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-accent-a/10 to-accent-c/10 flex items-center justify-center">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">{label}</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{value}</span>
              {trend && (
                <span className={`text-xs ${
                  trend === 'up' ? 'text-emerald-500' : 
                  trend === 'down' ? 'text-red-500' : 
                  'text-neutral-500'
                }`}>
                  {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}
                </span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

type LiveMetricsProps = {
  compact?: boolean;
};

export function LiveMetrics({ compact = false }: LiveMetricsProps) {
  const [metrics, setMetrics] = useState({
    p95: "87ms",
    uptime: "99.96%",
    deploys: "23"
  });

  // Simulate live updates (replace with real API calls)
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        p95: `${Math.floor(Math.random() * 20) + 80}ms`,
        uptime: `99.9${Math.floor(Math.random() * 9) + 1}%`,
        deploys: `${Math.floor(Math.random() * 10) + 20}`
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const containerClass = compact
    ? "grid grid-cols-1 gap-3 w-full"
    : "grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full";

  return (
    <div className={containerClass}>
      <MetricBadge
        label="p95 Latency"
        value={metrics.p95}
        icon={<Clock className="w-4 h-4 text-accent-a" />}
        trend="down"
      />
      <MetricBadge
        label="Uptime SLA"
        value={metrics.uptime}
        icon={<Activity className="w-4 h-4 text-accent-b" />}
        trend="stable"
      />
      <MetricBadge
        label="This Month"
        value={metrics.deploys}
        icon={<Rocket className="w-4 h-4 text-accent-c" />}
        trend="up"
      />
    </div>
  );
}
