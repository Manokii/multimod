"use client";
import { useChat } from "@/providers/chat-provider";
import { cn } from "@workspace/ui/lib/utils";
import { type CSSProperties, useEffect, useRef, useState } from "react";

export function ChatBox() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const { messages = [], options } = useChat();

  const scrollToBottom = () => {
    if (paused) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-screen overflow-y-auto">
      <div
        className="group space-y-2"
        data-platform={options.platform}
        data-timestamp={options.timestamp}
        onMouseOver={() => setPaused(true)}
        onFocus={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            data-state={msg.state}
            data-platform={msg.channel.platform}
            className="space-x-1 text-sm message group/message "
            style={
              {
                "--username-color":
                  options.userColor || msg.color || "var(--color-purple-400)",
                "--message-color": options.messageColor || "var(--foreground)",
              } as CSSProperties
            }
          >
            <span
              id="timestmap"
              className="text-gray-400 text-xs group-data-[timestamp=hidden]:hidden"
            >
              {msg.timestamp}
            </span>

            <div className="inline-block space-x-1">
              <span
                id="platform"
                className={cn(
                  "font-semibold group-data-[platform=hidden]:hidden",
                  "group-data-[platform=twitch]/message:text-purple-400",
                  "group-data-[platform=kick]/message:text-yellow-400",
                )}
              >
                {msg.channel.platform}
              </span>
              <span
                id="username"
                className="text-(--username-color) font-semibold"
              >
                {msg.username}:
              </span>
            </div>
            <span
              id="message"
              className="text-(--message-color) group-data-[state=deleted]/message:line-through group-data-[state=deleted]/message:text-muted-foreground"
            >
              {msg.state === "deleted" ? "Message deleted" : msg.text}
            </span>
          </div>
        ))}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}
