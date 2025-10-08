import { ContactForm } from "@/components/ContactForm";
import { constructMetadata, siteConfig } from "@/lib/seo";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Contact",
  description:
    "Start a project or discuss systems architecture for your platform.",
  canonical: `${siteConfig.url}/contact`,
  keywords: ["Contact", "Hire", "Consulting", "Systems architecture"],
});

export default function ContactPage() {
  const contactPointJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nithin Reddy Poola — Software Engineer",
    url: siteConfig.url,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "business",
        email: "nithinreddypoola@gmail.com",
        url: `${siteConfig.url}/contact`,
        areaServed: "Global",
        availableLanguage: ["English"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "09:00",
          closes: "18:00",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPointJsonLd) }}
      />

      <section className="relative overflow-hidden pt-32 md:pt-40 pb-16 md:pb-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-blue-50/30 to-transparent dark:from-emerald-950/20 dark:via-blue-950/10 dark:to-transparent" />
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/20 to-teal-400/20 dark:from-emerald-600/10 dark:to-teal-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-400/20 to-cyan-400/20 dark:from-blue-600/10 dark:to-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-1/2 w-[700px] h-[700px] -translate-x-1/2 bg-gradient-to-t from-purple-400/15 to-pink-400/15 dark:from-purple-600/8 dark:to-pink-600/8 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/10 dark:to-teal-400/10 border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm shadow-lg shadow-emerald-500/10 dark:shadow-emerald-900/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse" />
            <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Available for Projects
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            <span className="block mb-2 text-neutral-900 dark:text-white">
              Let&apos;s <span className="relative inline-block">
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Build
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-emerald-400/40 to-teal-400/40 dark:from-emerald-500/30 dark:to-teal-500/30 -z-10 blur-sm" />
              </span>
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
              Together
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl mx-auto font-medium">
            Tell me the problem, constraints, and success metrics. I reply to
            every message—typically within <span className="font-bold text-neutral-900 dark:text-white">one business day</span>—with next steps or a
            time to chat.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:nithinpoolareddy@gmail.com?subject=Project%20Inquiry"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 rounded-2xl shadow-xl shadow-emerald-500/30 dark:shadow-emerald-900/40 hover:shadow-2xl hover:shadow-emerald-500/40 dark:hover:shadow-emerald-900/50 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">Email Me</span>
              <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
            
            <Link
              href="/contact#form"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-neutral-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-emerald-500 dark:hover:border-emerald-400"
            >
              <span className="relative">Send a Brief</span>
              <svg className="relative w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <div className="container-narrow pb-24" id="form">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-[32px] opacity-20 blur-2xl group-hover:opacity-30 transition duration-1000" />
            
            <div className="relative bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-[32px] p-8 lg:p-10 border border-neutral-200/50 dark:border-neutral-800/50 shadow-2xl">
              <h2 className="text-3xl lg:text-4xl font-black mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Project Brief
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                A few details go a long way—timeline, scope, and any constraints.
                <span className="font-semibold text-neutral-900 dark:text-white"> Confidential by default.</span>
              </p>
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-3xl p-6 border border-emerald-200/50 dark:border-emerald-800/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500" />
              
              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400 mb-4">
                  Preferred Channels
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a
                      className="font-semibold text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      href="mailto:nithinpoolareddy@gmail.com"
                    >
                      nithinpoolareddy@gmail.com
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <a
                      className="font-semibold text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      href="https://www.linkedin.com/in/nithinpoolareddy"
                      target="_blank"
                      rel="noreferrer"
                    >
                      /nithinpoolareddy
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <a
                      className="font-semibold text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      href="https://github.com/poolanithinreddy"
                      target="_blank"
                      rel="noreferrer"
                    >
                      @nithinreddypoola
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-3xl p-6 border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500" />
              
              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400 mb-4">
                  Availability
                </p>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                  Open for high-impact product or infra engagements <span className="font-bold text-neutral-900 dark:text-white">(Q4&nbsp;2025 start)</span>.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl p-4 text-center border border-blue-200/50 dark:border-blue-800/50">
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Response</div>
                    <div className="text-xl font-black text-neutral-900 dark:text-white">~24 hrs</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 rounded-2xl p-4 text-center border border-cyan-200/50 dark:border-cyan-800/50">
                    <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-1">Timezone</div>
                    <div className="text-xl font-black text-neutral-900 dark:text-white">ET</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-3xl p-6 border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500" />
              
              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-600 dark:text-purple-400 mb-4">
                  Focus Areas
                </p>
                <ul className="space-y-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="leading-relaxed">Production Next.js platforms (design → deploy)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="leading-relaxed">vCenter automation & golden-image pipelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="leading-relaxed">Enterprise SSO (OAuth2, SAML) & RBAC</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="leading-relaxed">Realtime telemetry, logging, and observability</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900/50 dark:to-neutral-800/50 rounded-3xl p-6 border border-dashed border-neutral-300 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400 mb-4">
                  Quick FAQ
                </p>
                <div className="space-y-4 text-sm">
                  <details className="group/details">
                    <summary className="cursor-pointer font-bold text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors list-none flex items-center justify-between">
                      <span>Do you sign NDAs?</span>
                      <svg className="w-5 h-5 transition-transform group-open/details:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-neutral-600 dark:text-neutral-400 leading-relaxed pl-1">
                      Yes—send yours, or I can provide a mutual NDA before we discuss specifics.
                    </p>
                  </details>
                  <details className="group/details">
                    <summary className="cursor-pointer font-bold text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors list-none flex items-center justify-between">
                      <span>What&apos;s the best way to start?</span>
                      <svg className="w-5 h-5 transition-transform group-open/details:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-neutral-600 dark:text-neutral-400 leading-relaxed pl-1">
                      Share the current state, target outcome, constraints, and success metrics. I&apos;ll propose
                      an approach and milestones.
                    </p>
                  </details>
                  <details className="group/details">
                    <summary className="cursor-pointer font-bold text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors list-none flex items-center justify-between">
                      <span>Do you help with audits or rescue work?</span>
                      <svg className="w-5 h-5 transition-transform group-open/details:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-neutral-600 dark:text-neutral-400 leading-relaxed pl-1">
                      Absolutely—architecture reviews, performance audits, production hardening, and incident
                      response playbooks.
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
