"use client";

import Link from "next/link";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ButtonSize, ButtonVariant } from "@/types/game";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-healing text-void shadow-[0_0_24px_rgba(114,241,184,0.22)] hover:bg-[#8ff6c8]",
  secondary:
    "border border-white/15 bg-white/5 text-ink hover:border-heartlight/40 hover:bg-heartlight/10",
  ghost: "text-muted hover:bg-white/5 hover:text-ink",
  gold: "bg-cure text-void shadow-[0_0_24px_rgba(255,200,87,0.22)] hover:bg-[#ffd57a]",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs tracking-[0.16em]",
  md: "h-11 px-5 text-sm tracking-[0.18em]",
  lg: "h-12 px-6 text-sm tracking-[0.2em]",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold uppercase transition-[transform,color,background-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95 disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100";

type GameButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

export const GameButton = forwardRef<HTMLButtonElement, GameButtonProps>(
  function GameButton(
    {
      children,
      variant = "primary",
      size = "md",
      className,
      href,
      type = "button",
      disabled,
      onClick,
    },
    ref,
  ) {
    const classes = cn(baseClass, variantClass[variant], sizeClass[size], className);

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={classes}
      >
        {children}
      </button>
    );
  },
);
