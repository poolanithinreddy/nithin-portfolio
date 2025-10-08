process.env.DATABASE_URL = "postgresql://invalid:invalid@127.0.0.1:5999/db";

async function main() {
  const { GET } = await import("../app/api/projects/route");
  const response = await GET();
  console.log("status", response.status);
  console.log("source", response.headers.get("x-data-source"));
  const text = await response.text();
  console.log("body", text.slice(0, 200));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
