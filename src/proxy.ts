import { NextResponse, type NextRequest } from "next/server";

// Optimistic check only: the session itself is validated by the API and the socket server.
export function proxy(request: NextRequest) {
  if (!request.cookies.has("ttt_session")) {
    const url = new URL("/", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/lobby/:path*", "/room/:path*", "/avatar/:path*"],
};
