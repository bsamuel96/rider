import { isSupabaseConfigured, supabase } from "@/services/supabase";
import type { AuthInstance, Profile, RegistrationStatus, ThemePreference, UserRole } from "@/types/domain";

type ProfileRow = {
  id: string;
  email: string | null;
  phone: string | null;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  active_instance: string | null;
  registration_status: string | null;
  theme: string | null;
  preferred_payment_method?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  language?: string | null;
  default_address?: string | null;
  home_address?: string | null;
  work_address?: string | null;
};

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email || "",
    phone: row.phone || undefined,
    username: row.username || undefined,
    fullName: row.full_name || row.username || row.email || "Utilizator Rider",
    avatarUrl: row.avatar_url || undefined,
    role: (row.role || "client") as UserRole,
    activeInstance: (row.active_instance || "customer") as AuthInstance,
    registrationStatus: (row.registration_status || "active") as RegistrationStatus,
    theme: (row.theme || "system") as ThemePreference,
    preferredPaymentMethod: row.preferred_payment_method === "card" ? "card" : "cash",
    emergencyContactName: row.emergency_contact_name || undefined,
    emergencyContactPhone: row.emergency_contact_phone || undefined,
    language: row.language || undefined,
    defaultAddress: row.default_address || undefined,
    homeAddress: row.home_address || undefined,
    workAddress: row.work_address || undefined
  };
}

export async function getProfileById(userId: string) {
  if (!isSupabaseConfigured) {
    return null;
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

  if (error || !data) {
    return null;
  }

  return mapProfileRow(data as ProfileRow);
}

export async function getCurrentProfile() {
  if (!isSupabaseConfigured) {
    return null;
  }

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return null;
  }

  return getProfileById(data.user.id);
}

export async function resolveEmailForIdentifier(identifier: string) {
  if (!isSupabaseConfigured || identifier.includes("@")) {
    return identifier;
  }

  const { data, error } = await supabase.from("profiles").select("email").ilike("username", identifier).maybeSingle();

  if (error || !data?.email) {
    return identifier;
  }

  return data.email;
}

export async function updateProfileTheme(profile: Profile, theme: ThemePreference) {
  if (!isSupabaseConfigured) {
    return;
  }

  await supabase.from("profiles").update({ theme }).eq("id", profile.id);
}
