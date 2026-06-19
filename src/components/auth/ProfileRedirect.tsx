import { Navigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { getProfilePathForRole } from "@/services/roleRedirect";

export function ProfileRedirect() {
  const profile = useAppStore((state) => state.profile);

  return <Navigate to={getProfilePathForRole(profile)} replace />;
}
