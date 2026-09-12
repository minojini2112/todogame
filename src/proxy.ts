import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const hasClerkKeys =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

const isProtectedRoute = createRouteMatcher(["/city(.*)", "/board(.*)", "/vault(.*)"]);

const withClerk = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: new URL("/auth", req.url).toString(),
    });
  }
});

function redirectProtectedToAuth(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (path.startsWith("/city") || path.startsWith("/board") || path.startsWith("/vault")) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }
  return NextResponse.next();
}

export const proxy = hasClerkKeys ? withClerk : redirectProtectedToAuth;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp3)).*)",
    "/(api|trpc)(.*)",
  ],
};
