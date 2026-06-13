import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/firebase/constants";

const PROTECTED_PREFIXES = ["/account"];
const PUBLIC_ACCOUNT_PATHS = ["/account/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) return NextResponse.next();

  const isPublicAccount = PUBLIC_ACCOUNT_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  if (isPublicAccount) return NextResponse.next();

  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (session) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/account/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/account/:path*"],
};
