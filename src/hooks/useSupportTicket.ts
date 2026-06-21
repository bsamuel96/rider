import { useCallback, useEffect, useState } from "react";
import {
  assignSupportTicket,
  closeSupportTicket,
  getSupportMessages,
  getSupportTicket,
  markSupportTicketResolved,
  reopenSupportTicket,
  replyToSupportTicket,
  subscribeToSupportTicket,
  updateSupportTicketPriority,
  updateSupportTicketStatus
} from "@/services/support";
import { useAppStore } from "@/store/useAppStore";
import type { SupportMessage, SupportTicket, SupportTicketPriority, SupportTicketStatus } from "@/types/domain";

export function useSupportTicket(ticketId?: string) {
  const profile = useAppStore((state) => state.profile);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(Boolean(ticketId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!ticketId) {
      setTicket(null);
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [nextTicket, nextMessages] = await Promise.all([getSupportTicket(ticketId, profile), getSupportMessages(ticketId, profile)]);
      setTicket(nextTicket);
      setMessages(nextMessages);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Nu am putut încărca ticketul.");
    } finally {
      setLoading(false);
    }
  }, [profile, ticketId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!ticketId) {
      return undefined;
    }

    return subscribeToSupportTicket(ticketId, () => void load(), profile);
  }, [load, profile, ticketId]);

  const reply = useCallback(
    async (body: string) => {
      if (!ticketId || !body.trim()) {
        return;
      }

      setSaving(true);
      setError(null);

      try {
        await replyToSupportTicket(ticketId, body.trim(), profile);
        await load();
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Răspunsul nu a putut fi trimis.");
      } finally {
        setSaving(false);
      }
    },
    [load, profile, ticketId]
  );

  const setStatus = useCallback(
    async (status: SupportTicketStatus) => {
      if (!ticketId) {
        return;
      }

      setSaving(true);
      await updateSupportTicketStatus(ticketId, status, profile);
      await load();
      setSaving(false);
    },
    [load, profile, ticketId]
  );

  const resolve = useCallback(async () => ticketId && markSupportTicketResolved(ticketId, profile).then(load), [load, profile, ticketId]);
  const reopen = useCallback(async () => ticketId && reopenSupportTicket(ticketId, profile).then(load), [load, profile, ticketId]);
  const close = useCallback(async () => ticketId && closeSupportTicket(ticketId, profile).then(load), [load, profile, ticketId]);
  const assign = useCallback(
    async () => ticketId && assignSupportTicket(ticketId, profile?.id || "demo-admin", profile).then(load),
    [load, profile, ticketId]
  );
  const setPriority = useCallback(
    async (priority: SupportTicketPriority) => ticketId && updateSupportTicketPriority(ticketId, priority, profile).then(load),
    [load, profile, ticketId]
  );

  return {
    ticket,
    messages,
    loading,
    saving,
    error,
    retry: load,
    reply,
    setStatus,
    resolve,
    reopen,
    close,
    assign,
    setPriority
  };
}
