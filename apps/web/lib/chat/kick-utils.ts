import type { KickChannel } from "@workspace/commons/consts/channel";
import type { KickApiChatroom } from "@workspace/commons/consts/kick";

export async function getChatroomsData(channels: KickChannel[]) {
  return Promise.all(
    channels.map((channel) => getChatroomData(channel.channelHandle)),
  );
}

async function getChatroomData(handle: string) {
  const response = await fetch(
    `https://kick.com/api/v2/channels/${handle}/chatroom`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch data for channel ${handle}`);
  }

  const data = await response.json();
  return {
    handle,
    data: data as KickApiChatroom,
  };
}
