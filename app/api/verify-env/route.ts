import { NextResponse } from 'next/server';

export async function GET() {
  // This function runs on the Vercel server
  const databaseUrl = process.env.DATABASE_URL || "DATABASE_URL is NOT set";
  const directUrl = process.env.DIRECT_URL || "DIRECT_URL is NOT set";

  // This helper function safely extracts parts of the URL without the password
  const getUrlInfo = (url: string) => {
    if (!url.includes("://")) return { error: "Invalid format or not set", value: url };
    try {
        const [protocol, rest] = url.split("://");
        const [credentials, hostpart] = rest.split("@");
        const [username] = credentials.split(":");
        return {
          protocol,
          username,
          host: hostpart,
        };
    // The change is on the next line:
    } catch {
        return { error: "Could not parse URL", value: url }
    }
  };

  return NextResponse.json({
    message: "These are the environment variables the Vercel server is actually using:",
    DATABASE_URL_INFO: getUrlInfo(databaseUrl),
    DIRECT_URL_INFO: getUrlInfo(directUrl),
  });
}