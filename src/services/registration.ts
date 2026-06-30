import { isSupabaseConfigured, supabase } from "@/services/supabase";
import { useAppStore } from "@/store/useAppStore";
import type { Profile } from "@/types/domain";
import type {
  CustomerRegisterValues,
  DriverRegisterValues,
  RoadsideRegisterValues
} from "@/validation/authSchemas";

export type RegistrationResult = {
  profile: Profile;
  needsEmailConfirmation: boolean;
};

function setAuthenticatedProfile(profile: Profile): RegistrationResult {
  useAppStore.getState().setProfile(profile);
  useAppStore.getState().setActiveInstance(profile.activeInstance || "customer");
  return {
    profile,
    needsEmailConfirmation: false
  };
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

function getSupabaseMessage(error: { message?: string; code?: string; details?: string; hint?: string } | null | undefined, fallback: string) {
  if (!error) {
    return fallback;
  }

  const details = [error.message, error.details, error.hint, error.code ? `Cod: ${error.code}` : undefined].filter(Boolean).join(" ");

  if (error.message?.toLowerCase().includes("database error saving new user")) {
    return `${fallback} Supabase a refuzat crearea utilizatorului în baza de date. Rulează migrațiile din proiect și verifică triggerul de profil pentru auth.users. ${details}`;
  }

  return `${fallback} ${details}`.trim();
}

async function expectSupabaseSuccess<T extends { error: { message?: string; code?: string; details?: string; hint?: string } | null }>(
  request: PromiseLike<T>,
  fallback: string
) {
  const result = await request;

  if (result.error) {
    throw new Error(getSupabaseMessage(result.error, fallback));
  }

  return result;
}

function buildBaseMetadata(
  values: CustomerRegisterValues | DriverRegisterValues | RoadsideRegisterValues,
  profile: Pick<Profile, "role" | "activeInstance" | "registrationStatus">
) {
  return {
    full_name: values.fullName,
    username: values.username,
    phone: values.phone,
    role: profile.role,
    active_instance: profile.activeInstance,
    registration_status: profile.registrationStatus,
    theme: useAppStore.getState().theme,
    preferred_payment_method: useAppStore.getState().preferredPaymentMethod
  };
}

function buildDriverMetadata(values: DriverRegisterValues) {
  return {
    license_number: values.licenseNumber,
    license_expiry: values.licenseExpiry,
    experience_years: values.experienceYears,
    main_city: values.mainCity,
    service_region: values.serviceRegion,
    vehicle_brand: values.vehicleBrand,
    vehicle_model: values.vehicleModel,
    vehicle_type: values.vehicleType,
    vehicle_color: values.vehicleColor,
    plate_number: values.plateNumber,
    production_year: values.productionYear,
    seats: values.seats
  };
}

function buildRoadsideMetadata(values: RoadsideRegisterValues) {
  return {
    company_name: values.companyName,
    fiscal_code: values.fiscalCode,
    contact_person: values.contactPerson,
    dispatcher_phone: values.dispatcherPhone,
    company_email: values.companyEmail,
    main_city: values.mainCity,
    service_regions: values.serviceRegions,
    service_types: values.serviceTypes,
    intervention_vehicle_type: values.interventionVehicleType,
    intervention_plate_number: values.interventionPlateNumber,
    towing_capacity: values.towingCapacity,
    equipment: values.equipment
  };
}

async function createAuthUser(
  values: CustomerRegisterValues | DriverRegisterValues | RoadsideRegisterValues,
  metadata: Record<string, unknown>
) {
  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/auth/login`
    }
  });

  if (error || !data.user) {
    throw new Error(getSupabaseMessage(error, "Nu am putut crea contul."));
  }

  return {
    user: data.user,
    session: data.session
  };
}

function buildRegistrationProfile(
  id: string,
  values: CustomerRegisterValues | DriverRegisterValues | RoadsideRegisterValues,
  profile: Pick<Profile, "role" | "activeInstance" | "registrationStatus">
): Profile {
  return {
    id,
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

async function upsertProfile(profile: Profile) {
  await expectSupabaseSuccess(
    supabase.from("profiles").upsert(
      {
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
      },
      { onConflict: "id" }
    ),
    "Contul Auth a fost creat, dar profilul aplicației nu a putut fi salvat."
  );
}

function getConfirmationResult(profile: Profile): RegistrationResult {
  return {
    profile,
    needsEmailConfirmation: true
  };
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

  const profileRole = {
    role: "client",
    activeInstance: "customer",
    registrationStatus: "active"
  } satisfies Pick<Profile, "role" | "activeInstance" | "registrationStatus">;
  const { user, session } = await createAuthUser(values, buildBaseMetadata(values, profileRole));
  const profile = buildRegistrationProfile(user.id, values, profileRole);

  if (!session) {
    return getConfirmationResult(profile);
  }

  await upsertProfile(profile);

  if (values.primaryAddress) {
    await expectSupabaseSuccess(
      supabase.from("addresses").insert({
        user_id: profile.id,
        label: "Principală",
        address: values.primaryAddress,
        lat: 44.4268,
        lng: 26.1025
      }),
      "Profilul a fost creat, dar adresa principală nu a putut fi salvată."
    );
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

  const profileRole = {
    role: "driver",
    activeInstance: "driver",
    registrationStatus: "pending_review"
  } satisfies Pick<Profile, "role" | "activeInstance" | "registrationStatus">;
  const { user, session } = await createAuthUser(values, {
    ...buildBaseMetadata(values, profileRole),
    ...buildDriverMetadata(values)
  });
  const profile = buildRegistrationProfile(user.id, values, profileRole);

  if (!session) {
    return getConfirmationResult(profile);
  }

  await upsertProfile(profile);

  await expectSupabaseSuccess(
    supabase.from("driver_profiles").upsert(
      {
        user_id: profile.id,
        license_number: values.licenseNumber,
        license_expiry: values.licenseExpiry,
        experience_years: values.experienceYears,
        main_city: values.mainCity,
        service_region: values.serviceRegion
      },
      { onConflict: "user_id" }
    ),
    "Profilul a fost creat, dar detaliile de șofer nu au putut fi salvate."
  );

  await expectSupabaseSuccess(
    supabase.from("vehicles").insert({
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
    }),
    "Profilul de șofer a fost creat, dar vehiculul nu a putut fi salvat."
  );

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

  const profileRole = {
    role: "roadside_operator",
    activeInstance: "roadside",
    registrationStatus: "pending_review"
  } satisfies Pick<Profile, "role" | "activeInstance" | "registrationStatus">;
  const { user, session } = await createAuthUser(values, {
    ...buildBaseMetadata(values, profileRole),
    ...buildRoadsideMetadata(values)
  });
  const profile = buildRegistrationProfile(user.id, values, profileRole);

  if (!session) {
    return getConfirmationResult(profile);
  }

  await upsertProfile(profile);

  await expectSupabaseSuccess(
    supabase.from("roadside_operator_profiles").upsert(
      {
        user_id: profile.id,
        company_name: values.companyName,
        fiscal_code: values.fiscalCode,
        dispatcher_phone: values.dispatcherPhone,
        company_email: values.companyEmail,
        main_city: values.mainCity,
        service_regions: values.serviceRegions.split(",").map((item) => item.trim()).filter(Boolean),
        service_types: values.serviceTypes
      },
      { onConflict: "user_id" }
    ),
    "Profilul a fost creat, dar detaliile operatorului roadside nu au putut fi salvate."
  );

  await expectSupabaseSuccess(
    supabase.from("vehicles").insert({
      driver_id: null,
      owner_id: profile.id,
      owner_role: "roadside_operator",
      vehicle_type: values.interventionVehicleType,
      plate_number: values.interventionPlateNumber,
      capacity_kg: values.towingCapacity,
      status: "offline",
      vehicle_status: "pending_review"
    }),
    "Profilul operatorului a fost creat, dar vehiculul de intervenție nu a putut fi salvat."
  );

  return setAuthenticatedProfile(profile);
}
