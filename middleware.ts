import { rateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/api/:path*"],
};

export function middleware(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "anonymous";

  const pathname = req.nextUrl.pathname;
  const isExportRoute = /^\/api\/record\/[^/]+\/export$/.test(pathname);

  // 🔒 Strict routes
  if (pathname.startsWith("/api/auth")) {
    const { success } = rateLimit(ip, 30, 60_000); // 30/min
    if (!success) {
      return NextResponse.json(
        { error: "Too many auth attempts" },
        { status: 429 },
      );
    }
  }

  // 📤 Export routes
  else if (isExportRoute) {
    const { success } = rateLimit(ip, 5, 60_000);
    if (!success) {
      return NextResponse.json(
        { error: "Export rate limit exceeded" },
        { status: 429 },
      );
    }
  }

  // 🌐 Default for all other API routes
  else {
    const { success } = rateLimit(ip, 100, 60_000); // 100/min
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  return NextResponse.next();
}
