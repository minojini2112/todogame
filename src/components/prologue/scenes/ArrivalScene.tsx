"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ArrivalSceneProps = {
  onComplete: () => void;
};

export function ArrivalScene({ onComplete }: ArrivalSceneProps) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  function complete() {
    if (doneRef.current) {
      return;
    }
    doneRef.current = true;
    onCompleteRef.current();
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (reduced) {
      const timer = window.setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true;
          onCompleteRef.current();
        }
      }, 900);
      return () => window.clearTimeout(timer);
    }

    void video.play().catch(() => undefined);
  }, [reduced]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        src="/assets/prologue/spirit/creature_flying_no_logo.mp4"
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
        preload="auto"
        onEnded={complete}
        onError={complete}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />

      <div className="absolute inset-x-0 bottom-8 z-30 flex justify-center px-6">
        <button
          type="button"
          onClick={complete}
          className="rounded-full border border-white/25 bg-black/40 px-6 py-3 font-display text-xs tracking-[0.22em] text-white/80 uppercase backdrop-blur-md"
        >
          Skip flight →
        </button>
      </div>
    </motion.div>
  );
}
