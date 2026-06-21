import { MapPin, Send } from "lucide-react";
import { ChatAttachmentButton } from "@/components/chat/ChatAttachmentButton";
import { Button } from "@/components/ui/button";
import { useChatComposer } from "@/hooks/useChatComposer";
import type { Coordinates } from "@/types/domain";

type ChatComposerProps = {
  sending?: boolean;
  onSend: (body: string) => Promise<void>;
  onShareLocation?: (coordinates: Coordinates) => Promise<void>;
};

export function ChatComposer({ sending, onSend, onShareLocation }: ChatComposerProps) {
  const composer = useChatComposer(onSend);

  return (
    <form
      className="border-t border-border/60 bg-background/92 p-3 pb-[calc(var(--safe-bottom)+0.75rem)] backdrop-blur-xl"
      onSubmit={(event) => {
        event.preventDefault();
        void composer.submit();
      }}
    >
      <div className="flex items-end gap-2">
        <ChatAttachmentButton />
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Trimite locația"
          onClick={() => onShareLocation?.({ lat: 44.4268, lng: 26.1025 })}
          disabled={!onShareLocation || sending}
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </Button>
        <label className="sr-only" htmlFor="chat-message">
          Mesaj
        </label>
        <textarea
          id="chat-message"
          value={composer.value}
          onChange={(event) => composer.setValue(event.target.value)}
          rows={1}
          placeholder="Scrie un mesaj..."
          className="min-h-11 flex-1 resize-none rounded-2xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" size="icon" aria-label="Trimite mesajul" disabled={!composer.canSend || sending}>
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
