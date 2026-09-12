import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/assets/Logo.jpeg";

type BrandLogoProps = {
  href?: string | null;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  tone?: "city" | "sanctum" | "ink";
  className?: string;
  priority?: boolean;
};

const sizeMap = {
  sm: { box: "h-8 w-8", word: "text-[11px] tracking-[0.28em]" },
  md: { box: "h-10 w-10", word: "text-xs tracking-[0.3em]" },
  lg: { box: "h-14 w-14", word: "text-sm tracking-[0.32em]" },
} as const;

const toneMap = {
  city: "text-heartlight text-glow-cyan",
  sanctum: "text-[var(--sanctum-gold)] text-glow-gold",
  ink: "text-heartlight",
} as const;

export function BrandLogo({
  href = "/",
  size = "sm",
  showWordmark = true,
  tone = "city",
  className,
  priority = false,
}: BrandLogoProps) {
  const dims = sizeMap[size];

  const mark = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full border border-white/15 bg-black/50 shadow-[0_0_18px_rgba(85,230,255,0.22)]",
          dims.box,
        )}
      >
        <Image
          src={LOGO_SRC}
          alt={showWordmark ? "" : "EchoBound"}
          fill
          priority={priority}
          sizes="56px"
          className="object-cover object-center"
        />
      </span>
      {showWordmark ? (
        <span className={cn("font-splash uppercase", dims.word, toneMap[tone])}>
          EchoBound
        </span>
      ) : null}
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} className="inline-flex transition hover:opacity-90" aria-label="EchoBound home">
      {mark}
    </Link>
  );
}

export { LOGO_SRC };
