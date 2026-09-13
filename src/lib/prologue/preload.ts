import {
  INTRO_READY_COOKIE,
  PROLOGUE_ASSETS,
  PROLOGUE_AUDIO_ASSETS,
  PROLOGUE_IMAGE_ASSETS,
  PROLOGUE_VIDEO_ASSETS,
} from "@/lib/prologue/assets";

const ASSET_TIMEOUT_MS = 20_000;

function cookieHas(name: string) {
  return document.cookie.split(";").some((part) => part.trim().startsWith(`${name}=`));
}

/** Fresh browser, or a visitor who has never finished an intro preload. */
export function isFirstVisitBrowser() {
  if (typeof document === "undefined") {
    return true;
  }

  return document.cookie.trim() === "" || !cookieHas(INTRO_READY_COOKIE);
}

export function markIntroAssetsReady() {
  if (typeof document === "undefined") {
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${INTRO_READY_COOKIE}=1; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

function withTimeout(promise: Promise<void>, ms: number) {
  return new Promise<void>((resolve) => {
    const timer = window.setTimeout(resolve, ms);
    void promise.finally(() => {
      window.clearTimeout(timer);
      resolve();
    });
  });
}

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    const done = () => resolve();
    image.onload = done;
    image.onerror = done;
    image.src = src;
    if (image.complete && image.naturalWidth > 0) {
      resolve();
      return;
    }
    void image.decode().then(done).catch(done);
  });
}

function preloadVideo(src: string) {
  return new Promise<void>((resolve) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    const done = () => {
      video.removeEventListener("canplaythrough", done);
      video.removeEventListener("error", done);
      resolve();
    };

    video.addEventListener("canplaythrough", done);
    video.addEventListener("error", done);
    video.src = src;
    video.load();
    if (video.readyState >= 3) {
      done();
    }
  });
}

function preloadAudio(src: string) {
  return new Promise<void>((resolve) => {
    const audio = new Audio();
    audio.preload = "auto";

    const done = () => {
      audio.removeEventListener("canplaythrough", done);
      audio.removeEventListener("error", done);
      resolve();
    };

    audio.addEventListener("canplaythrough", done);
    audio.addEventListener("error", done);
    audio.src = src;
    audio.load();
    if (audio.readyState >= 3) {
      done();
    }
  });
}

function preloadOne(src: string) {
  if ((PROLOGUE_IMAGE_ASSETS as readonly string[]).includes(src)) {
    return withTimeout(preloadImage(src), ASSET_TIMEOUT_MS);
  }
  if ((PROLOGUE_VIDEO_ASSETS as readonly string[]).includes(src)) {
    return withTimeout(preloadVideo(src), ASSET_TIMEOUT_MS);
  }
  if ((PROLOGUE_AUDIO_ASSETS as readonly string[]).includes(src)) {
    return withTimeout(preloadAudio(src), ASSET_TIMEOUT_MS);
  }
  return Promise.resolve();
}

export async function preloadPrologueAssets(
  onProgress?: (loaded: number, total: number) => void,
) {
  if (typeof window === "undefined") {
    return;
  }

  const total = PROLOGUE_ASSETS.length;
  let loaded = 0;
  onProgress?.(0, total);

  await Promise.all(
    PROLOGUE_ASSETS.map(async (src) => {
      await preloadOne(src);
      loaded += 1;
      onProgress?.(loaded, total);
    }),
  );
}
