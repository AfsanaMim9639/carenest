// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Define protected routes - REMOVED /services and /booking
  const protectedRoutes = [
    "/my-bookings",
    "/profile",
    "/dashboard",
    "/orders",
    "/settings",
  ];

  // Define auth routes
  const authRoutes = ["/login", "/auth/register"];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If trying to access auth pages while logged in, redirect to home
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If trying to access protected route without authentication, redirect to login
  if (isProtectedRoute && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes - UPDATED
    "/my-bookings/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
    "/orders/:path*",
    "/settings/:path*",
    // Auth routes
    "/login",
    "/auth/register",
  ],
};