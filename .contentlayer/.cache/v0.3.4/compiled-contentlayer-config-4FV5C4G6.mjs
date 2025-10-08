// contentlayer.config.ts
import { defineDocumentType, defineNestedType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
var Link = defineNestedType(() => ({
  name: "Link",
  fields: {
    title: { type: "string", required: true },
    href: { type: "string", required: true }
  }
}));
var Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `projects/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: true },
    role: { type: "string", required: true },
    stack: { type: "list", of: { type: "string" }, required: true },
    year: { type: "number", required: true },
    featured: { type: "boolean", default: false },
    timeline: { type: "string", required: false },
    stats: { type: "list", of: { type: "string" } },
    links: { type: "list", of: Link }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^projects\//, "")
    },
    url: {
      type: "string",
      resolve: (doc) => `/work/${doc._raw.flattenedPath.replace(/^projects\//, "")}`
    }
  }
}));
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: true },
    publishedAt: { type: "date", required: true },
    tags: { type: "list", of: { type: "string" }, required: false }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^blog\//, "")
    },
    url: {
      type: "string",
      resolve: (doc) => `/blog/${doc._raw.flattenedPath.replace(/^blog\//, "")}`
    }
  }
}));
var Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `pages/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    order: { type: "number", required: false }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^pages\//, "")
    },
    url: {
      type: "string",
      resolve: (doc) => `/${doc._raw.flattenedPath.replace(/^pages\//, "")}`
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Project, Post, Page],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]
  }
});
export {
  Page,
  Post,
  Project,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-4FV5C4G6.mjs.map
