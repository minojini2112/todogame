import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/clerk";

const isProtectedRoute = createRouteMatcher(["/city(.*)", "/board(.*)", "/vault(.*)", "/ranks(.*)"]);

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: new URL("/auth", req.url).toString(),
    });
  }
});

/** Skip Clerk when keys are missing (e.g. misconfigured Vercel env) so the site doesn't 500. */
export const proxy = isClerkConfigured
  ? clerkHandler
  : () => NextResponse.next();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp3)).*)",
    "/(api|trpc)(.*)",
  ],
};
