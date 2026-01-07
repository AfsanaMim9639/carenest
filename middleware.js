// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // ✅ Pass pathname to layout via headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);

  // Define protected routes
  const protectedRoutes = [
    "/my-bookings",
    "/profile",
    "/dashboard",
    "/orders",
    "/settings",
  ];

  // Define auth routes
  const authRoutes = ["/login", "/auth/register"];

  // ✅ Define admin routes
  const adminRoutes = ["/admin"];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

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

  // ✅ Protect admin routes - only admins can access
  if (isAdminRoute) {
    if (!token) {
      // Not logged in - redirect to login
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    
    if (token.role !== "admin") {
      // Logged in but not admin - redirect to home
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ✅ Return response with custom header
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Protected routes
    "/my-bookings/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
    "/orders/:path*",
    "/settings/:path*",
    // Auth routes
    "/login",
    "/auth/register",
    // ✅ Admin routes
    "/admin/:path*",
  ],
};