import { MapPin } from "lucide-react";
import type { ChatMessage } from "@/types/domain";
import { cn } from "@/utils/cn";

type ChatMessageBubbleProps = {
  message: ChatMessage;
  currentUserId?: string;
};

export function ChatMessageBubble({ message, currentUserId }: ChatMessageBubbleProps) {
  const isMine = message.senderId && message.senderId === currentUserId;
  const isSystem = message.messageType === "system";
  const sentAt = new Date(message.createdAt).toLocaleTimeString("ro-RO", {
    hour: "2-digit",
    minute: "2-digit"
  });

  if (isSystem) {
    return (
      <div className="mx-auto max-w-[85%] rounded-full bg-muted px-3 py-1.5 text-center text-xs font-medium text-muted-foreground">
        {message.body}
      </div>
    );
  }

  return (
    <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[82%] rounded-3xl px-4 py-3 shadow-sm",
          isMine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted text-foreground"
        )}
      >
        {!isMine && <p className="mb-1 text-[11px] font-semibold text-muted-foreground">{message.senderName}</p>}
        {message.messageType === "location" && (
          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-background/30 px-2 py-1 text-[11px] font-semibold">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Locație
          </span>
        )}
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.body}</p>
        <p className={cn("mt-1 text-right text-[10px]", isMine ? "text-primary-foreground/75" : "text-muted-foreground")}>
          {sentAt}
        </p>
      </div>
    </div>
  );
}
