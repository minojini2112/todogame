"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isSfxControl, playSfx, preloadSfx } from "@/lib/sfx";

function isIntroPath(pathname: string | null) {
  return pathname === "/intro" || Boolean(pathname?.startsWith("/intro/"));
}

export function SfxProvider() {
  const pathname = usePathname();

  useEffect(() => {
    preloadSfx();

    function onClick(event: MouseEvent) {
      if (event.button !== 0) {
        return;
      }
      if (isIntroPath(pathname)) {
        return;
      }
      if (!isSfxControl(event.target)) {
        return;
      }
      playSfx("click");
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return null;
}
