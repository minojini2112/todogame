let shared: HTMLAudioElement | null = null;

export function startPrologueMusic() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!shared) {
    shared = new Audio("/audio/prologue.mp3");
    shared.loop = true;
    shared.volume = 0.35;
  }

  void shared.play().catch(() => undefined);
  return shared;
}

export function getPrologueMusic() {
  return shared;
}

export function stopPrologueMusic() {
  if (!shared) {
    return;
  }
  shared.pause();
  shared.currentTime = 0;
}

export function setPrologueMusicMuted(muted: boolean) {
  if (!shared) {
    return;
  }
  shared.muted = muted;
}
