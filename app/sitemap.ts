import type { MetadataRoute } from "next";

import { allPosts, allProjects } from "contentlayer/generated";

import { siteConfig } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/work",
    "/blog",
    "/contact",
  ].map((path) => ({
    url: `${baseUrl}${path || "/"}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.6,
  }));

  const projectEntries: MetadataRoute.Sitemap = allProjects.map((project) => ({
    url: `${baseUrl}${project.url}`,
    lastModified: new Date(project.year, 0, 1),
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${baseUrl}${post.url}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...routes, ...projectEntries, ...postEntries];
}
