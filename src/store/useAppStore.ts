import { create } from "zustand";
import { getCurrentProfile } from "@/services/profiles";
import { isSupabaseConfigured, supabase } from "@/services/supabase";
import type { AuthInstance, BookingDraft, NotificationItem, Profile, ThemePreference } from "@/types/domain";

type AuthStatus = "anonymous" | "authenticated";
const DEMO_PROFILE_STORAGE_KEY = "rider-demo-profile";

function readStoredDemoProfile() {
  try {
    const rawProfile = localStorage.getItem(DEMO_PROFILE_STORAGE_KEY);
    if (!rawProfile) {
      return null;
    }

    const profile = JSON.parse(rawProfile) as Profile;
    return profile.id.startsWith("demo-") ? profile : null;
  } catch {
    localStorage.removeItem(DEMO_PROFILE_STORAGE_KEY);
    return null;
  }
}

function persistDemoProfile(profile: Profile | null) {
  if (profile?.id.startsWith("demo-")) {
    localStorage.setItem(DEMO_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    return;
  }

  localStorage.removeItem(DEMO_PROFILE_STORAGE_KEY);
}

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
    set(() => {
      persistDemoProfile(profile);

      return {
        profile,
        authStatus: profile ? "authenticated" : "anonymous",
        activeInstance: profile?.activeInstance || persistedInstance
      };
    }),
  setActiveInstance: (activeInstance) => {
    localStorage.setItem("rider-last-auth-instance", activeInstance);
    set({ activeInstance });
  },
  setSessionLoading: (sessionLoading) => set({ sessionLoading }),
  setAuthStatus: (authStatus) => set({ authStatus }),
  hydrateSession: async () => {
    set({ sessionLoading: true });

    const demoProfile = readStoredDemoProfile();

    if (!isSupabaseConfigured) {
      set({
        profile: demoProfile,
        activeInstance: demoProfile?.activeInstance || persistedInstance,
        sessionLoading: false,
        authStatus: demoProfile ? "authenticated" : "anonymous"
      });
      return;
    }

    const profile = await getCurrentProfile();
    if (profile) {
      persistDemoProfile(null);
    }

    set({
      profile: profile || demoProfile,
      activeInstance: profile?.activeInstance || demoProfile?.activeInstance || persistedInstance,
      authStatus: profile || demoProfile ? "authenticated" : "anonymous",
      sessionLoading: false
    });
  },
  logout: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }

    persistDemoProfile(null);
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
