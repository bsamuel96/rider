import { getProfileById } from "@/services/profiles";
import { isSupabaseConfigured, supabase } from "@/services/supabase";
import { useAppStore } from "@/store/useAppStore";
import type { PaymentMethod, Profile, ThemePreference } from "@/types/domain";

type CommonProfileUpdate = Partial<
  Pick<
    Profile,
    | "fullName"
    | "username"
    | "email"
    | "phone"
    | "avatarUrl"
    | "preferredPaymentMethod"
    | "theme"
    | "emergencyContactName"
    | "emergencyContactPhone"
    | "language"
    | "defaultAddress"
    | "homeAddress"
    | "workAddress"
  >
>;

type DriverProfileUpdate = {
  licenseNumber?: string;
  serviceRegion?: string;
  mainCity?: string;
};

type RoadsideProfileUpdate = {
  companyName?: string;
  dispatcherPhone?: string;
  serviceRegions?: string[];
  serviceTypes?: string[];
};

export async function updateProfileDetails(profileId: string, values: CommonProfileUpdate) {
  useAppStore.getState().updateProfileDetails(values);

  if (!isSupabaseConfigured) {
    return useAppStore.getState().profile;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: values.fullName,
      username: values.username,
      email: values.email,
      phone: values.phone,
      avatar_url: values.avatarUrl,
      preferred_payment_method: values.preferredPaymentMethod,
      theme: values.theme,
      emergency_contact_name: values.emergencyContactName,
      emergency_contact_phone: values.emergencyContactPhone,
      language: values.language,
      default_address: values.defaultAddress,
      home_address: values.homeAddress,
      work_address: values.workAddress,
      updated_at: new Date().toISOString()
    })
    .eq("id", profileId);

  if (error) {
    throw error;
  }

  return getProfileById(profileId);
}

export async function updatePreferredPaymentMethod(profileId: string, method: PaymentMethod) {
  await useAppStore.getState().setPreferredPaymentMethod(method);

  if (!isSupabaseConfigured) {
    return;
  }

  await supabase.from("profiles").update({ preferred_payment_method: method }).eq("id", profileId);
}

export async function updateCustomerAddresses(
  profileId: string,
  addresses: Pick<Profile, "defaultAddress" | "homeAddress" | "workAddress">
) {
  return updateProfileDetails(profileId, addresses);
}

export async function updateDriverProfile(profileId: string, values: DriverProfileUpdate) {
  if (!isSupabaseConfigured) {
    return null;
  }

  const { error } = await supabase
    .from("driver_profiles")
    .update({
      license_number: values.licenseNumber,
      service_region: values.serviceRegion,
      main_city: values.mainCity,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", profileId);

  if (error) {
    throw error;
  }

  return true;
}

export async function updateRoadsideOperatorProfile(profileId: string, values: RoadsideProfileUpdate) {
  if (!isSupabaseConfigured) {
    return null;
  }

  const { error } = await supabase
    .from("roadside_operator_profiles")
    .update({
      company_name: values.companyName,
      dispatcher_phone: values.dispatcherPhone,
      service_regions: values.serviceRegions,
      service_types: values.serviceTypes,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", profileId);

  if (error) {
    throw error;
  }

  return true;
}

export async function uploadAvatar(file: File) {
  if (!isSupabaseConfigured) {
    return URL.createObjectURL(file);
  }

  const filePath = `avatars/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from("avatars").upload(filePath, file, {
    upsert: true
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function getEditableProfile(profileId: string) {
  if (!isSupabaseConfigured) {
    return useAppStore.getState().profile;
  }

  return getProfileById(profileId);
}

export function normalizeThemePreference(value?: string): ThemePreference {
  return value === "light" || value === "dark" || value === "system" ? value : "system";
}
