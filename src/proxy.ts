import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Check for session cookie (NextAuth uses this pattern)
  const sessionCookie = request.cookies.get("authjs.session-token") 
    || request.cookies.get("__Secure-authjs.session-token"); // Production uses __Secure- prefix
  
  const isAuthenticated = !!sessionCookie;

  // Not authenticated and trying to access protected route → redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Authenticated and on login page → redirect to dashboard
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Match all routes except API, static files, etc.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};