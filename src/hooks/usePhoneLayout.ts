"use client";

import { useEffect, useState } from "react";

const PHONE_QUERY = "(hover: none) and (pointer: coarse) and (max-width: 1024px)";

export function usePhoneLayout() {
  const [phone, setPhone] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(PHONE_QUERY);
    const sync = () => setPhone(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return phone;
}
