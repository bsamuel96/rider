import { useCallback, useEffect, useState } from "react";
import { getUnreadChatCountForUser } from "@/services/chat";
import { useAppStore } from "@/store/useAppStore";

export function useChatUnreadCount() {
  const profile = useAppStore((state) => state.profile);
  const [count, setCount] = useState(0);

  const load = useCallback(async () => {
    setCount(await getUnreadChatCountForUser(profile?.id));
  }, [profile?.id]);

  useEffect(() => {
    void load();
    const listener = () => void load();
    window.addEventListener("rider-chat-updated", listener);
    return () => window.removeEventListener("rider-chat-updated", listener);
  }, [load]);

  return count;
}
