import { useNavigate } from "react-router-dom";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { ChatQuickReplies } from "@/components/chat/ChatQuickReplies";
import { ErrorState } from "@/components/ui/ErrorState";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useAppStore } from "@/store/useAppStore";
import type { ChatThread as ChatThreadType } from "@/types/domain";
import { getSupportBasePath } from "@/utils/communicationRoutes";

type ChatThreadProps = {
  thread: ChatThreadType;
};

export function ChatThread({ thread }: ChatThreadProps) {
  const navigate = useNavigate();
  const profile = useAppStore((state) => state.profile);
  const messages = useChatMessages(thread.id);

  return (
    <section className="mx-auto flex h-[calc(100svh-var(--bottom-nav-height)-var(--safe-bottom)-2.5rem)] max-w-3xl flex-col overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-floating backdrop-blur-xl">
      <ChatHeader thread={thread} onBack={() => navigate(-1)} onReport={() => navigate(`${getSupportBasePath(profile)}/new`)} />
      {messages.error && <ErrorState description={messages.error} onRetry={messages.retry} className="m-4" />}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ChatMessageList messages={messages.messages} currentUserId={profile?.id} />
      </div>
      <ChatQuickReplies role={profile?.role} onSelect={messages.sendQuickReply} disabled={messages.sending} />
      <ChatComposer sending={messages.sending} onSend={messages.send} onShareLocation={messages.shareLocation} />
    </section>
  );
}
