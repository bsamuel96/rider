import { Send } from "lucide-react";
import { useState } from "react";
import { LoadingButton } from "@/components/ui/LoadingButton";

type SupportTicketComposerProps = {
  onReply: (body: string) => Promise<void>;
  saving?: boolean;
};

export function SupportTicketComposer({ onReply, saving }: SupportTicketComposerProps) {
  const [body, setBody] = useState("");

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        const nextBody = body.trim();
        if (!nextBody) {
          return;
        }

        setBody("");
        void onReply(nextBody);
      }}
    >
      <label htmlFor="support-reply" className="text-sm font-semibold">
        Răspunde
      </label>
      <textarea
        id="support-reply"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        className="min-h-24 w-full rounded-2xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        placeholder="Scrie un răspuns..."
      />
      <LoadingButton type="submit" loading={saving} loadingLabel="Se trimite..." disabled={!body.trim()} className="w-full">
        <Send className="h-4 w-4" aria-hidden="true" />
        Trimite răspuns
      </LoadingButton>
    </form>
  );
}
