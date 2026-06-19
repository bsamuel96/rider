import { useEffect } from "react";
import { isSupabaseConfigured, supabase } from "@/services/supabase";
import { useAppStore } from "@/store/useAppStore";

type NotificationRow = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

export function useRealtimeNotifications() {
  const profile = useAppStore((state) => state.profile);
  const pushNotification = useAppStore((state) => state.pushNotification);

  useEffect(() => {
    if (!isSupabaseConfigured || !profile?.id) {
      return;
    }

    const channel = supabase
      .channel(`notifications:${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${profile.id}`
        },
        (payload) => {
          const notification = payload.new as NotificationRow;
          pushNotification({
            id: notification.id,
            title: notification.title,
            body: notification.body,
            read: notification.read,
            createdAt: notification.created_at
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [profile?.id, pushNotification]);
}
