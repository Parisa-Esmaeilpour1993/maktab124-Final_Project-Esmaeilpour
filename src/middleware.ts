import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const loginAuthToken = request.cookies.get("loginAuthToken")?.value;

  if (request.nextUrl.pathname === "/login" && loginAuthToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login"],
};
