import type { Metadata, MetadataRoute } from "next";

export const siteConfig = {
  name: "Nithin Reddy Poola",
  title: "Nithin Reddy Poola — Full-stack Engineer",
  description:
    "Full-stack & distributed-systems engineer shipping production-grade platforms across Next.js, Node, VMware, and cloud infrastructure.",
  url: "https://nithinreddy.com",
  ogImage: "/og",
  keywords: [
    "Nithin Reddy Poola",
    "Full-stack engineer",
    "Next.js consultant",
    "Systems engineer",
    "CyberRange",
    "VMware vCenter automation",
    "SAML SSO",
    "Node.js",
    "TypeScript",
  ],
  links: {
    github: "https://github.com/poolanithinreddy",
    linkedin: "https://www.linkedin.com/in/nithinpoolareddy/",
    twitter: "https://x.com/nithinreddyp",
    mailto: "mailto:hello@nithin.dev",
  },
};

export type ConstructMetadataOptions = {
  title?: string;
  description?: string;
  image?: string | URL | null;
  noIndex?: boolean;
  keywords?: string[];
  canonical?: string;
  type?: "website" | "article" | "profile";
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
};

export const baseUrl = new URL(siteConfig.url);

export function getOgImageUrl(params: Record<string, string | undefined>) {
  const url = new URL(siteConfig.ogImage, siteConfig.url);
  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;
    url.searchParams.set(key, value);
  });
  return url.toString();
}

export function constructMetadata(
  options: ConstructMetadataOptions = {}
): Metadata {
  const {
    title,
    description,
    image,
    noIndex,
    keywords,
    canonical,
    type = "website",
    openGraph,
    twitter,
  } = options;

  const resolvedTitle = title
    ? `${title} · ${siteConfig.name}`
    : siteConfig.title;
  const resolvedDescription = description ?? siteConfig.description;
  const resolvedImage =
    image ?? getOgImageUrl({ title: title ?? siteConfig.name, subtitle: description });

  const robots = noIndex
    ? {
        index: false,
        follow: false,
        nocache: true,
      }
    : {
        index: true,
        follow: true,
      };

  return {
    metadataBase: baseUrl,
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: keywords ?? siteConfig.keywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    alternates: {
      canonical: canonical ?? siteConfig.url,
    },
    icons: {
      icon: [
        { url: '/favicon.ico', type: 'image/x-icon' },
      ],
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
    },
    openGraph: openGraph ?? {
      type,
      url: canonical ?? siteConfig.url,
      title: resolvedTitle,
      description: resolvedDescription,
      siteName: siteConfig.name,
      images: [resolvedImage],
    },
    twitter: twitter ?? {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [resolvedImage],
      creator: "@nithinreddyp",
    },
    robots,
    category: "technology",
  };
}

export function constructSitemapBase(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
