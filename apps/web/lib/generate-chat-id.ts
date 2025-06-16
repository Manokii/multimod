import type { Platform } from "@workspace/commons/consts/platform";

export function generateChatId(platform: Platform, channelId: string) {
  const timestamp = Date.now();
  const randomizer = Math.random() * 1000;
  return `${platform}-${channelId}-${timestamp}-${randomizer}`;
}
