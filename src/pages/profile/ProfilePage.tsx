import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { useAppStore } from "@/store/useAppStore";
import type { Profile } from "@/types/domain";

export function ProfilePage() {
  const profile = useAppStore((state) => state.profile);
  const activeInstance = useAppStore((state) => state.activeInstance);
  const fallbackProfile: Profile = {
    id: "demo-profile",
    email: "demo@rider.local",
    phone: "+40 700 000 000",
    username: "demo-rider",
    fullName: "Utilizator Rider",
    role:
      activeInstance === "driver"
        ? "driver"
        : activeInstance === "roadside"
          ? "roadside_operator"
          : activeInstance === "fleet_manager"
            ? "fleet_manager"
            : "client",
    activeInstance,
    fleetScope: activeInstance === "fleet_manager" ? "both" : undefined,
    registrationStatus: "active",
    theme: "system",
    preferredPaymentMethod: "cash"
  };

  return <ProfileEditor profile={profile || fallbackProfile} />;
}
