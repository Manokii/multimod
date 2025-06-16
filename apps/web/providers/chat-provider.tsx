"use client";
import { connectToKick } from "@/lib/chat/kick-connection";
import { connectToTwitch } from "@/lib/chat/twitch-connection";
import type { Channel } from "@workspace/commons/consts/channel";
import type { Connection } from "@workspace/commons/consts/connection";
import type { Chat } from "@workspace/commons/consts/message";
import type { Platform } from "@workspace/commons/consts/platform";
import type { ChatOptions } from "@workspace/commons/zod/chat";
import type Pusher from "pusher-js";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type Connections = Record<`${Platform}:${string}`, Connection>;

type ChatContext = {
  messages: Chat[];
  connections: Connections;
  options: ChatOptions;
};

const chatContext = createContext<ChatContext>({
  messages: [],
  connections: {},
  options: {
    platform: "visible",
    userColor: undefined,
    messageColor: undefined,
    timestamp: "visible",
  },
});

interface Props extends PropsWithChildren {
  channels: Channel[];
  options: ChatOptions;
}

export function ChatProvider({ children, channels, options }: Props) {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [connections, setConnections] = useState<Connections>({});
  const twitchWs = useRef<WebSocket>(null);
  const kickWs = useRef<Pusher>(null);

  const addMessage = (newMessage: Chat) => {
    setMessages((prevMessages) => [...prevMessages.slice(-99), newMessage]);
  };

  const clearChat = ({
    platform,
    roomId,
    userId,
  }: {
    platform: Platform;
    roomId: string;
    userId: string;
  }) => {
    setMessages((prevMessages) => {
      return prevMessages.map<Chat>((msg) => {
        if (
          msg.channel.platform === platform &&
          msg.roomId === roomId &&
          msg.userId === userId
        ) {
          return Object.assign(msg, {
            text: "",
            isDeleted: true,
          });
        }
        return msg;
      });
    });
  };

  const setIsConnected = (channel: Channel[], isConnected: boolean) => {
    const newData: Connections = {};
    for (const c of channel) {
      newData[`${c.platform}:${c.channelHandle}`] = { ...c, isConnected };
    }
    setConnections((prev) => ({ ...prev, ...newData }));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    const twitchChannels = channels.filter((c) => c.platform === "twitch");
    if (!twitchChannels.length) return;
    connectToTwitch(twitchWs, {
      channels: twitchChannels,
      addMessage,
      setIsConnected,
      clearChat,
    });
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    const kickChannels = channels.filter((c) => c.platform === "kick");
    if (!kickChannels.length) return;
    connectToKick(kickWs, {
      channels: kickChannels,
      addMessage,
      setIsConnected,
      clearChat,
    });
  }, []);

  return (
    <chatContext.Provider value={{ messages, connections, options }}>
      {children}
    </chatContext.Provider>
  );
}

export const useChat = () => {
  return useContext(chatContext);
};
