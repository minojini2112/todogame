/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { EyeOpenOverlay } from "@/components/prologue/effects/EyeOpenOverlay";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type WakeUpSceneProps = {
  lineIndex?: number;
};

export function WakeUpScene({ lineIndex = 0 }: WakeUpSceneProps) {
  const reduced = useReducedMotion();
  const showHands = lineIndex >= 1;

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* Room is already under the lids — no fade cut */}
      <motion.div
        className="absolute inset-0"
        initial={
          reduced
            ? { scale: 1, filter: "blur(0px) brightness(1)" }
            : { scale: 1.12, filter: "blur(10px) brightness(0.35)" }
        }
        animate={
          reduced
            ? { scale: 1.02, filter: "blur(0px) brightness(1)" }
            : {
                scale: showHands ? 1.04 : 1.02,
                filter: [
                  "blur(10px) brightness(0.35)",
                  "blur(6px) brightness(0.55)",
                  "blur(8px) brightness(0.4)",
                  "blur(3px) brightness(0.75)",
                  "blur(0px) brightness(1)",
                ],
              }
        }
        transition={
          reduced
            ? { duration: 0.2 }
            : {
                filter: {
                  duration: 3.6,
                  times: [0, 0.18, 0.32, 0.42, 1],
                  ease: "easeOut",
                },
                scale: { duration: 8, ease: "easeOut" },
              }
        }
      >
        <img
          src="/assets/prologue/room/room_background.png"
          alt="First-person view of a ruined bedroom, looking toward a broken window"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <motion.img
          src="/assets/prologue/room/light_rays.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-70"
          animate={reduced ? undefined : { opacity: [0.35, 0.75, 0.45, 0.8, 0.65] }}
          transition={{
            duration: 3.6,
            times: [0, 0.18, 0.32, 0.42, 1],
            ease: "easeOut",
          }}
        />
        <motion.img
          src="/assets/prologue/room/dust_particles.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-55"
          animate={
            reduced
              ? undefined
              : { x: [0, 8, -4, 0], y: [0, -12, -6, 0] }
          }
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3.2 }}
        />
      </motion.div>

      {/* Look down at both hands — right plate is masked in, not blend-stacked */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={false}
        animate={{ opacity: showHands ? 1 : 0 }}
        transition={{ duration: reduced ? 0.2 : 1.1, ease: "easeOut" }}
      >
        <img
          src="/assets/prologue/pov/left_hand.png"
          alt="Your left hand reaching into the ruined room"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          src="/assets/prologue/pov/right_hand.png"
          alt="Your right hand reaching into the ruined room"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, transparent 42%, black 58%, black 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, transparent 42%, black 58%, black 100%)",
          }}
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]"
      />

      <EyeOpenOverlay />
    </div>
  );
}
