import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

const PROTECTED = ["/admin", "/creator"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some((path) => pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin routes require ADMIN role
  if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Creator routes require CREATOR or ADMIN role
  if (
    pathname.startsWith("/creator") &&
    !["CREATOR", "ADMIN"].includes(payload.role)
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/creator/:path*"],
};
