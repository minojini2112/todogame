export const INTRO_READY_COOKIE = "echobound_intro_ready";

/** Every image, video, and audio file the live prologue actually paints. */
export const PROLOGUE_IMAGE_ASSETS = [
  "/assets/prologue/room/room_background.png",
  "/assets/prologue/room/light_rays.png",
  "/assets/prologue/room/dust_particles.png",
  "/assets/prologue/pov/left_hand.png",
  "/assets/prologue/pov/right_hand.png",
  "/assets/prologue/city/sky.png",
  "/assets/prologue/city/distant_city.png",
  "/assets/prologue/city/destroyed_buildings.png",
  "/assets/prologue/city/foreground_buildings.png",
  "/assets/prologue/city/smoke.png",
  "/assets/prologue/city/light_rays.png",
  "/assets/prologue/city/particles.png",
  "/assets/prologue/spirit/aerin-particles.png",
  "/assets/prologue/spirit/spirit_flyingfront.png",
  "/assets/prologue/spirit/aerin-idle.png",
] as const;

export const PROLOGUE_VIDEO_ASSETS = [
  "/assets/prologue/spirit/creature_flying_no_logo.mp4",
] as const;

export const PROLOGUE_AUDIO_ASSETS = ["/audio/prologue.mp3"] as const;

export const PROLOGUE_ASSETS = [
  ...PROLOGUE_IMAGE_ASSETS,
  ...PROLOGUE_VIDEO_ASSETS,
  ...PROLOGUE_AUDIO_ASSETS,
] as const;
