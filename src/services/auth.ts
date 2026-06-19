import { getCurrentProfile, getProfileById, resolveEmailForIdentifier } from "@/services/profiles";
import { getDashboardPathForRole, INSTANCE_TO_ROLE, isInstanceAllowed } from "@/services/roleRedirect";
import { signUpCustomer, signUpDriver, signUpRoadsideOperator } from "@/services/registration";
import { isSupabaseConfigured, supabase } from "@/services/supabase";
import { useAppStore } from "@/store/useAppStore";
import type { AuthInstance, Profile } from "@/types/domain";
import type { LoginFormValues } from "@/validation/authSchemas";

function createLocalLoginProfile(instance: AuthInstance): Profile {
  const role = INSTANCE_TO_ROLE[instance];
  return {
    id: `demo-${instance}`,
    email: `${instance}@rider.local`,
    phone: "+40 700 000 000",
    username: `demo_${instance}`,
    fullName:
      instance === "customer" ? "Client Demo" : instance === "driver" ? "Șofer Demo" : "Operator Roadside Demo",
    role,
    activeInstance: instance,
    registrationStatus: "active",
    theme: useAppStore.getState().theme
  };
}

async function writeLoginAudit(input: {
  profile?: Profile | null;
  instance: AuthInstance;
  success: boolean;
  reason?: string;
}) {
  if (!isSupabaseConfigured) {
    return;
  }

  await supabase.from("login_audit_events").insert({
    user_id: input.profile?.id,
    requested_instance: input.instance,
    resolved_role: input.profile?.role,
    success: input.success,
    failure_reason: input.reason,
    user_agent: navigator.userAgent
  });
}

export async function signInWithRole(values: LoginFormValues, instance: AuthInstance) {
  if (!isSupabaseConfigured) {
    const profile = createLocalLoginProfile(instance);
    useAppStore.getState().setProfile(profile);
    useAppStore.getState().setActiveInstance(instance);
    return {
      profile,
      redirectTo: getDashboardPathForRole(profile)
    };
  }

  const email = await resolveEmailForIdentifier(values.identifier);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: values.password
  });

  if (error || !data.user) {
    await writeLoginAudit({ instance, success: false, reason: error?.message || "auth_failed" });
    throw new Error("Email, username sau parolă incorecte.");
  }

  const profile = await getProfileById(data.user.id);

  if (!profile) {
    await writeLoginAudit({ instance, success: false, reason: "profile_missing" });
    await supabase.auth.signOut();
    throw new Error("Profilul contului nu a fost găsit.");
  }

  if (!isInstanceAllowed(profile, instance)) {
    await writeLoginAudit({ profile, instance, success: false, reason: "wrong_instance" });
    await supabase.auth.signOut();
    throw new Error("Acest cont aparține altui portal. Alege tabul corect.");
  }

  useAppStore.getState().setProfile(profile);
  useAppStore.getState().setActiveInstance(instance);
  await writeLoginAudit({ profile, instance, success: true });

  return {
    profile,
    redirectTo: getDashboardPathForRole(profile)
  };
}

export async function signOut() {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }

  useAppStore.getState().setProfile(null);
  useAppStore.getState().setAuthStatus("anonymous");
}

export async function getCurrentSession() {
  if (!isSupabaseConfigured) {
    return null;
  }

  const { data } = await supabase.auth.getSession();
  return data.session;
}

export { getCurrentProfile, signUpCustomer, signUpDriver, signUpRoadsideOperator };
