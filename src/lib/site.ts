const LOCAL_FALLBACK = "http://localhost:3000";

function trimUrl(value: string) {
  return value.replace(/\/$/, "");
}

function withHttps(host: string) {
  if (host.startsWith("http://") || host.startsWith("https://")) {
    return trimUrl(host);
  }
  return `https://${trimUrl(host)}`;
}

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit && !/localhost|127\.0\.0\.1/i.test(explicit)) {
    return trimUrl(explicit);
  }

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) {
    return withHttps(production);
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return withHttps(vercel);
  }

  return explicit ? trimUrl(explicit) : LOCAL_FALLBACK;
}

export const SITE_NAME = "EchoBound";

export const SITE_TITLE = "EchoBound — Todo Game RPG | Eco Bound Task Tracker";

export const SITE_DESCRIPTION =
  "EchoBound (also called Eco Bound) is a todo game: turn real-life tasks into quests, earn XP, and restore the city of Aurelia. A life RPG to-do list for EchoBound / Eco Bound todo players.";

export const SITE_KEYWORDS = [
  "EchoBound",
  "Eco Bound",
  "Ecobound",
  "EcoBound",
  "echo bound",
  "eco bound todo",
  "todo game",
  "to do game",
  "todo RPG",
  "gamified todo list",
  "task tracker game",
  "life RPG",
  "Aurelia",
];
