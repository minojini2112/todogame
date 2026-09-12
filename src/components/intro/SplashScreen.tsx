"use client";

import { useAuth } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import splashArt from "@/assests/splash_screen.jpeg";
import { AwakenButton } from "@/components/intro/AwakenButton";
import { BootLoader } from "@/components/intro/BootLoader";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isClerkConfigured } from "@/lib/clerk";

export function SplashScreen() {
  if (!isClerkConfigured) {
    return <SplashScreenView isSignedIn={false} isLoaded />;
  }
  return <SplashScreenWithClerk />;
}

function SplashScreenWithClerk() {
  const { isSignedIn, isLoaded } = useAuth();
  return <SplashScreenView isSignedIn={Boolean(isSignedIn)} isLoaded={isLoaded} />;
}

function SplashScreenView({
  isSignedIn,
  isLoaded,
}: {
  isSignedIn: boolean;
  isLoaded: boolean;
}) {
  const reduced = useReducedMotion();
  const [imageReady, setImageReady] = useState(false);
  const [progress, setProgress] = useState(8);
  const [booting, setBooting] = useState(true);

  const journeyHref = isSignedIn ? "/city" : "/intro";

  useEffect(() => {
    const started = performance.now();
    const minimum = reduced ? 250 : 1600;
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - started;
      const timed = Math.min(1, elapsed / minimum);
      const next = imageReady ? timed : Math.min(timed, 0.86);
      setProgress(8 + next * 92);

      if (imageReady && timed >= 1) {
        setProgress(100);
        setBooting(false);
        return;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [imageReady, reduced]);

  return (
    <main
      className="relative h-dvh w-full overflow-hidden bg-[#071018]"
      aria-busy={booting}
      aria-live="polite"
    >
      <Image
        src={splashArt}
        alt="A traveler sits on a cliff at dawn, looking out over Aurelia. EchoBound: Your Tasks. Your Journey. A Brighter Tomorrow."
        fill
        preload
        placeholder="blur"
        quality={90}
        sizes="100vw"
        className="object-cover object-center"
        onLoad={() => setImageReady(true)}
        onError={() => setImageReady(true)}
      />

      <h1 className="sr-only">EchoBound</h1>

      <AnimatePresence>
        {!booting ? (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center px-6"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.6, delay: reduced ? 0 : 0.15 }}
          >
            <AwakenButton
              href={isLoaded ? journeyHref : "/intro"}
              label={isSignedIn ? "Enter Aurelia" : "Start Journey"}
              playMusic={!isSignedIn}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {booting ? (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center bg-[#071018]/70 backdrop-blur-[2px]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.8, ease: "easeOut" }}
          >
            <BootLoader progress={progress} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
