import { Github, Linkedin, Mail } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0b0f14]"
    >
      {/* Top: pitch + actions */}
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-14">
        <div className="grid gap-6 text-sm md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Available for complex builds
            </p>
            <p className="mt-2 text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Let&apos;s build reliable platforms together.
            </p>
            <p className="mt-1 text-neutral-500 dark:text-neutral-400">
              Baltimore, MD ·{" "}
              <a
                href="mailto:nithinpoolareddy@gmail.com"
                className="underline decoration-neutral-300/70 underline-offset-4 hover:text-neutral-800 dark:hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
              >
                nithinpoolareddy@gmail.com
              </a>
            </p>
          </div>

          <nav aria-label="Social links" className="justify-self-start md:justify-self-end">
            <ul className="flex flex-wrap gap-3">
              <li>
                <a
                  aria-label="Email Nithin"
                  href="mailto:nithinpoolareddy@gmail.com"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </li>
              <li>
                <a
                  aria-label="LinkedIn profile"
                  href="https://www.linkedin.com/in/nithinpoolareddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  aria-label="GitHub profile"
                  href="https://github.com/poolanithinreddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom bar (centered, single line) */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 py-4">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
            © {year} Nithin Reddy Poola. <span className="font-medium">All rights reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
