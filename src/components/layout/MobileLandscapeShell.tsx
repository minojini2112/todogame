"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const PHONE_QUERY = "(hover: none) and (pointer: coarse) and (max-width: 1024px)";
const PORTRAIT_QUERY = "(orientation: portrait)";

type MobileLandscapeShellProps = {
  children: ReactNode;
  hint?: string;
  overlayAction?: ReactNode;
  className?: string;
};

export function MobileLandscapeShell({
  children,
  hint = "Turn your phone sideways",
  overlayAction,
  className,
}: MobileLandscapeShellProps) {
  const [showRotate, setShowRotate] = useState(false);

  useEffect(() => {
    const phone = window.matchMedia(PHONE_QUERY);
    const portrait = window.matchMedia(PORTRAIT_QUERY);

    function sync() {
      const locked = phone.matches;
      const rotate = locked && portrait.matches;
      setShowRotate(rotate);
      document.documentElement.classList.toggle("mobile-landscape-page", locked);
    }

    sync();
    phone.addEventListener("change", sync);
    portrait.addEventListener("change", sync);
    return () => {
      phone.removeEventListener("change", sync);
      portrait.removeEventListener("change", sync);
      document.documentElement.classList.remove("mobile-landscape-page");
    };
  }, []);

  function tryLockLandscape() {
    const orientation = window.screen?.orientation as
      | { lock?: (type: string) => Promise<void> }
      | undefined;
    if (typeof orientation?.lock !== "function") {
      return;
    }
    void orientation.lock("landscape").catch(() => undefined);
  }

  return (
    <div
      className={cn(
        "relative h-dvh w-full overflow-hidden",
        className,
      )}
    >
      {children}
      {showRotate ? (
        <div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#07111F] px-8 text-center"
          role="dialog"
          aria-modal="true"
          aria-label={hint}
          onClick={tryLockLandscape}
        >
          <span
            aria-hidden="true"
            className="mb-6 block size-16 rounded-[14px] border-2 border-white/70 shadow-[0_0_24px_rgba(85,230,255,0.25)] animate-pulse"
            style={{
              width: "2.75rem",
              height: "4.25rem",
            }}
          />
          <p className="font-splash text-2xl tracking-[0.18em] text-white uppercase">
            Landscape
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">{hint}</p>
          {overlayAction ? <div className="mt-8">{overlayAction}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
