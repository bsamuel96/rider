import { ArrowLeft, Flag, ShieldAlert } from "lucide-react";
import { ChatConnectionStatus } from "@/components/chat/ChatConnectionStatus";
import { ChatUnreadBadge } from "@/components/chat/ChatUnreadBadge";
import { Button } from "@/components/ui/button";
import type { ChatThread } from "@/types/domain";

type ChatHeaderProps = {
  thread: ChatThread;
  onBack: () => void;
  onReport: () => void;
};

export function ChatHeader({ thread, onBack, onReport }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border/60 bg-background/90 px-3 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Button type="button" size="icon" variant="ghost" aria-label="Înapoi" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/12 text-primary">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-sm font-semibold">{thread.title}</h1>
            <ChatUnreadBadge count={thread.unreadCount} />
          </div>
          <p className="truncate text-xs text-muted-foreground">{thread.subtitle || "Conversație Rider"}</p>
        </div>
        <div className="flex items-center gap-2">
          <ChatConnectionStatus />
          <Button type="button" size="icon" variant="outline" aria-label="Raportează conversația" onClick={onReport}>
            <Flag className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}
