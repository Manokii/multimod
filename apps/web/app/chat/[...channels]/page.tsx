import { ChatBox } from "@/components/chat-box";
import { ChatProvider } from "@/providers/chat-provider";
import type { Channel } from "@workspace/commons/consts/channel";
import { Platform } from "@workspace/commons/consts/platform";
import { chatOptionsSchema } from "@workspace/commons/zod/chat";

interface Props {
  params: Promise<{ channels: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}
export default async function ChatPage({ params, searchParams }: Props) {
  const [{ channels: paramChannels }, search] = await Promise.all([
    params,
    searchParams,
  ]);

  const channels: Channel[] = [];
  for (const channel of paramChannels) {
    const decoded = decodeURIComponent(channel);
    const [platform, channelHandle] = decoded.split("@") as [Platform, string];
    if (Object.values(Platform).includes(platform) && channelHandle) {
      channels.push({ platform, channelHandle });
    }
  }

  const options = chatOptionsSchema.parse(search);

  return channels.length > 0 ? (
    <ChatProvider channels={channels} options={options}>
      <ChatBox />
    </ChatProvider>
  ) : (
    <div>No valid channel found</div>
  );
}
