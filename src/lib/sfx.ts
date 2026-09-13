export const SFX = {
  click: "/audio/button_click.mp3",
  added: "/audio/task_added.mp3",
  completed: "/audio/task_completed.wav",
} as const;

export type SfxName = keyof typeof SFX;

const volumes: Record<SfxName, number> = {
  click: 0.4,
  added: 0.55,
  completed: 0.6,
};

export function playSfx(name: SfxName) {
  if (typeof window === "undefined") {
    return;
  }

  const audio = new Audio(SFX[name]);
  audio.volume = volumes[name];
  void audio.play().catch(() => undefined);
}

export function preloadSfx() {
  if (typeof window === "undefined") {
    return;
  }

  for (const src of Object.values(SFX)) {
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = src;
  }
}

export function isSfxControl(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }

  if (target.closest("[data-sfx='off']")) {
    return false;
  }

  const control = target.closest(
    "button, [role='button'], input[type='submit'], input[type='button'], input[type='reset'], [data-sfx='click']",
  );

  if (!control) {
    return false;
  }

  if (control instanceof HTMLButtonElement && control.disabled) {
    return false;
  }

  if (control instanceof HTMLInputElement && control.disabled) {
    return false;
  }

  return true;
}
