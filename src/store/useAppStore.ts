import { create } from "zustand";
import type { BookingDraft, NotificationItem, Profile, ThemePreference } from "@/types/domain";

type AppState = {
  profile: Profile | null;
  theme: ThemePreference;
  bookingDraft: BookingDraft;
  notifications: NotificationItem[];
  setProfile: (profile: Profile | null) => void;
  setTheme: (theme: ThemePreference) => void;
  updateBookingDraft: (draft: Partial<BookingDraft>) => void;
  resetBookingDraft: () => void;
  pushNotification: (notification: NotificationItem) => void;
  markNotificationRead: (id: string) => void;
};

const persistedTheme = (localStorage.getItem("rider-theme") as ThemePreference | null) || "system";

export const useAppStore = create<AppState>((set) => ({
  profile: null,
  theme: persistedTheme,
  bookingDraft: {},
  notifications: [
    {
      id: "welcome",
      title: "Rider este pregătit",
      body: "Poți comanda o cursă sau solicita asistență rutieră.",
      read: false,
      createdAt: new Date().toISOString()
    }
  ],
  setProfile: (profile) => set({ profile }),
  setTheme: (theme) => {
    localStorage.setItem("rider-theme", theme);
    set({ theme });
  },
  updateBookingDraft: (draft) =>
    set((state) => ({
      bookingDraft: {
        ...state.bookingDraft,
        ...draft
      }
    })),
  resetBookingDraft: () => set({ bookingDraft: {} }),
  pushNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications]
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    }))
}));
