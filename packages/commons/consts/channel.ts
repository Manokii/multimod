export type TwitchChannel = {
  platform: "twitch";
  channelHandle: string;
};

export type YouTubeChannel = {
  platform: "youtube";
  channelHandle: string;
};

export type KickChannel = {
  platform: "kick";
  channelHandle: string;
};

export type Channel = TwitchChannel | YouTubeChannel | KickChannel;
