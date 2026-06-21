import { CurrentLocationMapWidget } from "@/components/customer/CurrentLocationMapWidget";
import { RecentLocationList } from "@/components/customer/RecentLocationList";
import type { Coordinates, RecentLocation } from "@/types/domain";

type CustomerHomeLowerSectionProps = {
  recentLocations: RecentLocation[];
  position: Coordinates;
  onRecentLocationSelect: (location: RecentLocation) => void;
  onUseCurrentLocation: () => void;
};

export function CustomerHomeLowerSection({
  recentLocations,
  position,
  onRecentLocationSelect,
  onUseCurrentLocation
}: CustomerHomeLowerSectionProps) {
  if (recentLocations.length > 0) {
    return <RecentLocationList locations={recentLocations} onSelect={onRecentLocationSelect} />;
  }

  return <CurrentLocationMapWidget position={position} onUseCurrentLocation={onUseCurrentLocation} />;
}
