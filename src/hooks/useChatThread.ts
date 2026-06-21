import { useCallback, useEffect, useState } from "react";
import { getOrCreateRideChatThread, getOrCreateRoadsideChatThread, getThread } from "@/services/chat";
import { useAppStore } from "@/store/useAppStore";
import type { ChatThread } from "@/types/domain";

type UseChatThreadOptions =
  | {
      threadId: string;
      kind?: never;
      resourceId?: never;
    }
  | {
      kind: "ride" | "roadside";
      resourceId: string;
      threadId?: never;
    };

export function useChatThread(options: UseChatThreadOptions) {
  const profile = useAppStore((state) => state.profile);
  const threadId = "threadId" in options ? options.threadId : undefined;
  const kind = "kind" in options ? options.kind : undefined;
  const resourceId = "resourceId" in options ? options.resourceId : undefined;
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextThread =
        threadId
          ? await getThread(threadId, profile)
          : kind === "roadside"
            ? await getOrCreateRoadsideChatThread(resourceId, profile)
            : await getOrCreateRideChatThread(resourceId, profile);
      setThread(nextThread);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Nu am putut încărca chatul.");
    } finally {
      setLoading(false);
    }
  }, [kind, profile, resourceId, threadId]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    thread,
    loading,
    error,
    retry: load
  };
}
