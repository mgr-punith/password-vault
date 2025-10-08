import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";

const protectedPaths = ["/vault", "/api/vault"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("vault_session12345")?.value;

  let verifiedToken = null;
  if (token) {
    try {
      verifiedToken = await verifyAuth(token);
    } catch (err) {
      console.error("Token verification failed:", err);
    }
  }

  const isProtectedRoute = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !verifiedToken) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else {
      const loginUrl = new URL("/auth/login", request.nextUrl.origin);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth|auth).*)"],
};
