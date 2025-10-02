import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, errors } from "jose";

// Route definitions
const publicAuthRoutes = ["/auth/login", "/auth/register"];
const protectedUserRoutes = ["/dashboard", "/download", "/my-order"];
const adminRoutes = ["/admin"];
const publicRoutes = ["/", "/about", "/contact"]; // Add other public routes as needed

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables.");
  }
  return new TextEncoder().encode(secret);
};

// Helper function to create redirect response with cookie cleanup
const createRedirectWithCleanup = (url: string, request: NextRequest) => {
  const response = NextResponse.redirect(new URL(url, request.url));
  response.cookies.delete("accessToken");
  return response;
};

// Helper function to check route types
const getRouteType = (pathname: string) => {
  const isPublicAuthRoute = publicAuthRoutes.includes(pathname);
  const isUserRoute = protectedUserRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathname === route || (route !== "/" && pathname.startsWith(route))
  );

  return { isPublicAuthRoute, isUserRoute, isAdminRoute, isPublicRoute };
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const { isPublicAuthRoute, isUserRoute, isAdminRoute, isPublicRoute } =
    getRouteType(pathname);

  // Handle routes that don't require authentication
  if (isPublicRoute || isPublicAuthRoute) {
    // If user is already logged in and tries to access auth routes, redirect based on role
    if (isPublicAuthRoute && accessToken) {
      try {
        const { payload } = await jwtVerify(accessToken, getJwtSecretKey());
        const role = payload.role as string | undefined;

        if (role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin", request.url));
        } else if (role) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch (err) {
        // Invalid token, let them access auth routes
        const response = NextResponse.next();
        response.cookies.delete("accessToken");
        return response;
      }
    }

    return NextResponse.next();
  }

  // Handle protected routes without token
  if (!accessToken) {
    if (isUserRoute || isAdminRoute) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  // Verify and handle token
  try {
    const { payload } = await jwtVerify(accessToken, getJwtSecretKey());
    const role = payload.role as string | undefined;

    // Ensure role exists in payload
    if (!role) {
      return createRedirectWithCleanup("/auth/login", request);
    }

    // Role-based access control
    if (role === "ADMIN") {
      // Admin trying to access user routes - redirect to admin dashboard
      if (isUserRoute) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      // Admin accessing admin routes - allow
      if (isAdminRoute) {
        return NextResponse.next();
      }
    } else {
      // Regular user trying to access admin routes - redirect to home
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // Regular user accessing user routes - allow
      if (isUserRoute) {
        return NextResponse.next();
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);

    // Handle different types of errors
    if (err instanceof errors.JWTExpired) {
      console.log("Token expired");
    }

    // For public auth routes, allow access but clean up invalid token
    if (isPublicAuthRoute) {
      const response = NextResponse.next();
      response.cookies.delete("accessToken");
      return response;
    }

    // For protected routes, redirect to login
    return createRedirectWithCleanup("/auth/login", request);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - images (your static images)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     */
    "/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
