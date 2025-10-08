"use client";

import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string; // initials
  quote: string;
  rating: number; // 1-5
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "VP of Engineering",
    company: "Fintech Startup",
    avatar: "SC",
    quote:
      "Nithin transformed our payment processing system. Response times dropped by 60% and we haven't had a single outage since launch. His attention to edge cases and error handling is exceptional.",
    rating: 5,
  },
  {
    id: "2",
    name: "Marcus Williams",
    role: "CTO",
    company: "B2B SaaS Platform",
    avatar: "MW",
    quote:
      "The dashboard redesign exceeded expectations. User engagement up 45%, support tickets down 30%. Nithin thinks like a product person while coding like an engineer.",
    rating: 5,
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    role: "Head of Product",
    company: "HealthTech Co",
    avatar: "ER",
    quote:
      "We needed HIPAA compliance and sub-second load times. Nithin delivered both. The architecture documentation he provided has become our gold standard for all new projects.",
    rating: 5,
  },
];

const clientLogos = [
  { name: "Stripe" },
  { name: "Vercel" },
  { name: "AWS" },
  { name: "MongoDB" },
  { name: "Next.js" },
  { name: "PostgreSQL" },
];

const achievements = [
  { label: "Projects Shipped", value: "23+", icon: "🚀" },
  { label: "Happy Clients", value: "15+", icon: "⭐" },
  { label: "Uptime Average", value: "99.95%", icon: "✅" },
  { label: "Performance Wins", value: "60%", icon: "⚡", suffix: "avg reduction" },
];

function srOnly(text: string) {
  return <span className="sr-only">{text}</span>;
}

export function SocialProof() {
  const [active, setActive] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = testimonials.length;
  const prev = () => setActive((i) => (i - 1 + total) % total);
  const next = () => setActive((i) => (i + 1) % total);

  // Autoplay that respects reduced-motion & pauses on hover
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (prefersReducedMotion || isHovering) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, prefersReducedMotion, isHovering]);

  // Keyboard support (←/→)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement && containerRef.current?.contains(document.activeElement)) {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = testimonials[active];

  return (
    <section className="w-full space-y-16" aria-labelledby="social-proof-heading">
      {/* Section header */}
      <div className="text-center">
        <h3
          id="social-proof-heading"
          className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-3"
        >
          Trusted by Teams That Ship
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Real results from real projects — fintech, B2B SaaS, and healthtech in production
        </p>
      </div>

      {/* Achievement stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
        {achievements.map((stat) => (
          <div
            key={stat.label}
            className="text-center glass p-5 sm:p-6 rounded-2xl inner-glow"
            role="figure"
            aria-label={`${stat.label}: ${stat.value}${stat.suffix ? `, ${stat.suffix}` : ""}`}
          >
            <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">{stat.icon}</div>
            <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">{stat.label}</p>
            {stat.suffix && (
              <p className="text-[11px] text-neutral-500 dark:text-neutral-500 mt-1">{stat.suffix}</p>
            )}
          </div>
        ))}
      </div>

      {/* Testimonials carousel */}
      <div className="max-w-5xl mx-auto">
        <div
          ref={containerRef}
          className="relative glass p-8 sm:p-10 rounded-3xl inner-glow overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          aria-roledescription="carousel"
          aria-label="Client testimonials"
        >
          <Quote
            className="absolute top-5 left-5 h-8 w-8 text-neutral-300 dark:text-neutral-700 pointer-events-none"
            aria-hidden
          />

          {/* Slide */}
          <div
            className="relative z-10 grid gap-6 sm:gap-8 md:grid-cols-[auto,1fr]"
            role="group"
            aria-roledescription="slide"
            aria-label={`${active + 1} of ${total}`}
          >
            {/* Avatar */}
            <div className="flex sm:block justify-center">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg ring-1 ring-black/5 dark:ring-white/10 grid place-items-center font-bold text-lg sm:text-xl select-none
                bg-gradient-to-br from-neutral-900 to-neutral-700 text-white
                dark:from-neutral-200 dark:to-neutral-400 dark:text-neutral-900"
                aria-hidden
              >
                {t.avatar}
              </div>
            </div>

            {/* Copy */}
            <div>
              <div className="mb-4">
                <p className="font-bold text-base sm:text-lg text-neutral-900 dark:text-neutral-100">
                  {t.name}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {t.role} at {t.company}
                </p>
              </div>

              <blockquote className="text-base sm:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Rating (semantic) */}
              <div className="mt-5 flex items-center gap-1" aria-label={`Rating: ${t.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300 dark:text-neutral-700"
                    }`}
                    aria-hidden
                  />
                ))}
                {srOnly(`${t.rating} out of 5 stars`)}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between gap-3">
            {/* Dots */}
            <div role="tablist" aria-label="Testimonials navigation" className="flex items-center gap-2">
              {testimonials.map((_, idx) => {
                const isActive = idx === active;
                return (
                  <button
                    key={idx}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`testimonial-panel-${idx}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActive(idx)}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500
                      ${isActive ? "w-8 bg-neutral-900 dark:bg-neutral-100" : "w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-500"}`}
                  >
                    {srOnly(`Show testimonial ${idx + 1}`)}
                  </button>
                );
              })}
            </div>

            {/* Prev/Next */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow transition
                focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow transition
                focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Technology partners / “Seen in” */}
      <div className="text-center">
        <p className="text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-6 sm:mb-8 uppercase tracking-wider">
          Technologies & Tools I Work With
        </p>

        <ul
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 max-w-5xl mx-auto"
          aria-label="Technology logos"
        >
          {clientLogos.map((logo) => (
            <li key={logo.name}>
              <div className="px-4 py-2 sm:px-6 sm:py-3 surface rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 opacity-70 hover:opacity-100 transition-opacity">
                <span className="text-sm sm:text-base font-semibold text-neutral-700 dark:text-neutral-300">
                  {logo.name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Trust signals */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center">
        <div className="surface p-6 sm:p-7 rounded-2xl">
          <div className="text-2xl mb-2">🔒</div>
          <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Security First</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">HIPAA, SOC 2, and GDPR compliant projects</p>
        </div>

        <div className="surface p-6 sm:p-7 rounded-2xl">
          <div className="text-2xl mb-2">⚡</div>
          <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Performance Obsessed</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Core Web Vitals green on every project</p>
        </div>

        <div className="surface p-6 sm:p-7 rounded-2xl">
          <div className="text-2xl mb-2">📚</div>
          <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Documentation Matters</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">ADRs, runbooks, and onboarding guides</p>
        </div>
      </div>
    </section>
  );
}
