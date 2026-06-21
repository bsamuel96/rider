import type { UserRole } from "@/types/domain";
import { cn } from "@/utils/cn";

type ChatQuickRepliesProps = {
  role?: UserRole;
  onSelect: (reply: string) => void;
  disabled?: boolean;
};

const replies: Record<string, string[]> = {
  client: ["Sunt aici.", "Ajung în 2 minute.", "Te rog sună-mă.", "Nu găsesc mașina."],
  driver: ["Am ajuns.", "Sunt la locație.", "Te rog vino la pickup.", "Trafic intens, întârzii puțin."],
  roadside_operator: ["Sunt în drum spre tine.", "Te rog stai într-un loc sigur.", "Am ajuns.", "Am nevoie de o poză cu problema."],
  fleet_manager: ["Am verificat flota.", "Escaladăm cazul.", "Revin cu detalii."],
  admin: ["Am preluat cazul.", "Te rog trimite mai multe detalii.", "Ticket escaladat."]
};

export function ChatQuickReplies({ role = "client", onSelect, disabled }: ChatQuickRepliesProps) {
  const items = replies[role] || replies.client;

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-2" aria-label="Răspunsuri rapide">
      {items.map((reply) => (
        <button
          key={reply}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(reply)}
          className={cn(
            "shrink-0 rounded-full border border-border/60 bg-background/80 px-3 py-2 text-xs font-semibold transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            disabled && "opacity-50"
          )}
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
