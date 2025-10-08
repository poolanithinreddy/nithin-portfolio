import Image from "next/image";
import Link from "next/link";
import { allPages } from "contentlayer/generated";

import { Mdx } from "@/lib/mdx";
import { constructMetadata, siteConfig } from "@/lib/seo";
import { Timeline, SkillsMatrix } from "@/components/timeline";

const aboutPage = allPages.find((page) => page.slug === "about");

export const metadata = constructMetadata({
  title: aboutPage?.title ?? "About — Nithin Reddy Poola",
  description:
    aboutPage?.description ??
    "Full-stack & distributed-systems engineer building resilient products, secure platforms, and scalable infra.",
  canonical: `${siteConfig.url}/about`,
  openGraph: {
    url: `${siteConfig.url}/about`,
    title: "About — Nithin Reddy Poola",
    description:
      "Full-stack & distributed-systems engineer building resilient products, secure platforms, and scalable infra.",
    images: [{ url: `${siteConfig.url}/og/about.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Nithin Reddy Poola",
    description:
      "Full-stack & distributed-systems engineer building resilient products, secure platforms, and scalable infra.",
  },
});

const timelineData = [
  {
    year: "2025",
    title: "Software Development Engineer (SDE) Intern — Full-stack & CyberRange",
    company: "UMBC Dept. of CSEE",
    description:
      "End-to-end ownership for the UMBC CyberRange Portal: Next.js/React UI, Node/Express services, MongoDB data layer. Built class management, lab uploads, progress APIs, RBAC with audit logs. Implemented SAML SSO, hardened sessions/CSRF, automated vCenter VM lifecycle via Python/Node workers. Containerized with Docker, fronted by NGINX (TLS, canonicalization), plus health checks, logs, and metrics.",
    tech: ["Next.js", "Node/Express", "TypeScript", "MongoDB", "Docker", "NGINX", "SAML/SSO", "vCenter", "Python"],
  },
  {
    year: "2024–2025",
    title: "Graduate Assistant (Grader) — CMSC 481 Computer Networks",
    company: "UMBC",
    description:
      "Evaluated routing, congestion control, and socket programming assignments; helped debug packet workflows and networked systems.",
    tech: ["TCP/UDP", "Congestion Control", "Sockets", "Linux"],
  },
  {
    year: "2023",
    title: "Web Development Intern",
    company: "Oasis Infobyte (Delhi)",
    description:
      "Built an e-commerce frontend (HTML/CSS/JS). Measured and improved page-load performance and task completion.",
    tech: ["JavaScript", "HTML/CSS", "Perf Tuning"],
  },
  {
    year: "2022",
    title: "Data Science Intern",
    company: "Small Talk Technologies (Chennai)",
    description:
      "Trained ML models on behavioral signals for recommendations; engineered features and validation for conversion uplift.",
    tech: ["Python", "Pandas", "Scikit-learn"],
  },
  {
    year: "2024–2026",
    title: "M.S. in Computer Science",
    company: "UMBC",
    description: "Focus: full-stack systems, cloud computing, operating systems, DSA, distributed systems.",
    tech: ["Distributed Systems", "Cloud", "Systems"],
  },
  {
    year: "2020–2024",
    title: "B.E. in Computer Science (GPA 8.97/10)",
    company: "Saveetha School of Engineering (SIMATS)",
    description: "Academic Topper; Java Subject Topper; Patent pending (IoT Door Unlocking).",
    tech: ["Java", "C++", "Embedded"],
  },
];

const skillsData = [
  {
    category: "Frontend",
    skills: [
      { name: "React / Next.js", level: 92 },
      { name: "TypeScript", level: 90 },
      { name: "Accessibility & UX", level: 86 },
      { name: "Tailwind CSS", level: 90 },
    ],
  },
  {
    category: "Backend & APIs",
    skills: [
      { name: "Node.js / Express", level: 90 },
      { name: "REST / GraphQL / WebSockets", level: 85 },
      { name: "Python (FastAPI/automation)", level: 82 },
      { name: "Auth (SAML/SSO, OAuth2, JWT)", level: 84 },
    ],
  },
  {
    category: "Data & ML",
    skills: [
      { name: "PostgreSQL / MongoDB", level: 82 },
      { name: "Pandas / Scikit-learn", level: 78 },
      { name: "Data Pipelines", level: 76 },
      { name: "Caching & Consistency", level: 74 },
    ],
  },
  {
    category: "Infra & Cloud",
    skills: [
      { name: "Docker / Compose", level: 88 },
      { name: "NGINX / TLS / Reverse Proxy", level: 86 },
      { name: "AWS (S3, EC2, Lambda)", level: 78 },
      { name: "VMware vCenter", level: 80 },
    ],
  },
  {
    category: "Systems & Reliability",
    skills: [
      { name: "Distributed Systems", level: 80 },
      { name: "Observability (logs/metrics)", level: 78 },
      { name: "Security & Hardening", level: 80 },
      { name: "CI/CD", level: 82 },
    ],
  },
];

export default function AboutPage() {
  if (!aboutPage) return null;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nithin Reddy Poola",
    url: siteConfig.url,
    jobTitle: "Software Engineer",
    sameAs: [
      siteConfig.url,
      "https://github.com/poolanithinreddy",
      "https://www.linkedin.com/in/nithinpoolareddy",
    ],
    knowsAbout: [
      "Full-stack Development",
      "Distributed Systems",
      "DevOps",
      "Cloud Computing",
      "Cyber Ranges",
      "SAML SSO",
      "OAuth2",
      "NGINX",
      "VMware vCenter",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-purple-50/30 to-transparent dark:from-blue-950/20 dark:via-purple-950/10 dark:to-transparent" />
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-600/10 dark:to-purple-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-400/20 to-pink-400/20 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-0 left-1/2 w-[700px] h-[700px] -translate-x-1/2 bg-gradient-to-t from-emerald-400/15 to-cyan-400/15 dark:from-emerald-600/8 dark:to-cyan-600/8 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="container-wide">
          <div className="grid items-center gap-12 lg:gap-16 md:grid-cols-[1.2fr,0.8fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm shadow-lg shadow-blue-500/10 dark:shadow-blue-900/20">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
                <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  About Me
                </span>
              </div>

              {/* HERO */}
              <div>
                <p className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  Hi, I am
                </p>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    Nithin Reddy Poola
                  </span>
                </h1>

                {/* Static tags — no hover color change */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {[
                    "Full-Stack Engineer & AI Enthusiast",
                    "Distributed Systems",
                    "Security-minded",
                  ].map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Short description */}
                <p className="mt-6 text-xl lg:text-2xl text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl font-medium">
                  I design for failure, build for scale, and instrument everything—so products stay{" "}
                  <span className="font-bold text-neutral-900 dark:text-white">fast</span>,{" "}
                  <span className="font-bold text-neutral-900 dark:text-white">secure</span>, and{" "}
                  <span className="font-bold text-neutral-900 dark:text-white">easy to operate</span>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/now"
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-2xl shadow-xl shadow-blue-500/30 dark:shadow-blue-900/40 hover:shadow-2xl hover:shadow-blue-500/40 dark:hover:shadow-blue-900/50 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">What I&apos;m working on (Now)</span>
                  <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>

                <a
                  href="/Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-neutral-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-blue-500 dark:hover:border-blue-400"
                >
                  <span className="relative">View Resume</span>
                  <svg className="relative w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="justify-self-center lg:justify-self-end">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-[32px] opacity-75 blur-2xl group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-[32px] opacity-50 blur-xl group-hover:opacity-75 transition duration-1000" />

                <div className="relative w-72 sm:w-80 lg:w-96 aspect-square rounded-[28px] overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-[1.02] transition-transform duration-500">
                  <Image
                    src="/images/NR.png"
                    alt="Nithin Reddy Poola"
                    fill
                    priority
                    className="object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700"
                    style={{ objectPosition: "50% 28%" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-narrow pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { icon: "🧭", title: "Full-stack", subtitle: "React • Next.js • Node • TypeScript", gradient: "from-blue-500 to-cyan-500" },
            { icon: "🛡️", title: "Security", subtitle: "OAuth2 • SAML/SSO • RBAC • OWASP", gradient: "from-purple-500 to-pink-500" },
            { icon: "⚙️", title: "Ops", subtitle: "Docker • NGINX • CI/CD • TLS", gradient: "from-emerald-500 to-teal-500" },
            { icon: "📈", title: "Systems", subtitle: "Distributed • Observability • Caching", gradient: "from-orange-500 to-red-500" },
          ].map((pillar, i) => (
            <div
              key={i}
              className="group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-3xl p-7 text-center border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${pillar.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500`} />

              <div className="relative">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {pillar.icon}
                </div>
                <div className={`text-2xl font-black mb-2 bg-gradient-to-r ${pillar.gradient} bg-clip-text text-transparent`}>
                  {pillar.title}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
                  {pillar.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MDX Article — headings color fixed, no hover color changes */}
       <article
  className={[
    "prose prose-lg prose-neutral max-w-none dark:prose-invert mb-24",
    "prose-headings:font-black prose-headings:tracking-tight",
    "prose-h1:text-[rgba(96,165,250,1)]",
    "prose-h2:text-[rgba(96,165,250,1)]",
    "prose-h3:text-[rgba(96,165,250,1)]",
    "prose-h2:text-4xl prose-h2:mb-8 prose-h2:mt-16",
    "prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:text-lg",
    "prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline prose-a:font-semibold",
    "hover:prose-a:underline hover:prose-a:decoration-2 hover:prose-a:underline-offset-4",
    "prose-strong:text-neutral-900 dark:prose-strong:text-white prose-strong:font-bold",
    "prose-ul:my-6 prose-li:text-neutral-700 dark:prose-li:text-neutral-300",

    // keep heading anchor links same color & no underline on hover/visited
    "[&_h1>a]:text-inherit [&_h1>a:hover]:text-inherit [&_h1>a:visited]:text-inherit",
    "[&_h2>a]:text-inherit [&_h2>a:hover]:text-inherit [&_h2>a:visited]:text-inherit",
    "[&_h3>a]:text-inherit [&_h3>a:hover]:text-inherit [&_h3>a:visited]:text-inherit",
    "[&_h1>a]:no-underline [&_h1>a:hover]:no-underline",
    "[&_h2>a]:no-underline [&_h2>a:hover]:no-underline",
    "[&_h3>a]:no-underline [&_h3>a:hover]:no-underline",
  ].join(" ")}
>
  <Mdx code={aboutPage.body.code} />
</article>

        <section className="mb-24">
          <h2 className="text-4xl lg:text-5xl font-black mb-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Selected Work
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {[
              {
                title: "UMBC CyberRange Portal",
                desc: "Provision isolated VMs for cyber labs; class/lab management, progress APIs, RBAC with audit logs; SAML SSO; vCenter automation; Docker + NGINX deploy with TLS, health checks, logs & metrics.",
                tags: ["Next.js", "TypeScript", "Node/Express", "MongoDB", "vCenter", "Docker", "NGINX", "SAML"],
                gradient: "from-blue-500 to-purple-500",
              },
              {
                title: "Real-time AI Interview Platform",
                desc: "Voice-interactive mock interviews with live scoring. WebSocket multiplexing, streaming, modular scoring backends, modern UI.",
                tags: ["Next.js", "TypeScript", "WebSockets", "AI APIs"],
                gradient: "from-purple-500 to-pink-500",
              },
            ].map((work, i) => (
              <div
                key={i}
                className="group relative bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl p-8 border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${work.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500`} />

                <div className="relative">
                  <h3 className={`text-2xl font-black mb-4 bg-gradient-to-r ${work.gradient} bg-clip-text text-transparent`}>
                    {work.title}
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed text-base">
                    {work.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {work.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="px-3 py-1.5 text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full border border-neutral-200 dark:border-neutral-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-4xl lg:text-5xl font-black mb-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Professional Journey
          </h2>
          <Timeline items={timelineData} />
        </section>

        <section className="mb-24">
          <h2 className="text-4xl lg:text-5xl font-black mb-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <SkillsMatrix categories={skillsData} />
        </section>

        <section className="mb-24">
          <h2 className="text-4xl lg:text-5xl font-black mb-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Certifications
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: "Azure AI Engineer Associate", year: "2025" },
              { title: "Azure Data Scientist Associate", year: "2025" },
            ].map((cert, i) => (
              <div
                key={i}
                className="group relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-3xl p-8 border border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500" />

                <div className="relative">
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">
                    Microsoft Certified
                  </div>
                  <div className="text-2xl font-black text-neutral-900 dark:text-white mb-1">
                    {cert.title}
                  </div>
                  <div className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                    {cert.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-[32px] opacity-25 blur-2xl group-hover:opacity-40 transition duration-1000" />

          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 backdrop-blur-xl rounded-[32px] p-12 lg:p-16 text-center border border-blue-200/50 dark:border-blue-800/50 shadow-2xl">
            <h3 className="text-3xl lg:text-4xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Let&apos;s build something reliable
            </h3>
            <p className="text-lg lg:text-xl text-neutral-700 dark:text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Interested in resilient systems, developer ergonomics, or lab automation? I&apos;d love to help.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group/btn relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-2xl shadow-xl shadow-blue-500/30 dark:shadow-blue-900/40 hover:shadow-2xl hover:shadow-blue-500/40 dark:hover:shadow-blue-900/50 transition-all duration-300 hover:scale-105"
              >
                <span className="relative">Get in touch</span>
                <svg className="relative w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <Link
                href="/now"
                className="group/btn relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-neutral-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-blue-500 dark:hover:border-blue-400"
              >
                <span className="relative">See what I&apos;m doing now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
