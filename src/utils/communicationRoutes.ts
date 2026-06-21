import type { Profile } from "@/types/domain";

export function getSupportBasePath(profile?: Profile | null) {
  if (profile?.role === "driver") {
    return "/driver/support";
  }

  if (profile?.role === "roadside_operator") {
    return "/roadside-operator/support";
  }

  if (profile?.role === "fleet_manager") {
    return "/fleet-manager/support";
  }

  if (profile?.role === "admin") {
    return "/admin/support";
  }

  return "/customer/support";
}

export function getChatBasePath(profile?: Profile | null) {
  if (profile?.role === "driver") {
    return "/driver/chat";
  }

  if (profile?.role === "roadside_operator") {
    return "/roadside-operator/chat";
  }

  return "/customer/chat";
}

export function getHomePath(profile?: Profile | null) {
  if (profile?.role === "driver") {
    return "/driver";
  }

  if (profile?.role === "roadside_operator") {
    return "/roadside-operator";
  }

  if (profile?.role === "fleet_manager") {
    return "/fleet-manager";
  }

  if (profile?.role === "admin") {
    return "/admin";
  }

  return "/customer";
}
