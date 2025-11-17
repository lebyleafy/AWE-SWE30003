import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  // 1. Protect admin routes
  if (pathname.startsWith("/admin")) {
    // If NOT logged in → redirect to sign-in
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // If logged in BUT not admin → redirect home
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// The routes to protect
export const config = {
  matcher: ["/admin/:path*"],
};
