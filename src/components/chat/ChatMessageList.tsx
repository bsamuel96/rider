import { useEffect, useRef } from "react";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { ChatMessageBubble } from "@/components/chat/ChatMessageBubble";
import type { ChatMessage } from "@/types/domain";

type ChatMessageListProps = {
  messages: ChatMessage[];
  currentUserId?: string;
};

export function ChatMessageList({ messages, currentUserId }: ChatMessageListProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="grid min-h-72 place-items-center p-4">
        <ChatEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {messages.map((message) => (
        <ChatMessageBubble key={message.id} message={message} currentUserId={currentUserId} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
