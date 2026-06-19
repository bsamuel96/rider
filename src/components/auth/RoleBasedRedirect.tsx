import { Navigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { getDashboardPathForRole } from "@/services/roleRedirect";

export function RoleBasedRedirect() {
  const profile = useAppStore((state) => state.profile);

  return <Navigate to={getDashboardPathForRole(profile)} replace />;
}
