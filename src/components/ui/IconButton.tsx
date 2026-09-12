"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type IconButtonProps = {
  label: string;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

export function IconButton({
  label,
  children,
  className,
  type = "button",
  disabled,
  onClick,
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ink transition-[transform,color,background-color,border-color] duration-200 hover:scale-105 hover:border-heartlight/40 hover:bg-heartlight/10 hover:text-heartlight active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100",
        className,
      )}
    >
      {children}
    </button>
  );
}
