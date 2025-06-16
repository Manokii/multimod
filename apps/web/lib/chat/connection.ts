import type { Channel } from "@workspace/commons/consts/channel";
import type { Chat } from "@workspace/commons/consts/message";
import type { Platform } from "@workspace/commons/consts/platform";

export type Connection<T extends Channel> = {
  channels: T[];
  addMessage: (message: Chat) => void;
  setIsConnected: (channel: Channel[], isConnected: boolean) => void;
  clearChat: (props: {
    platform: Platform;
    roomId: string;
    userId: string;
  }) => void;
};
