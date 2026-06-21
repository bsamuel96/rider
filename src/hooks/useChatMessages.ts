import { useCallback, useEffect, useState } from "react";
import { getThreadMessages, markThreadRead, sendChatMessage, sendLocationMessage, subscribeToThreadMessages } from "@/services/chat";
import { useAppStore } from "@/store/useAppStore";
import type { ChatMessage, Coordinates } from "@/types/domain";

export function useChatMessages(threadId?: string) {
  const profile = useAppStore((state) => state.profile);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(Boolean(threadId));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!threadId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextMessages = await getThreadMessages(threadId, profile);
      setMessages(nextMessages);
      await markThreadRead(threadId, profile);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Nu am putut încărca mesajele.");
    } finally {
      setLoading(false);
    }
  }, [profile, threadId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!threadId) {
      return undefined;
    }

    return subscribeToThreadMessages(
      threadId,
      (message) => {
        setMessages((current) => (current.some((item) => item.id === message.id) ? current : [...current, message]));
      },
      profile
    );
  }, [profile, threadId]);

  const send = useCallback(
    async (body: string) => {
      if (!threadId || !body.trim()) {
        return;
      }

      setSending(true);
      setError(null);

      try {
        const message = await sendChatMessage(threadId, body.trim(), profile);
        setMessages((current) => (current.some((item) => item.id === message.id) ? current : [...current, message]));
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Mesajul nu a putut fi trimis.");
      } finally {
        setSending(false);
      }
    },
    [profile, threadId]
  );

  const sendQuickReply = useCallback(
    async (body: string) => {
      if (!threadId) {
        return;
      }

      setSending(true);
      setError(null);

      try {
        const message = await sendChatMessage(threadId, body, profile, { messageType: "quick_reply" });
        setMessages((current) => (current.some((item) => item.id === message.id) ? current : [...current, message]));
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Răspunsul rapid nu a putut fi trimis.");
      } finally {
        setSending(false);
      }
    },
    [profile, threadId]
  );

  const shareLocation = useCallback(
    async (coordinates: Coordinates) => {
      if (!threadId) {
        return;
      }

      setSending(true);
      setError(null);

      try {
        const message = await sendLocationMessage(threadId, coordinates, profile);
        setMessages((current) => (current.some((item) => item.id === message.id) ? current : [...current, message]));
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Locația nu a putut fi trimisă.");
      } finally {
        setSending(false);
      }
    },
    [profile, threadId]
  );

  return {
    messages,
    loading,
    sending,
    error,
    retry: load,
    send,
    sendQuickReply,
    shareLocation
  };
}
