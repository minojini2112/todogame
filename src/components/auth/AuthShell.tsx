import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-void px-4 py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% -15%, rgba(85,230,255,0.14), transparent 55%), radial-gradient(ellipse 50% 45% at 110% 90%, rgba(157,123,255,0.1), transparent 50%), radial-gradient(ellipse 40% 35% at -10% 70%, rgba(255,200,87,0.07), transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="bg-world-grid pointer-events-none absolute inset-0 opacity-25"
      />

      <div className="relative z-10 w-full max-w-[680px]">
        <section className="rounded-[28px] border border-white/10 bg-[rgba(13,28,45,0.94)] px-10 py-8 shadow-[0_24px_80px_rgba(7,17,31,0.6)] backdrop-blur-xl sm:px-12 sm:py-9">
          <header className="mb-7 text-center">
            <div className="flex justify-center">
              <BrandLogo href="/" size="md" tone="ink" priority />
            </div>
            <h1 className="mt-4 font-display text-[1.65rem] leading-none tracking-[0.03em] text-ink">
              {title}
            </h1>
            <p className="mt-2 text-[15px] leading-6 text-muted">{subtitle}</p>
          </header>

          <div className="auth-form">{children}</div>
        </section>

        <p className="mt-5 text-center text-sm text-muted/80">
          <Link href="/" className="transition hover:text-heartlight">
            ← Back to splash
          </Link>
        </p>
      </div>
    </main>
  );
}
