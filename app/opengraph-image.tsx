import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/seo";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const gradient = {
  backgroundImage:
    "radial-gradient(at 20% 20%, rgba(59,130,246,0.16) 0, transparent 55%), radial-gradient(at 80% 20%, rgba(34,197,94,0.15) 0, transparent 55%), radial-gradient(at 50% 80%, rgba(14,165,233,0.18) 0, transparent 60%)",
};

export default function Image() {
  const title = siteConfig.name;
  const subtitle = siteConfig.description;

  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: "Inter, Geist, system-ui",
          fontSize: 56,
          fontWeight: 600,
          color: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 96px",
          backgroundColor: "#f8fafc",
          borderRadius: "32px",
          ...gradient,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "#1e3a8a",
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Full-stack · Systems · Reliability
          </span>
          <h1
            style={{
              display: "block",
              fontSize: 72,
              lineHeight: 1.05,
              color: "#0b0f19",
              margin: 0,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 34,
              maxWidth: "780px",
              color: "rgba(15,23,42,0.72)",
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "rgba(15,23,42,0.72)",
          }}
        >
          <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
          <span>nithinreddy03 · github</span>
        </div>
      </div>
    ),
    size
  );
}
