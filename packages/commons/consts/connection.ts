import type { Channel } from "./channel";

export type Connection = Channel & {
  isConnected: boolean;
};
