import type { AuthInstance, Profile, UserRole } from "@/types/domain";

export const INSTANCE_TO_ROLE: Record<AuthInstance, Exclude<UserRole, "admin">> = {
  customer: "client",
  driver: "driver",
  roadside: "roadside_operator",
  fleet_manager: "fleet_manager"
};

export const ROLE_TO_INSTANCE: Record<Exclude<UserRole, "admin">, AuthInstance> = {
  client: "customer",
  driver: "driver",
  roadside_operator: "roadside",
  fleet_manager: "fleet_manager"
};

export const ROLE_LABELS: Record<UserRole, string> = {
  client: "Client",
  driver: "Șofer",
  roadside_operator: "Tractare & Asistență",
  fleet_manager: "Fleet Manager",
  admin: "Administrator"
};

export const INSTANCE_LABELS: Record<AuthInstance, string> = {
  customer: "Client",
  driver: "Șofer",
  roadside: "Tractare & Asistență",
  fleet_manager: "Fleet Manager"
};

export function getDashboardPathForRole(profile: Profile | null) {
  if (!profile) {
    return "/auth";
  }

  if (profile.role === "client") {
    return "/customer";
  }

  if (profile.role === "driver") {
    return profile.registrationStatus === "active" ? "/driver" : "/driver/pending";
  }

  if (profile.role === "roadside_operator") {
    return profile.registrationStatus === "active" ? "/roadside-operator" : "/roadside-operator/pending";
  }

  if (profile.role === "fleet_manager") {
    return "/fleet-manager";
  }

  return "/admin";
}

export function getProfilePathForRole(profile: Profile | null) {
  if (!profile) {
    return "/auth";
  }

  if (profile.role === "client") {
    return "/customer/profile";
  }

  if (profile.role === "driver") {
    return "/driver/profile";
  }

  if (profile.role === "roadside_operator") {
    return "/roadside-operator/profile";
  }

  if (profile.role === "fleet_manager") {
    return "/fleet-manager/profile";
  }

  return "/admin/users";
}

export function isInstanceAllowed(profile: Profile, instance: AuthInstance) {
  if (profile.role === "admin") {
    return true;
  }

  return INSTANCE_TO_ROLE[instance] === profile.role;
}
