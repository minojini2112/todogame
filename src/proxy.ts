import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/city(.*)", "/board(.*)", "/vault(.*)", "/ranks(.*)"]);

const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() ||
  process.env.CLERK_PUBLISHABLE_KEY?.trim() ||
  "";
const secretKey = process.env.CLERK_SECRET_KEY?.trim() || "";

/**
 * Must export clerkMiddleware() directly (do not wrap) or auth() fails with
 * "can't detect usage of clerkMiddleware()".
 */
export const proxy = publishableKey
  ? clerkMiddleware(
      async (auth, req) => {
        if (isProtectedRoute(req)) {
          await auth.protect({
            unauthenticatedUrl: new URL("/auth", req.url).toString(),
          });
        }
      },
      {
        publishableKey,
        secretKey: secretKey || undefined,
      },
    )
  : () => NextResponse.next();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp3)).*)",
    "/(api|trpc)(.*)",
  ],
};
