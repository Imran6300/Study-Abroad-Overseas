/**
 * middleware.ts
 *
 * Next.js Edge Middleware — runs before every request matching the config below.
 *
 * Responsibilities:
 *   1. Read the "token" httpOnly cookie.
 *   2. Decode the JWT payload (no signature verification — Edge Runtime only;
 *      full verification still happens on every API hit via requireAuth).
 *   3. If the user is accessing a dashboard route that doesn't match their role,
 *      redirect them to their correct dashboard (getDashboardPath).
 *   4. If they are not authenticated and trying to access a protected route,
 *      redirect to /login.
 *   5. If they ARE authenticated and hit /login or /signup, redirect to their
 *      dashboard.
 *
 * NOTE: This is SUPPLEMENTARY protection — the real guard is inside each
 * dashboard layout (client-side, catches hydration edge cases) and inside every
 * backend API route (requireAuth + role check).
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Role → dashboard path (must mirror lib/roleRouting.js) ─────────────────
const ROLE_DASHBOARD: Record<string, string> = {
  super_admin: "/dashboard/admin-dashboard",
  admin: "/dashboard/org-admin",
  counselor: "/dashboard/counselor-dashboard",
  editor: "/admin/universities",
  user: "/dashboard/user",
};

/** Protected prefixes that require authentication */
const PROTECTED = [
  "/dashboard/",
  "/admin/",
];

/** Auth pages — redirect to dashboard if already logged in */
const AUTH_PAGES = ["/login", "/signup", "/forgot-password"];

// ─── Decode JWT payload (base64url, no verification) ────────────────────────
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // base64url → base64 → decode
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next.js internals and static files
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") // static assets
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value ?? null;
  const payload = token ? decodeJwtPayload(token) : null;
  const role = typeof payload?.role === "string" ? payload.role : null;

  // Treat expired tokens as unauthenticated
  const isAuthenticated =
    payload !== null &&
    (typeof payload.exp !== "number" || payload.exp * 1000 > Date.now());

  const isProtected = PROTECTED.some((prefix) => pathname.startsWith(prefix));
  const isAuthPage = AUTH_PAGES.some(
    (page) => pathname === page || pathname.startsWith(page + "?"),
  );

  // ── 1. Unauthenticated → protected route ────────────────────────────────
  if (!isAuthenticated && isProtected) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ── 2. Authenticated → auth page (login/signup) ─────────────────────────
  if (isAuthenticated && isAuthPage && role) {
    const dashPath = ROLE_DASHBOARD[role] ?? "/";
    return NextResponse.redirect(new URL(dashPath, req.url));
  }

  // ── 3. Authenticated → wrong dashboard ──────────────────────────────────
  if (isAuthenticated && isProtected && role) {
    const correctDash = ROLE_DASHBOARD[role];

    // Check if pathname is inside a dashboard segment that is NOT theirs
    const dashboardSegments = [
      "/dashboard/admin-dashboard",
      "/dashboard/org-admin",
      "/dashboard/counselor-dashboard",
      "/dashboard/user",
      "/admin",
    ];

    for (const seg of dashboardSegments) {
      if (pathname.startsWith(seg) && correctDash && !pathname.startsWith(correctDash)) {
        return NextResponse.redirect(new URL(correctDash, req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap|images|fonts|icons).*)",
  ],
};
