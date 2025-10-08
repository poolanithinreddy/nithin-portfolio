import type { Route } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Zap, BookOpen, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/effects/ScrollReveal";

export const metadata = {
  title: "What I'm Doing Now",
  description: "Current projects, focus areas, and availability — updated regularly",
};

export default function NowPage() {
  const lastUpdated = "January 2025";
  
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-[#0a0a0a] dark:via-[#111111] dark:to-[#0a0a0a]">
        <div className="container-wide">
          <ScrollReveal>
            <Link 
              href={"/" as Route}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Available for Projects
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-neutral-950 dark:text-neutral-50 mb-6">
              What I&apos;m Doing <span className="text-gradient">Now</span>
            </h1>

            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl leading-relaxed">
              A glimpse into my current focus, projects, and availability. Inspired by Derek Sivers&apos;{" "}
              <a 
                href="https://nownownow.com/about" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-900 dark:text-neutral-100 font-semibold underline hover:text-gradient transition-colors"
              >
                /now movement
              </a>
              . Last updated: {lastUpdated}.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <main className="container-wide pb-28 -mt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Work */}
            <ScrollReveal>
              <div className="glass p-8 radius-lg inner-glow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-neutral-900 dark:bg-white/10">
                    <Code2 className="h-5 w-5 text-white dark:text-neutral-200" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    Current Projects
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="surface p-6 radius-md">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        Fintech Payment Platform
                      </h3>
                      <span className="pill text-xs">In Progress</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      Building a real-time payment processing system handling $2M+ daily volume. 
                      Focus on sub-100ms latency, idempotency, and graceful degradation.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="chip text-xs">Next.js</span>
                      <span className="chip text-xs">Node.js</span>
                      <span className="chip text-xs">PostgreSQL</span>
                      <span className="chip text-xs">Redis</span>
                      <span className="chip text-xs">Stripe</span>
                    </div>
                  </div>

                  <div className="surface p-6 radius-md">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        Portfolio Redesign
                      </h3>
                      <span className="pill text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Shipped
                      </span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      Complete overhaul with Apple-inspired product theater, radial capability map, 
                      and interactive performance sliders. Built with Next.js 14 App Router.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="chip text-xs">React</span>
                      <span className="chip text-xs">TypeScript</span>
                      <span className="chip text-xs">Tailwind</span>
                      <span className="chip text-xs">Framer Motion</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Learning & Growth */}
            <ScrollReveal delay={100}>
              <div className="glass p-8 radius-lg inner-glow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-neutral-900 dark:bg-white/10">
                    <BookOpen className="h-5 w-5 text-white dark:text-neutral-200" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    Learning & Exploring
                  </h2>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Event-Driven Architecture
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Deep dive into Kafka, async patterns, and event sourcing. Building a proof-of-concept 
                        for distributed transaction handling.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Rust for System Programming
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Exploring Rust for performance-critical services. Currently building a CLI tool 
                        for analyzing bundle sizes.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Web Performance Optimization
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Obsessed with Core Web Vitals. Experimenting with edge computing, ISR, and 
                        advanced caching strategies.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <ScrollReveal delay={200}>
              <div className="surface p-6 radius-lg sticky top-24">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  Status
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Location
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        San Francisco, CA
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Availability
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Open for new projects starting February 2025
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Current Focus
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Fintech, B2B SaaS, Healthtech
                      </p>
                    </div>
                  </div>
                </div>

                <div className="hairline my-6" />

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Quick Stats
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        2
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Active Projects
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        99.95%
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Uptime
                      </p>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full mt-6 btn-primary">
                  <Link href={"/contact" as Route}>
                    Get in Touch
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Footer Note */}
        <ScrollReveal delay={300}>
          <div className="mt-16 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              This page is updated monthly. Last updated: <strong>{lastUpdated}</strong>
            </p>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
