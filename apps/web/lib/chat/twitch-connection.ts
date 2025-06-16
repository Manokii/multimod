import type { TwitchChannel } from "@workspace/commons/consts/channel";
import type { Chat } from "@workspace/commons/consts/message";
import { TwitchChatActions } from "@workspace/commons/consts/twitch";
import type { RefObject } from "react";
import { generateChatId } from "../generate-chat-id";
import type { Connection } from "./connection";
import { formatMetadata } from "./twitch-utils";

export function connectToTwitch(
  wsRef: RefObject<WebSocket | null>,
  opts: Connection<TwitchChannel>,
) {
  if (wsRef.current) return;
  const { addMessage, channels, setIsConnected, clearChat } = opts;
  const ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
  wsRef.current = ws;

  ws.onopen = () => {
    const channels = opts.channels.map((c) => `#${c.channelHandle}`).join(",");

    ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
    // Anonymous connection
    ws.send("PASS SCHMOOPIIEAAA");
    ws.send("NICK justinfan12345");
    ws.send(`JOIN ${channels}`);
    setIsConnected(opts.channels, true);
  };

  ws.onmessage = (event) => {
    const message: string = event.data.trim();

    // ---------- KEEP ALIVE
    if (message.startsWith("PING")) {
      ws.send("PONG :tmi.twitch.tv");
      return;
    }

    const parts = message.match(/(.*)( :.*tmi.twitch.tv.*?:)(.*)/);

    if (parts && parts.length === 4) {
      const rawMetadata = parts[1]?.trim() ?? "";
      const actionPart = parts[2] ?? "";
      const content = parts[3]?.trim() ?? "";
      const streamer = actionPart.match(/.#(\w+)/)?.[1];

      if (!streamer) {
        console.warn("Streamer not found in message:", message);
        return;
      }

      // ---------- CHAT
      if (actionPart.includes(TwitchChatActions.PRIVMSG)) {
        const metadata = formatMetadata<{
          "room-id": string;
          "user-id": string;
          "display-name": string;
          color: string;
          id: string;
          badges: string;
          emotes: string;
        }>(rawMetadata);

        const newMessage: Chat = {
          id: metadata.id || generateChatId("twitch", streamer),
          roomId: metadata["room-id"] || streamer,
          userId: metadata["user-id"],
          username: metadata["display-name"],
          state: "visible",
          text: content,
          channel: { platform: "twitch", channelHandle: streamer },
          timestamp: new Date().toLocaleTimeString(),
          color: metadata.color,
        };

        addMessage(newMessage);
      }

      if (actionPart.includes(TwitchChatActions.CLEARCHAT)) {
        const metadata = formatMetadata<{
          "@ban-duration": string; // duration in seconds
          "room-id": string;
          "target-user-id": string; // userId
          "tmi-sent-ts": string;
        }>(rawMetadata);

        clearChat({
          platform: "twitch",
          roomId: metadata["room-id"] || streamer,
          userId: metadata["target-user-id"],
        });
      }
    }
  };

  ws.onclose = () => {
    setIsConnected(channels, false);
    setTimeout(connectToTwitch, 3000);
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    setIsConnected(channels, false);
  };
}
