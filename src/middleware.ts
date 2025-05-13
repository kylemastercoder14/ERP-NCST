// middleware.ts
import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  const url = new URL(request.url);

  // Skip for maintenance page, API routes, and static files
  if (
    url.pathname.startsWith("/maintenance") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/superadmin")
  ) {
    return NextResponse.next();
  }

  try {
    // Fetch maintenance status from API route
    const maintenanceStatus = await fetch(
      new URL("/api/admin/maintenance-status", request.url)
    ).then((res) => res.json());

    if (maintenanceStatus.maintenanceMode) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  } catch (error) {
    console.error("Error checking maintenance status:", error);
    // Fail open - don't block access if we can't check status
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
