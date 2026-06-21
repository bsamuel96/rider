import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

export function SupportAttachmentUploader() {
  const { toast } = useToast();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() =>
        toast({
          title: "Atașament demo",
          description: "Upload-ul va folosi storage-ul configurat în producție. În demo, ticketul poate continua fără fișier.",
          tone: "default"
        })
      }
    >
      <Paperclip className="h-4 w-4" aria-hidden="true" />
      Atașează fișier
    </Button>
  );
}
