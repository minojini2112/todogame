"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AerinDialogue } from "@/components/prologue/AerinDialogue";
import { Dialogue } from "@/components/prologue/Dialogue";
import { ArrivalScene } from "@/components/prologue/scenes/ArrivalScene";
import { BlackoutScene } from "@/components/prologue/scenes/BlackoutScene";
import { CityRevealScene } from "@/components/prologue/scenes/CityRevealScene";
import { EndingScene } from "@/components/prologue/scenes/EndingScene";
import { HopeScene } from "@/components/prologue/scenes/HopeScene";
import { MeetScene } from "@/components/prologue/scenes/MeetScene";
import { PurposeScene } from "@/components/prologue/scenes/PurposeScene";
import { RestoreScene } from "@/components/prologue/scenes/RestoreScene";
import { SpiritSelectScene } from "@/components/prologue/scenes/SpiritSelectScene";
import { TeachScene } from "@/components/prologue/scenes/TeachScene";
import { WakeUpScene } from "@/components/prologue/scenes/WakeUpScene";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  getPrologueMusic,
  setPrologueMusicMuted,
  startPrologueMusic,
  stopPrologueMusic,
} from "@/lib/prologue/audio";
import { PROLOGUE_SCENES } from "@/lib/prologue/script";

export default function Prologue() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const advancingRef = useRef(false);
  const nextRef = useRef<() => void>(() => undefined);

  const scene = PROLOGUE_SCENES[sceneIndex];
  const line = scene.lines[Math.min(lineIndex, Math.max(scene.lines.length - 1, 0))];
  const isLastScene = sceneIndex >= PROLOGUE_SCENES.length - 1;
  const isLastLine = lineIndex >= scene.lines.length - 1;
  const isAureliaBeat = scene.id === "city" || scene.id === "hope";

  const nextLabel =
    scene.nextLabel && isLastLine
      ? scene.nextLabel
      : isLastScene && isLastLine
        ? "Begin Journey →"
        : "Next →";

  useEffect(() => {
    startPrologueMusic();
    return () => {
      stopPrologueMusic();
    };
  }, []);

  useEffect(() => {
    setPrologueMusicMuted(muted);
  }, [muted]);

  useEffect(() => {
    advancingRef.current = false;
  }, [sceneIndex]);

  function ensureMusic() {
    if (muted) {
      return;
    }
    const audio = getPrologueMusic() ?? startPrologueMusic();
    if (audio?.paused) {
      void audio.play().catch(() => undefined);
    }
  }

  function finish() {
    stopPrologueMusic();
    router.push("/auth");
  }

  function goNextScene() {
    if (advancingRef.current) {
      return;
    }
    advancingRef.current = true;

    if (isLastScene) {
      finish();
      return;
    }

    setSceneIndex((prev) => prev + 1);
    setLineIndex(0);
  }

  function next() {
    ensureMusic();

    if (scene.hideDialogue) {
      goNextScene();
      return;
    }

    if (!isLastLine) {
      setLineIndex((prev) => prev + 1);
      return;
    }

    goNextScene();
  }

  useEffect(() => {
    nextRef.current = next;
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" || event.repeat) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      nextRef.current();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#07111F]">
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          className="absolute inset-0"
          initial={
            reduced || scene.id === "wakeup" || scene.id === "arrival"
              ? { opacity: 1 }
              : { opacity: 0 }
          }
          animate={{ opacity: 1 }}
          exit={
            reduced || scene.id === "blackout"
              ? { opacity: 0, transition: { duration: 0 } }
              : { opacity: 0 }
          }
          transition={{ duration: reduced ? 0.15 : 0.55, ease: "easeOut" }}
        >
          {scene.id === "blackout" ? <BlackoutScene /> : null}
          {scene.id === "wakeup" ? <WakeUpScene lineIndex={lineIndex} /> : null}
          {scene.id === "city" ? <CityRevealScene /> : null}
          {scene.id === "hope" ? <HopeScene lineIndex={lineIndex} /> : null}
          {scene.id === "arrival" ? <ArrivalScene onComplete={goNextScene} /> : null}
          {scene.id === "meet" ? <MeetScene /> : null}
          {scene.id === "teach" ? <TeachScene lineIndex={lineIndex} /> : null}
          {scene.id === "restore" ? <RestoreScene lineIndex={lineIndex} /> : null}
          {scene.id === "purpose" ? <PurposeScene /> : null}
          {scene.id === "spirit" ? <SpiritSelectScene lineIndex={lineIndex} /> : null}
          {scene.id === "ending" ? <EndingScene /> : null}
        </motion.div>
      </AnimatePresence>

      {!scene.hideDialogue && line ? (
        line.speaker === "Aerin" ? (
          <AerinDialogue
            text={line.text}
            onNext={next}
            nextLabel={nextLabel}
            compact={
              scene.id === "teach" ||
              scene.id === "restore" ||
              scene.id === "purpose"
            }
          />
        ) : (
          <Dialogue
            text={line.text}
            speaker={line.speaker}
            onNext={next}
            nextLabel={nextLabel}
            centered={isAureliaBeat}
          />
        )
      ) : null}

      <div className="absolute right-4 top-4 z-50 flex items-center gap-2 sm:right-6 sm:top-6">
        <button
          type="button"
          onClick={() => {
            ensureMusic();
            setMuted((value) => !value);
          }}
          className="rounded-full border border-white/20 bg-black/30 px-3 py-2 text-xs tracking-[0.16em] text-white uppercase backdrop-blur-md"
          aria-pressed={muted}
        >
          {muted ? "Unmute" : "Mute"}
        </button>
        <button
          type="button"
          onClick={finish}
          className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs tracking-[0.16em] text-white uppercase backdrop-blur-md"
        >
          Skip Intro
        </button>
      </div>
    </main>
  );
}
