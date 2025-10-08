export const runtime = "edge";

export function GET() {
  return new Response("OG variants available via /opengraph-image", {
    status: 404,
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
