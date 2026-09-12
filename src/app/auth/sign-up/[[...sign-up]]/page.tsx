import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata = {
  title: "Sign up",
  description: "Create your EchoBound architect account.",
};

const AFTER_AUTH = "/city";

export default async function SignUpPage() {
  const { userId } = await auth();
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
