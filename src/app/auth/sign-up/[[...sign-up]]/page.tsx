import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata = {
  title: "Sign up",
  description: "Create your EchoBound architect account.",
};

export default function SignUpPage() {
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
        forceRedirectUrl="/city"
        fallbackRedirectUrl="/city"
      />
    </AuthShell>
  );
}
