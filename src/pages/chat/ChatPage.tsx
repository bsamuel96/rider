import { MessageCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { ChatThread } from "@/components/chat/ChatThread";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useChatThread } from "@/hooks/useChatThread";

export function ChatPage() {
  const { threadId } = useParams();
  const chat = useChatThread({ threadId: threadId || "ride-demo-booking-active" });

  if (chat.loading) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-border/60 bg-background/80 p-6 text-sm text-muted-foreground">
        Se încarcă conversația...
      </div>
    );
  }

  if (chat.error) {
    return <ErrorState description={chat.error} onRetry={chat.retry} className="mx-auto max-w-3xl" />;
  }

  if (!chat.thread) {
    return (
      <EmptyState
        icon={<MessageCircle className="h-5 w-5" aria-hidden="true" />}
        title="Nu există conversație activă"
        description="Chatul apare când există o cursă sau o intervenție activă."
      />
    );
  }

  return <ChatThread thread={chat.thread} />;
}
