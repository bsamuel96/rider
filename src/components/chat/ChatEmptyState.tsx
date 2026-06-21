import { MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export function ChatEmptyState() {
  return (
    <EmptyState
      icon={<MessageCircle className="h-5 w-5" aria-hidden="true" />}
      title="Nu există mesaje încă"
      description="Trimite un mesaj sau folosește un răspuns rapid pentru a începe conversația."
    />
  );
}
