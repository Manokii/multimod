export const Platform = {
  TWITCH: "twitch",
  YOUTUBE: "youtube",
  KICK: "kick",
} as const;
export type Platform = (typeof Platform)[keyof typeof Platform];
