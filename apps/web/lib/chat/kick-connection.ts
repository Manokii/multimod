import type { KickChannel } from "@workspace/commons/consts/channel";
import {
  KICK_PUSHER_CLUSTER,
  KICK_PUSHER_KEY,
} from "@workspace/commons/consts/consts";
import {
  KickChatActions,
  type KickMessageEventRaw,
} from "@workspace/commons/consts/kick";
import Pusher from "pusher-js";
import type { RefObject } from "react";
import type { Connection } from "./connection";
import { getChatroomsData } from "./kick-utils";

export async function connectToKick(
  wsRef: RefObject<Pusher | null>,
  opts: Connection<KickChannel>,
) {
  if (wsRef.current) return;
  const { addMessage, channels, setIsConnected, clearChat } = opts;
  const ws = new Pusher(KICK_PUSHER_KEY, { cluster: KICK_PUSHER_CLUSTER });
  wsRef.current = ws;

  const chatrooms = await getChatroomsData(channels);
  const pusherChannels = chatrooms.map(({ handle, data }) => {
    return {
      handle,
      pusherChannel: ws.subscribe(`chatrooms.${data.id}.v2`),
    };
  });

  for (const { pusherChannel, handle } of pusherChannels) {
    pusherChannel.bind("pusher:subscription_succeeded", () => {
      setIsConnected([{ platform: "kick", channelHandle: handle }], true);
    });

    pusherChannel.bind("pusher:subscription_error", () => {
      setIsConnected([{ platform: "kick", channelHandle: handle }], false);
    });

    pusherChannel.bind(
      KickChatActions.ChatMessage,
      (data: KickMessageEventRaw) => {
        if (data.type !== "message") {
          return;
        }
        addMessage({
          id: data.id,
          channel: {
            platform: "kick",
            channelHandle: handle,
          },
          userId: `${data.sender.id}`,
          roomId: `${data.chatroom_id}`,
          state: "visible",
          text: data.content,
          timestamp: new Date(data.created_at).toLocaleTimeString(),
          username: data.sender.username,
        });
      },
    );
  }
}
