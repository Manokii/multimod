import type { Channel } from "./channel";

export type Chat = {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
  channel: Channel;
  state: "deleted" | "visible" | "hidden";
  color?: string;
  isBroadcaster?: boolean;
  isModerator?: boolean;
  badge?: string[];
  emotes?: [string, number, number][];
};
