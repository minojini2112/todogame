import { cn } from "@/lib/cn";

type CompassMarkProps = {
  className?: string;
  spinning?: boolean;
};

export function CompassMark({ className, spinning = false }: CompassMarkProps) {
  return (
    <span
      className={cn("relative inline-flex size-16 items-center justify-center", className)}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 80 80"
        className={cn(
          "absolute inset-0 size-full text-white",
          spinning && "animate-[spin_4s_linear_infinite] motion-reduce:animate-none",
        )}
      >
        <circle cx="40" cy="40" r="16" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.85" />
        <circle cx="40" cy="40" r="11" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.45" />
        <path d="M40 4 L42.4 24 L40 22.4 L37.6 24 Z" fill="currentColor" />
        <path d="M40 76 L37.6 56 L40 57.6 L42.4 56 Z" fill="currentColor" />
        <path d="M4 40 L24 37.6 L22.4 40 L24 42.4 Z" fill="currentColor" />
        <path d="M76 40 L56 42.4 L57.6 40 L56 37.6 Z" fill="currentColor" />
        <path d="M40 8 V18" stroke="currentColor" strokeWidth="0.6" />
        <path d="M40 62 V72" stroke="currentColor" strokeWidth="0.6" />
        <path d="M8 40 H18" stroke="currentColor" strokeWidth="0.6" />
        <path d="M62 40 H72" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="40" cy="8.5" r="0.9" fill="currentColor" />
        <circle cx="40" cy="71.5" r="0.9" fill="currentColor" />
        <circle cx="8.5" cy="40" r="0.9" fill="currentColor" />
        <circle cx="71.5" cy="40" r="0.9" fill="currentColor" />
      </svg>
      <span className="font-splash text-lg tracking-[0.12em] text-white">E</span>
    </span>
  );
}
