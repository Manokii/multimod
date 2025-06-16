export const KickChatActions = {
  ChatMessage: "App\\Events\\ChatMessageEvent",
} as const;
export type KickChatAction =
  (typeof KickChatActions)[keyof typeof KickChatActions];

// ---- KICK CHAT MESSAGE EVENT
export interface KickMessageEventRaw {
  id: string;
  chatroom_id: number;
  content: string;
  type: string;
  created_at: Date;
  sender: Sender;
  metadata: Metadata;
}

interface Metadata {
  message_ref: string;
}

interface Sender {
  id: number;
  username: string;
  slug: string;
  identity: Identity;
}

interface Identity {
  color: string;
  badges: KickBadge[];
}

interface KickBadge {
  type: string;
  text: string;
  count: number;
}

// --- CHATROOM
export interface KickApiChatroom {
  id: number;
  slow_mode: SlowMode;
  subscribers_mode: EmotesMode;
  followers_mode: AccountAge;
  emotes_mode: EmotesMode;
  advanced_bot_protection: AdvancedBotProtection;
  pinned_message: null;
  show_quick_emotes: EmotesMode;
  show_banners: EmotesMode;
  gifts_enabled: EmotesMode;
  gifts_week_enabled: EmotesMode;
  gifts_month_enabled: EmotesMode;
  account_age: AccountAge;
}

interface AccountAge {
  enabled: boolean;
  min_duration: number;
}

interface AdvancedBotProtection {
  enabled: boolean;
  remaining_time: number;
}

interface EmotesMode {
  enabled: boolean;
}

interface SlowMode {
  enabled: boolean;
  message_interval: number;
}
