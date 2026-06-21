import { Navigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { getSupportBasePath } from "@/utils/communicationRoutes";

export function SupportRedirect() {
  const profile = useAppStore((state) => state.profile);
  return <Navigate to={getSupportBasePath(profile)} replace />;
}
