import { Wifi } from "lucide-react";
import { isSupabaseConfigured } from "@/services/supabase";

export function ChatConnectionStatus() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
      <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
      {isSupabaseConfigured ? "Realtime" : "Demo local"}
    </span>
  );
}
