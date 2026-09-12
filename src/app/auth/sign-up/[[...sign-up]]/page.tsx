import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { getOptionalUserId } from "@/lib/clerk-auth";
import { isClerkConfigured } from "@/lib/clerk";

export const metadata = {
  title: "Sign up",
  description: "Create your EchoBound architect account.",
};

const AFTER_AUTH = "/city";

export default async function SignUpPage() {
  if (!isClerkConfigured) {
    redirect("/");
  }

  const userId = await getOptionalUserId();
  if (userId) {
    redirect(AFTER_AUTH);
  }

  return (
    <AuthShell
      title="Bind Your Echo"
      subtitle="Create an account to begin your journey into Aurelia."
    >
      <SignUp
        appearance={clerkAppearance}
        routing="path"
        path="/auth/sign-up"
        signInUrl="/auth"
        forceRedirectUrl={AFTER_AUTH}
        fallbackRedirectUrl={AFTER_AUTH}
      />
    </AuthShell>
  );
}
