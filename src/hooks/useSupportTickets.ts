import { useCallback, useEffect, useState } from "react";
import { getSupportTicketsForCurrentUser } from "@/services/support";
import { useAppStore } from "@/store/useAppStore";
import type { SupportTicket } from "@/types/domain";

export function useSupportTickets() {
  const profile = useAppStore((state) => state.profile);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setTickets(await getSupportTicketsForCurrentUser(profile));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Nu am putut încărca tichetele.");
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    void load();
    const listener = () => void load();
    window.addEventListener("rider-support-updated", listener);
    return () => window.removeEventListener("rider-support-updated", listener);
  }, [load]);

  return {
    tickets,
    loading,
    error,
    retry: load
  };
}
