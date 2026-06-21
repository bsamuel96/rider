import { Navigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { getChatBasePath } from "@/utils/communicationRoutes";

export function ChatRedirect() {
  const profile = useAppStore((state) => state.profile);
  const threadId = profile?.role === "roadside_operator" ? "roadside-demo-roadside-active" : "ride-demo-booking-active";
  return <Navigate to={`${getChatBasePath(profile)}/${threadId}`} replace />;
}
