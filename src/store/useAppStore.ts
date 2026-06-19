import { create } from "zustand";
import { getCurrentProfile } from "@/services/profiles";
import { isSupabaseConfigured, supabase } from "@/services/supabase";
import type { AuthInstance, BookingDraft, NotificationItem, Profile, ThemePreference } from "@/types/domain";

type AuthStatus = "anonymous" | "authenticated";

type AppState = {
  profile: Profile | null;
  activeInstance: AuthInstance;
  sessionLoading: boolean;
  authStatus: AuthStatus;
  theme: ThemePreference;
  bookingDraft: BookingDraft;
  notifications: NotificationItem[];
  setProfile: (profile: Profile | null) => void;
  setActiveInstance: (instance: AuthInstance) => void;
  setSessionLoading: (loading: boolean) => void;
  setAuthStatus: (status: AuthStatus) => void;
  hydrateSession: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => void;
  setTheme: (theme: ThemePreference) => void;
  updateBookingDraft: (draft: Partial<BookingDraft>) => void;
  resetBookingDraft: () => void;
  pushNotification: (notification: NotificationItem) => void;
  markNotificationRead: (id: string) => void;
};

const persistedTheme = (localStorage.getItem("rider-theme") as ThemePreference | null) || "system";
const persistedInstance = (localStorage.getItem("rider-last-auth-instance") as AuthInstance | null) || "customer";

export const useAppStore = create<AppState>((set) => ({
  profile: null,
  activeInstance: persistedInstance,
  sessionLoading: true,
  authStatus: "anonymous",
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
  setProfile: (profile) =>
    set({
      profile,
      authStatus: profile ? "authenticated" : "anonymous",
      activeInstance: profile?.activeInstance || persistedInstance
    }),
  setActiveInstance: (activeInstance) => {
    localStorage.setItem("rider-last-auth-instance", activeInstance);
    set({ activeInstance });
  },
  setSessionLoading: (sessionLoading) => set({ sessionLoading }),
  setAuthStatus: (authStatus) => set({ authStatus }),
  hydrateSession: async () => {
    set({ sessionLoading: true });

    if (!isSupabaseConfigured) {
      set({ sessionLoading: false, authStatus: "anonymous" });
      return;
    }

    const profile = await getCurrentProfile();
    set({
      profile,
      activeInstance: profile?.activeInstance || persistedInstance,
      authStatus: profile ? "authenticated" : "anonymous",
      sessionLoading: false
    });
  },
  logout: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }

    set({ profile: null, authStatus: "anonymous" });
  },
  updateProfile: (profile) =>
    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            ...profile
          }
        : null
    })),
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
