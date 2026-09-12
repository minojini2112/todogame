"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const HOLD_MS = 2000;
const FADE_S = 1.2;

export default function CityArrival() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hold = reduceMotion ? 400 : HOLD_MS;
    const timer = window.setTimeout(() => setVisible(false), hold);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : FADE_S, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-void/35 backdrop-blur-md" />
          <Image
            src="/aurelia/title-fade.png"
            alt="Aurelia is fading. Bring back the light."
            width={1400}
            height={420}
            priority
            className="relative z-10 w-[min(92vw,920px)] h-auto drop-shadow-[0_12px_40px_rgba(7,17,31,0.55)]"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
