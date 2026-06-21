import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

export function ChatAttachmentButton() {
  const { toast } = useToast();

  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      aria-label="Atașează fișier"
      onClick={() =>
        toast({
          title: "Atașament demo",
          description: "În demo, atașamentele sunt simulate. Poți trimite text sau locație.",
          tone: "default"
        })
      }
    >
      <Paperclip className="h-4 w-4" aria-hidden="true" />
    </Button>
  );
}
