import { isSupabaseConfigured, supabase } from "@/services/supabase";
import { useAppStore } from "@/store/useAppStore";
import type { Profile } from "@/types/domain";
import type {
  CustomerRegisterValues,
  DriverRegisterValues,
  RoadsideRegisterValues
} from "@/validation/authSchemas";

function setAuthenticatedProfile(profile: Profile) {
  useAppStore.getState().setProfile(profile);
  useAppStore.getState().setActiveInstance(profile.activeInstance || "customer");
  return profile;
}

function createLocalProfile(values: CustomerRegisterValues | DriverRegisterValues | RoadsideRegisterValues, profile: Pick<Profile, "role" | "activeInstance" | "registrationStatus">): Profile {
  return {
    id: crypto.randomUUID(),
    email: values.email,
    phone: values.phone,
    username: values.username,
    fullName: values.fullName,
    role: profile.role,
    activeInstance: profile.activeInstance,
    registrationStatus: profile.registrationStatus,
    theme: useAppStore.getState().theme,
    preferredPaymentMethod: useAppStore.getState().preferredPaymentMethod
  };
}

async function createAuthUser(values: CustomerRegisterValues | DriverRegisterValues | RoadsideRegisterValues) {
  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        full_name: values.fullName,
        username: values.username,
        phone: values.phone
      }
    }
  });

  if (error || !data.user) {
    throw new Error(error?.message || "Nu am putut crea contul.");
  }

  return data.user;
}

export async function signUpCustomer(values: CustomerRegisterValues) {
  if (!isSupabaseConfigured) {
    return setAuthenticatedProfile(
      createLocalProfile(values, {
        role: "client",
        activeInstance: "customer",
        registrationStatus: "active"
      })
    );
  }

  const user = await createAuthUser(values);
  const profile: Profile = {
    id: user.id,
    email: values.email,
    phone: values.phone,
    username: values.username,
    fullName: values.fullName,
    role: "client",
    activeInstance: "customer",
    registrationStatus: "active",
    theme: useAppStore.getState().theme,
    preferredPaymentMethod: useAppStore.getState().preferredPaymentMethod
  };

  await supabase.from("profiles").upsert({
    id: profile.id,
    email: profile.email,
    phone: profile.phone,
    username: profile.username,
    full_name: profile.fullName,
    role: profile.role,
    active_instance: profile.activeInstance,
    registration_status: profile.registrationStatus,
    theme: profile.theme,
    preferred_payment_method: profile.preferredPaymentMethod
  });

  if (values.primaryAddress) {
    await supabase.from("addresses").insert({
      user_id: profile.id,
      label: "Principală",
      address: values.primaryAddress,
      lat: 44.4268,
      lng: 26.1025
    });
  }

  return setAuthenticatedProfile(profile);
}

export async function signUpDriver(values: DriverRegisterValues) {
  if (!isSupabaseConfigured) {
    return setAuthenticatedProfile(
      createLocalProfile(values, {
        role: "driver",
        activeInstance: "driver",
        registrationStatus: "pending_review"
      })
    );
  }

  const user = await createAuthUser(values);
  const profile: Profile = {
    id: user.id,
    email: values.email,
    phone: values.phone,
    username: values.username,
    fullName: values.fullName,
    role: "driver",
    activeInstance: "driver",
    registrationStatus: "pending_review",
    theme: useAppStore.getState().theme,
    preferredPaymentMethod: useAppStore.getState().preferredPaymentMethod
  };

  await supabase.from("profiles").upsert({
    id: profile.id,
    email: profile.email,
    phone: profile.phone,
    username: profile.username,
    full_name: profile.fullName,
    role: profile.role,
    active_instance: profile.activeInstance,
    registration_status: profile.registrationStatus,
    theme: profile.theme,
    preferred_payment_method: profile.preferredPaymentMethod
  });

  await supabase.from("driver_profiles").insert({
    user_id: profile.id,
    license_number: values.licenseNumber,
    license_expiry: values.licenseExpiry,
    experience_years: values.experienceYears,
    main_city: values.mainCity,
    service_region: values.serviceRegion
  });

  await supabase.from("vehicles").insert({
    driver_id: profile.id,
    owner_id: profile.id,
    owner_role: "driver",
    vehicle_type: values.vehicleType,
    brand: values.vehicleBrand,
    model: values.vehicleModel,
    plate_number: values.plateNumber,
    color: values.vehicleColor,
    production_year: values.productionYear,
    seats: values.seats,
    status: "offline",
    vehicle_status: "pending_review"
  });

  return setAuthenticatedProfile(profile);
}

export async function signUpRoadsideOperator(values: RoadsideRegisterValues) {
  if (!isSupabaseConfigured) {
    return setAuthenticatedProfile(
      createLocalProfile(values, {
        role: "roadside_operator",
        activeInstance: "roadside",
        registrationStatus: "pending_review"
      })
    );
  }

  const user = await createAuthUser(values);
  const profile: Profile = {
    id: user.id,
    email: values.email,
    phone: values.phone,
    username: values.username,
    fullName: values.fullName,
    role: "roadside_operator",
    activeInstance: "roadside",
    registrationStatus: "pending_review",
    theme: useAppStore.getState().theme,
    preferredPaymentMethod: useAppStore.getState().preferredPaymentMethod
  };

  await supabase.from("profiles").upsert({
    id: profile.id,
    email: profile.email,
    phone: profile.phone,
    username: profile.username,
    full_name: profile.fullName,
    role: profile.role,
    active_instance: profile.activeInstance,
    registration_status: profile.registrationStatus,
    theme: profile.theme,
    preferred_payment_method: profile.preferredPaymentMethod
  });

  await supabase.from("roadside_operator_profiles").insert({
    user_id: profile.id,
    company_name: values.companyName,
    fiscal_code: values.fiscalCode,
    dispatcher_phone: values.dispatcherPhone,
    company_email: values.companyEmail,
    main_city: values.mainCity,
    service_regions: values.serviceRegions.split(",").map((item) => item.trim()).filter(Boolean),
    service_types: values.serviceTypes
  });

  await supabase.from("vehicles").insert({
    driver_id: null,
    owner_id: profile.id,
    owner_role: "roadside_operator",
    vehicle_type: values.interventionVehicleType,
    plate_number: values.interventionPlateNumber,
    capacity_kg: values.towingCapacity,
    status: "offline",
    vehicle_status: "pending_review"
  });

  return setAuthenticatedProfile(profile);
}
