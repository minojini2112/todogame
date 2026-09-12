import { CompassMark } from "@/components/intro/CompassMark";
import { cn } from "@/lib/cn";

type BootLoaderProps = {
  progress?: number;
  className?: string;
};

export function BootLoader({ progress, className }: BootLoaderProps) {
  const determinate = typeof progress === "number";
  const width = determinate ? Math.min(100, Math.max(0, progress)) : 40;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center text-white",
        className,
      )}
    >
      <CompassMark spinning className="size-20" />
      <p className="font-splash mt-6 text-3xl tracking-[0.42em] sm:text-4xl">
        ECHOBOUND
      </p>
      <div
        className="mt-8 h-px w-44 overflow-hidden bg-white/25"
        role="progressbar"
        aria-label="Loading EchoBound"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={determinate ? Math.round(width) : undefined}
      >
        <div
          className={cn(
            "h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.55)]",
            !determinate && "animate-pulse motion-reduce:animate-none",
          )}
          style={{ width: `${width}%` }}
        />
      </div>
      <p className="mt-4 font-splash text-[11px] tracking-[0.38em] text-white/70">
        Loading
      </p>
    </div>
  );
}
