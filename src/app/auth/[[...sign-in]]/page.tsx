import { AuthenticateWithRedirectCallback, SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { getOptionalUserId } from "@/lib/clerk-auth";
import { isClerkConfigured } from "@/lib/clerk";

export const metadata = {
  title: "Sign in",
  description: "Authenticate to enter Aurelia.",
};

export const dynamic = "force-dynamic";

const AFTER_AUTH = "/city";

type AuthPageProps = {
  params: Promise<{ "sign-in"?: string[] }>;
};

export default async function AuthPage({ params }: AuthPageProps) {
  if (!isClerkConfigured) {
    redirect("/");
  }

  const userId = await getOptionalUserId();
  if (userId) {
    redirect(AFTER_AUTH);
  }

  const segments = (await params)["sign-in"] ?? [];
  const isSsoCallback = segments[0] === "sso-callback";

  if (isSsoCallback) {
    return (
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl={AFTER_AUTH}
        signUpForceRedirectUrl={AFTER_AUTH}
        signInFallbackRedirectUrl={AFTER_AUTH}
        signUpFallbackRedirectUrl={AFTER_AUTH}
      />
    );
  }

  return (
    <AuthShell
      title="Wake the Signal"
      subtitle="Sign in to continue restoring Aurelia."
    >
      <SignIn
        appearance={clerkAppearance}
        routing="path"
        path="/auth"
        signUpUrl="/auth/sign-up"
        forceRedirectUrl={AFTER_AUTH}
        fallbackRedirectUrl={AFTER_AUTH}
      />
    </AuthShell>
  );
}
