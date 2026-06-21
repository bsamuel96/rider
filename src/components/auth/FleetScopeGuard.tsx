import { type PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import type { FleetScope } from "@/types/domain";

type FleetScopeGuardProps = PropsWithChildren<{
  scope: Exclude<FleetScope, "both">;
}>;

export function FleetScopeGuard({ scope, children }: FleetScopeGuardProps) {
  const profile = useAppStore((state) => state.profile);

  if (!profile) {
    return <Navigate to="/auth" replace />;
  }

  if (profile.role === "admin") {
    return <>{children}</>;
  }

  const fleetScope = profile.fleetScope || "both";

  if (fleetScope !== "both" && fleetScope !== scope) {
    return <Navigate to="/fleet-manager" replace state={{ deniedFleetScope: scope }} />;
  }

  return <>{children}</>;
}
