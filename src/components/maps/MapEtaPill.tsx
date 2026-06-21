import { MapEtaChip } from "@/components/maps/MapEtaChip";

type MapEtaPillProps = {
  label: string;
  minutes?: number;
  distanceKm?: number;
};

export function MapEtaPill(props: MapEtaPillProps) {
  return <MapEtaChip {...props} />;
}
