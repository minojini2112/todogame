import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata = {
  title: "Sign in",
  description: "Authenticate to enter Aurelia.",
};

export default function AuthPage() {
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
        forceRedirectUrl="/city"
        fallbackRedirectUrl="/city"
      />
    </AuthShell>
  );
}
