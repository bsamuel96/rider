import { type PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import type { UserRole } from "@/types/domain";
import { getDashboardPathForRole } from "@/services/roleRedirect";

type ProtectedRouteProps = PropsWithChildren<{
  allowedRoles: UserRole[];
}>;

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const location = useLocation();
  const profile = useAppStore((state) => state.profile);

  if (!profile) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  const roleAllowed = profile.role === "admin" || allowedRoles.includes(profile.role);

  if (!roleAllowed) {
    return <Navigate to={getDashboardPathForRole(profile)} replace state={{ redirected: true }} />;
  }

  const isPendingPath = location.pathname.endsWith("/pending");
  const requiresReview = profile.role === "driver" || profile.role === "roadside_operator";

  if (requiresReview && profile.registrationStatus !== "active" && !isPendingPath && profile.role !== "admin") {
    return <Navigate to={getDashboardPathForRole(profile)} replace />;
  }

  return <>{children}</>;
}
