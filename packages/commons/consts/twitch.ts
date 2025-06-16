export const TwitchChatActions = {
  PRIVMSG: "PRIVMSG",
  CLEARCHAT: "CLEARCHAT",
} as const;
export type TwitchChatAction =
  (typeof TwitchChatActions)[keyof typeof TwitchChatActions];
