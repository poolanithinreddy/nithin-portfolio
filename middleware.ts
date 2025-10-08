import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: authSecret });
  const { pathname } = request.nextUrl;

  // If user is already authenticated and tries to access /login, redirect to admin
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Protect admin routes - require authentication
  if (pathname.startsWith("/admin") || pathname.startsWith("/blog/new") || pathname.startsWith("/projects/new")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      const callbackPath = pathname + request.nextUrl.search;
      loginUrl.searchParams.set("callbackUrl", callbackPath);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*", 
    "/blog/new", 
    "/projects/new",
    "/login"
  ],
};
