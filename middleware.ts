import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "ilab_access";

const PUBLIC_PATHS = ["/login", "/api/login", "/logo-icon.png", "/logo.png"];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return true;
  }
  if (pathname.startsWith("/_next/") || pathname.startsWith("/favicon")) {
    return true;
  }
  return false;
}

function customerCanAccess(pathname: string, customerReportId: string): boolean {
  if (pathname === `/reports/${customerReportId}`) return true;
  if (pathname === "/api/chat") return true;
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  const cookie = req.cookies.get(COOKIE_NAME)?.value;

  if (cookie === "internal") {
    return NextResponse.next();
  }

  if (cookie === "customer") {
    const customerReportId = process.env.CUSTOMER_REPORT_ID ?? "";
    if (customerReportId && customerCanAccess(pathname, customerReportId)) {
      return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    url.pathname = `/reports/${customerReportId}`;
    return NextResponse.redirect(url);
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
