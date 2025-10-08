import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { allPosts } from "contentlayer/generated";

const fmt = (d: string | Date) =>
  new Date(d).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });

// Static homepage - no server components or database queries
export default function HomePage() {
  const posts = [...allPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  return (
    <div className="relative">
      {/* Hero Section */}
      <header className="container-wide pt-[calc(env(safe-area-inset-top)+92px)] pb-12 px-4">
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
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800 transition-colors font-medium"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </header>

      {/* Skills Section */}
      <section className="container-wide py-16 px-4 bg-neutral-50 dark:bg-neutral-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Technical Expertise
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Experienced in full-stack development with modern technologies and cloud platforms
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-neutral-100">Frontend</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "TypeScript", "Tailwind CSS", "JavaScript"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-neutral-100">Backend</h3>
              <div className="flex flex-wrap gap-2">
                {["Node.js", "Python", "Java", "PostgreSQL", "REST APIs"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-neutral-100">Cloud & DevOps</h3>
              <div className="flex flex-wrap gap-2">
                {["AWS", "Azure", "Docker", "Kubernetes", "CI/CD"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="container-wide py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-neutral-900/90 px-4 py-2 text-sm font-semibold text-white dark:bg-white/10">
              <Sparkles className="h-4 w-4" /> Featured Projects
            </span>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Project placeholders - these will be populated from database once live */}
            <div className="group p-6 rounded-lg border border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 transition-colors">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Cloud Infrastructure Platform
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                Scalable cloud platform built with modern microservices architecture
              </p>
              <div className="flex flex-wrap gap-2">
                {["AWS", "Kubernetes", "Node.js"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="group p-6 rounded-lg border border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 transition-colors">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Full-Stack Web Application
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                Modern web application with real-time features and responsive design
              </p>
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "PostgreSQL"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="group p-6 rounded-lg border border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 transition-colors">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Machine Learning Pipeline
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                Automated ML pipeline for data processing and model deployment
              </p>
              <div className="flex flex-wrap gap-2">
                {["Python", "TensorFlow", "Docker"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              View All Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {posts.length > 0 && (
        <section className="container-wide py-16 px-4 bg-neutral-50 dark:bg-neutral-900/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-900 dark:text-neutral-100">
              Latest Posts
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}` as Route}
                  className="group p-6 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  {post.summary && (
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-3 mb-4">
                      {post.summary}
                    </p>
                  )}
                  <time className="text-xs text-neutral-500 dark:text-neutral-400">
                    {fmt(post.publishedAt)}
                  </time>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}