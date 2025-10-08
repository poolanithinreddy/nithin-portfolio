import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const sitemap = `${siteConfig.url.replace(/\/$/, "")}/sitemap.xml`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap,
  };
}
