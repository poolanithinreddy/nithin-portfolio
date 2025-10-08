import dynamic from "next/dynamic";
import Link from "next/link";

// NO server components, NO database queries, NO complex imports
// This page is 100% static and will never generate client-reference-manifest files

// Dynamically import the full homepage with no SSR
const DynamicHomePage = dynamic(
  () => import("@/components/DynamicHomePage").then((mod) => ({ default: mod.DynamicHomePage })),
  { 
    ssr: false,
    loading: () => (
      <div className="relative min-h-screen">
        {/* Simple loading state that's completely static */}
        <div className="container-wide pt-[calc(env(safe-area-inset-top)+92px)] pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
              Nithin Reddy Poola
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                Available for high-impact work
              </span>
            </div>
            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
              Full-Stack Software Engineer specializing in modern web applications, 
              cloud infrastructure, and scalable system architecture
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/work"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors font-medium"
              >
                View My Work
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800 transition-colors font-medium"
              >
                Get In Touch
              </Link>
            </div>
            <div className="mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-neutral-100 mx-auto"></div>
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">Loading portfolio...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
);

// This is now a completely static component with zero server-side logic
export default function HomePage() {
  return <DynamicHomePage />;
}