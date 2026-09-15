import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const publicPaths = [
  "/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow Next.js internal files and NextAuth APIs
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // ==========================================
  // CHECK NEXTAUTH SESSION
  // ==========================================

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ==========================================
  // PUBLIC ROUTES
  // ==========================================

  const isPublicPath =
    publicPaths.includes(pathname) ||
    publicPaths.some(
      (path) =>
        path !== "/" && pathname.startsWith(`${path}/`)
    );

  if (isPublicPath) {
    // If already logged in, don't allow auth pages
    if (
      token &&
      (
        pathname === "/sign-in" ||
        pathname === "/sign-up" ||
        pathname === "/forgot-password" ||
        pathname === "/reset-password" ||
        pathname === "/verify-email"
      )
    ) {
      return NextResponse.redirect(
        new URL("/assistant/jarvis", req.url)
      );
    }

    return NextResponse.next();
  }

  // ==========================================
  // PROTECTED ROUTES
  // ==========================================

  const isProtectedPath =
    pathname.startsWith("/assistant") ||
    pathname.startsWith("/customize");

  // ==========================================
  // NOT AUTHORIZED → SIGN IN
  // ==========================================

  if (isProtectedPath && !token) {
    const signInUrl = new URL("/sign-in", req.url);

    // Remember the page user tried to access
    signInUrl.searchParams.set(
      "callbackUrl",
      pathname
    );

    return NextResponse.redirect(signInUrl);
  }

  // Authorized user
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};