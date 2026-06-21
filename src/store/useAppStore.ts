import { create } from "zustand";
import { getCurrentProfile } from "@/services/profiles";
import { isSupabaseConfigured, supabase } from "@/services/supabase";
import type {
  AuthInstance,
  BookingDraft,
  CustomerNotification,
  NotificationItem,
  PaymentMethod,
  Profile,
  RecentLocation,
  ThemePreference
} from "@/types/domain";

type AuthStatus = "anonymous" | "authenticated";
const DEMO_PROFILE_STORAGE_KEY = "rider-demo-profile";
const DISMISSED_CUSTOMER_NOTIFICATIONS_KEY = "rider-dismissed-customer-notifications";
const RECENT_LOCATIONS_STORAGE_KEY = "rider-recent-locations";
const PREFERRED_PAYMENT_STORAGE_KEY = "rider-preferred-payment-method";

const defaultCustomerNotifications: CustomerNotification[] = [
  {
    id: "promo-next-ride",
    title: "Reducere activă",
    body: "Ai 10% reducere la următoarea cursă.",
    type: "promo",
    dismissible: true
  },
  {
    id: "roadside-nearby",
    title: "Asistență disponibilă",
    body: "Echipaje roadside sunt în zona ta.",
    type: "safety",
    dismissible: true,
    actionLabel: "Vezi",
    actionPath: "/customer/roadside"
  },
  {
    id: "cash-enabled",
    title: "Plata cash este activă",
    body: "Poți schimba metoda înainte de confirmare.",
    type: "payment",
    dismissible: true
  },
  {
    id: "save-home",
    title: "Comenzi mai rapide",
    body: "Salvează adresa de acasă din Profil.",
    type: "system",
    dismissible: true,
    actionLabel: "Profil",
    actionPath: "/customer/profile"
  }
];

function readJsonStorage<T>(key: string, fallback: T): T {
  try {
    const rawValue = localStorage.getItem(key);

    if (!rawValue) {
      return fallback;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function readPreferredPaymentMethod(): PaymentMethod {
  const storedMethod = localStorage.getItem(PREFERRED_PAYMENT_STORAGE_KEY);
  return storedMethod === "card" || storedMethod === "cash" ? storedMethod : "cash";
}

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
  customerNotifications: CustomerNotification[];
  dismissedCustomerNotificationIds: string[];
  recentLocations: RecentLocation[];
  preferredPaymentMethod: PaymentMethod;
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
  dismissCustomerNotification: (id: string) => void;
  addRecentLocation: (location: RecentLocation) => void;
  setPreferredPaymentMethod: (method: PaymentMethod) => Promise<void>;
};

const persistedTheme = (localStorage.getItem("rider-theme") as ThemePreference | null) || "system";
const persistedInstance = (localStorage.getItem("rider-last-auth-instance") as AuthInstance | null) || "customer";
const persistedDismissedCustomerNotifications = readJsonStorage<string[]>(DISMISSED_CUSTOMER_NOTIFICATIONS_KEY, []);
const persistedRecentLocations = readJsonStorage<RecentLocation[]>(RECENT_LOCATIONS_STORAGE_KEY, []);
const persistedPreferredPaymentMethod = readPreferredPaymentMethod();

export const useAppStore = create<AppState>((set) => ({
  profile: null,
  activeInstance: persistedInstance,
  sessionLoading: true,
  authStatus: "anonymous",
  theme: persistedTheme,
  bookingDraft: {},
  customerNotifications: defaultCustomerNotifications,
  dismissedCustomerNotificationIds: persistedDismissedCustomerNotifications,
  recentLocations: persistedRecentLocations,
  preferredPaymentMethod: persistedPreferredPaymentMethod,
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
    set((state) => {
      const preferredPaymentMethod = profile?.preferredPaymentMethod || state.preferredPaymentMethod || readPreferredPaymentMethod();
      const normalizedProfile = profile
        ? {
            ...profile,
            preferredPaymentMethod
          }
        : null;

      persistDemoProfile(normalizedProfile);
      localStorage.setItem(PREFERRED_PAYMENT_STORAGE_KEY, preferredPaymentMethod);

      return {
        profile: normalizedProfile,
        preferredPaymentMethod,
        authStatus: normalizedProfile ? "authenticated" : "anonymous",
        activeInstance: normalizedProfile?.activeInstance || persistedInstance
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
    })),
  dismissCustomerNotification: (id) =>
    set((state) => {
      const dismissedCustomerNotificationIds = Array.from(new Set([...state.dismissedCustomerNotificationIds, id]));
      localStorage.setItem(DISMISSED_CUSTOMER_NOTIFICATIONS_KEY, JSON.stringify(dismissedCustomerNotificationIds));

      return {
        dismissedCustomerNotificationIds
      };
    }),
  addRecentLocation: (location) =>
    set((state) => {
      const recentLocations = [
        location,
        ...state.recentLocations.filter((item) => item.id !== location.id && item.label !== location.label)
      ].slice(0, 8);

      localStorage.setItem(RECENT_LOCATIONS_STORAGE_KEY, JSON.stringify(recentLocations));

      return {
        recentLocations
      };
    }),
  setPreferredPaymentMethod: async (preferredPaymentMethod) => {
    localStorage.setItem(PREFERRED_PAYMENT_STORAGE_KEY, preferredPaymentMethod);

    set((state) => ({
      preferredPaymentMethod,
      profile: state.profile
        ? {
            ...state.profile,
            preferredPaymentMethod
          }
        : state.profile
    }));

    const profile = useAppStore.getState().profile;

    if (isSupabaseConfigured && profile?.id) {
      await supabase.from("profiles").update({ preferred_payment_method: preferredPaymentMethod }).eq("id", profile.id);
    }
  }
}));
