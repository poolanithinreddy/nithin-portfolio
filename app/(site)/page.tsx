import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Database, Server, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { safeDbQuery } from "@/lib/db-utils";
import { allPosts, type Post } from "contentlayer/generated";
import ConstellationTitle from "@/components/hero/ConstellationTitle";
import { SpotlightCursor } from "@/components/effects/SpotlightCursor";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { LiveMetrics } from "@/components/metrics/LiveMetrics";
import { ProductTheater } from "@/components/theater/ProductTheater";
import { HowIWork } from "@/components/process/HowIWork";
import { CommandPalette } from "@/components/ui/command-palette";
import { RadialCapabilityMap } from "@/components/capabilities/RadialCapabilityMap";
import { LiveChangelog } from "@/components/activity/LiveChangelog";
import { BeforeAfterSlider } from "@/components/performance/BeforeAfterSlider";
import { SocialProof } from "@/components/social/SocialProof";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const fmt = (d: string | Date) =>
  new Date(d).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });

type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  featured: boolean;
  tech: string[];
  createdAt: Date;
};

export default async function HomePage() {
  // Use safe database query with fallback
  const projects = await safeDbQuery(
    () => prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: 7 }),
    [] as Project[]
  );
  
  const posts = [...allPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
  const featured = projects.find((p: Project) => p.featured) ?? projects[0] ?? null;

  return (
    <div className="relative">
      {/* Palette */}
      <CommandPalette />

      {/* Spotlight off on mobile for calmness */}
      <div className="hidden sm:block">
        <SpotlightCursor />
      </div>

      {/* Ambient layers */}
      <div aria-hidden className="field field-light dark:field-dark" />
      <div aria-hidden className="field grain" />
      <div aria-hidden className="conic-accent-1 left-1/4 top-20 h-96 w-96 hidden md:block" />
      <div aria-hidden className="conic-accent-2 right-1/3 top-1/2 h-80 w-80 hidden md:block" />

      {/* ===== HERO ===== */}
      <header
        className="
          container-wide
          pt-[calc(env(safe-area-inset-top)+92px)]
          sm:pt-[calc(env(safe-area-inset-top)+108px)]
          lg:pt-[calc(env(safe-area-inset-top)+132px)]
          pb-12 sm:pb-16 px-4 sm:px-6
        "
      >
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="max-w-2xl">
            {/* STATUS CHIP — desktop/tablet */}
            <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 kicker">
                Available for high-impact work
              </span>
            </div>

            {/* NAME */}
            <h1
              className="headline-xl text-[38px] leading-tight sm:text-5xl lg:text-6xl"
              aria-label="Nithin Reddy Poola - Software Engineer"
            >
              Nithin Reddy Poola
            </h1>

            {/* STATUS CHIP — mobile */}
            <div className="mt-3 inline-flex sm:hidden items-center gap-2 px-3 py-1.5 rounded-full glass">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200 kicker">
                Available for high-impact work
              </span>
            </div>

            {/* PROMISE LINE */}
            <p className="mt-3 text-[20px] sm:text-[24px] md:text-[28px] font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight leading-snug">
              I turn complex systems into effortless products.
            </p>

            {/* BODY */}
            <p className="mt-4 max-w-[32ch] sm:max-w-xl text-base sm:text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
              Full-stack engineer focused on shipping{" "}
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">resilient, measurable platforms</span> with{" "}
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">design-level polish</span>. Faster launches, fewer incidents, happier users.
            </p>

            {/* LIVE METRICS */}
            <div className="mt-6 sm:mt-8 mb-6 sm:mb-8">
              <LiveMetrics />
            </div>

            {/* CTAs — full-width on mobile, no “shake” */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="inline-flex transform-gpu will-change-transform [backface-visibility:hidden] w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary shadow-medium focus:focus-ring-primary h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto rounded-2xl"
                >
                  <Link href={"work" as Route}>
                    View Work <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                  </Link>
                </Button>
              </div>
              <div className="inline-flex transform-gpu will-change-transform [backface-visibility:hidden] w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="btn-secondary h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto rounded-2xl"
                >
                  <Link href={"/contact" as Route}>Let&apos;s Talk</Link>
                </Button>
              </div>
            </div>

            {/* HARD STATS */}
            <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-4 max-w-md">
              {[
                { k: "Products Shipped", v: "23+", icon: Sparkles },
                { k: "Avg Response", v: "<100ms", icon: Zap },
                { k: "Uptime SLA", v: "99.95%", icon: Server },
              ].map((s) => (
                <div key={s.k} className="text-center glass-hover p-3 sm:p-5 inner-glow transition-all duration-300">
                  <s.icon className="h-4 sm:h-5 w-4 sm:w-5 mx-auto mb-1 sm:mb-2 text-neutral-600 dark:text-neutral-300" />
                  <div className="text-xl sm:text-2xl font-bold text-gradient mb-0.5 sm:mb-1">{s.v}</div>
                  <div className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-tight">
                    {s.k}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 sm:mt-12 hairline" />

            {/* Signal chips — single line, scroll on overflow */}
            <div
              className="mt-4 sm:mt-6 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Architecture signals"
            >
              <div className="flex flex-nowrap gap-2 sm:gap-3 pr-2">
                {[
                  { label: "RSC-first Architecture", icon: Server },
                  { label: "Postgres + Redis", icon: Database },
                  { label: "Edge + Serverless", icon: Cloud },
                  { label: "p95 < 100ms", icon: Zap },
                ].map((item) => (
                  <div key={item.label} className="trust-chip whitespace-nowrap">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Constellation — shorter on phones */}
          <div role="status" aria-live="polite" aria-atomic="true">
            <ConstellationTitle className="reveal h-[220px] sm:h-[360px]" />
          </div>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="container-wide pb-16 sm:pb-28 px-4 sm:px-6">
        {/* Featured */}
        {featured && (
          <section
            id="work"
            className="
              mt-8 sm:mt-16
              scroll-mt-[calc(env(safe-area-inset-top)+92px)]
              sm:scroll-mt-[calc(env(safe-area-inset-top)+108px)]
            "
          >
            <ScrollReveal>
              <div className="mb-6 sm:mb-8 text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-neutral-900/90 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white dark:bg-white/10 dark:text-neutral-200 shadow-lg">
                  <Sparkles className="h-4 w-4" /> Featured Case Study
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              {featured && featured.summary ? (
                <ProductTheater project={{
                  title: featured.title,
                  slug: featured.slug,
                  summary: featured.summary
                }} />
              ) : (
                <div className="glass p-8 radius-lg text-center">
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Featured projects will be available once the database is connected.
                  </p>
                </div>
              )}
            </ScrollReveal>

            <ScrollReveal delay={200}>
              {featured ? (
                <div className="grid gap-4 sm:gap-6 md:grid-cols-3 mt-6 sm:mt-10">
                  <div className="md:col-span-2 glass p-5 sm:p-8 radius-lg inner-glow">
                    <h2 className="headline-lg text-2xl sm:text-3xl lg:text-4xl mb-1">{featured.title}</h2>
                    {featured.summary && (
                      <p className="mt-3 sm:mt-5 text-base sm:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                        {featured.summary}
                      </p>
                    )}
                    {featured.tech?.length ? (
                      <div className="mt-5 sm:mt-8 flex flex-wrap gap-2">
                        {featured.tech.slice(0, 8).map((t: string) => (
                          <span key={t} className="chip">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="surface p-4 sm:p-6 radius-lg font-mono text-xs sm:text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 inner-glow">
                    <div className="mb-2 sm:mb-3 flex items-center gap-2 text-[10px] sm:text-xs kicker">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                      <span>System Status</span>
                    </div>
                    <pre className="whitespace-pre-wrap text-[10px] sm:text-xs">
{`✓ Status:    Live in Production
✓ Stack:     ${featured.tech?.slice(0, 3).join(" • ") || "Full-stack"}
✓ Deploy:    Automated CI/CD
✓ Perf:      <100ms p95 latency
✓ Scale:     Cloud-native arch`}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="glass p-8 radius-lg text-center mt-6 sm:mt-10">
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Project details will be loaded from the database.
                  </p>
                </div>
              )}
            </ScrollReveal>
          </section>
        )}

        {/* Projects */}
        {projects.length > 1 && (
          <section className="mt-16 sm:mt-32">
            <ScrollReveal>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-0 mb-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2 sm:mb-3">
                    More Projects
                  </h3>
                  <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
                    Outcome-driven solutions across fintech, B2B SaaS, and healthtech
                  </p>
                </div>
                <Link
                  href={"/work" as Route}
                  className="group flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:text-gradient transition-all duration-300"
                >
                  See all projects
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="mt-6 sm:mt-10 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((p: Project, i: number) => (
                <ScrollReveal key={p.id} delay={i * 100}>
                  <Link
                    href={`/work/${p.slug}` as Route}
                    className="group aura-border glass-hover radius-lg p-4 sm:p-6 block focus:focus-ring-primary transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs kicker font-semibold">{new Date(p.createdAt).getFullYear()}</p>
                      {p.featured && <span className="pill">Featured</span>}
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-neutral-50 mb-2 sm:mb-3 group-hover:text-gradient transition-all duration-300">
                      {p.title}
                    </h4>
                    {p.summary && (
                      <p className="text-sm line-clamp-2 text-neutral-600 dark:text-neutral-300 mb-4 sm:mb-5 leading-relaxed">
                        {p.summary}
                      </p>
                    )}
                    {p.tech?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {p.tech.slice(0, 4).map((t: string) => (
                          <span key={t} className="chip text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Latest Writing */}
        <section className="mt-16 sm:mt-24">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-0 mb-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2 sm:mb-3">
                  Latest Writing
                </h3>
                <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
                  Insights on architecture, performance, and product craft
                </p>
              </div>
              <Link
                href={"/blog" as Route}
                className="group flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:text-gradient transition-all duration-300"
              >
                See all posts
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: Post, i: number) => (
              <ScrollReveal key={post._id} delay={i * 100}>
                <Link
                  href={`/blog/${post.slug}` as Route}
                  className="group aura-border surface radius-lg p-4 sm:p-6 block hover:shadow-lg transition-all duration-300 focus:focus-ring-primary"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <p className="text-xs kicker font-semibold">{fmt(post.publishedAt)}</p>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-neutral-50 mb-2 sm:mb-3 group-hover:text-gradient transition-all duration-300">
                    {post.title}
                  </h4>
                  <p className="text-sm line-clamp-3 text-neutral-600 dark:text-neutral-300 mb-4 sm:mb-5 leading-relaxed">
                    {post.summary ?? ""}
                  </p>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">~5 min read</div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mt-16 sm:mt-32">
          <ScrollReveal>
            <HowIWork />
          </ScrollReveal>
        </section>

        {/* Capabilities */}
        <section className="mt-16 sm:mt-32">
          <ScrollReveal>
            <RadialCapabilityMap />
          </ScrollReveal>
        </section>

        {/* Performance */}
        <section className="mt-16 sm:mt-32">
          <ScrollReveal>
            <BeforeAfterSlider />
          </ScrollReveal>
        </section>

        {/* Social proof */}
        <section className="mt-16 sm:mt-32">
          <ScrollReveal>
            <SocialProof />
          </ScrollReveal>
        </section>

        {/* Activity */}
        <section className="mt-16 sm:mt-32">
          <ScrollReveal>
            <LiveChangelog />
          </ScrollReveal>
        </section>

        {/* CTA */}
        <ScrollReveal delay={100}>
          <section className="mt-16 sm:mt-32 text-center glass p-8 sm:p-12 lg:p-20 radius-lg inner-glow border border-neutral-200/50 dark:border-neutral-700/50">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4 sm:mb-6 leading-tight">
              Ready to build something <span className="text-gradient">amazing</span>?
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
              Let&apos;s collaborate on your next big idea. Fast, reliable, and beautiful — every time.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
              <div className="inline-flex transform-gpu will-change-transform [backface-visibility:hidden] w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary shadow-lg focus:focus-ring-primary h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-semibold w-full sm:w-auto rounded-2xl"
                >
                  <Link href={"/contact" as Route}>
                    Get in Touch <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                  </Link>
                </Button>
              </div>
              <div className="inline-flex transform-gpu will-change-transform [backface-visibility:hidden] w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="btn-secondary h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-semibold w-full sm:w-auto rounded-2xl"
                >
                  <Link href={"/work" as Route}>Browse All Projects</Link>
                </Button>
              </div>
            </div>
            <p className="mt-8 sm:mt-10 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
              Trusted by fintech, B2B SaaS, and healthtech teams in production
            </p>
          </section>
        </ScrollReveal>

        {/* Footer */}
        <footer className="mt-16 sm:mt-32 pt-8 sm:pt-12 text-center">
          <div className="hairline mb-6 sm:mb-8" />
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium px-4">
            © {new Date().getFullYear()} Nithin Reddy Poola. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
