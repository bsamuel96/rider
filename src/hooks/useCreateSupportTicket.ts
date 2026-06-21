import { useState } from "react";
import { createSupportTicket, type CreateSupportTicketValues } from "@/services/support";
import { useAppStore } from "@/store/useAppStore";

export function useCreateSupportTicket() {
  const profile = useAppStore((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTicket = async (values: CreateSupportTicketValues) => {
    setLoading(true);
    setError(null);

    try {
      return await createSupportTicket(values, profile);
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : "Ticketul nu a putut fi creat.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createTicket,
    loading,
    error
  };
}
