import { divIcon, type DivIcon } from "leaflet";
import { CarFront, CircleDot, Flag, Truck, UserRound, Wrench } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { Marker } from "react-leaflet";
import type { Coordinates } from "@/types/domain";
import { cn } from "@/utils/cn";

export type MapActorType = "user" | "driver" | "roadside" | "tow" | "pickup" | "destination";

type MapActorMarkerProps = {
  type: MapActorType;
  position?: Coordinates;
  label: string;
  etaLabel?: string;
  pulse?: boolean;
  heading?: number;
};

const iconByType = {
  user: UserRound,
  driver: CarFront,
  roadside: Wrench,
  tow: Truck,
  pickup: CircleDot,
  destination: Flag
};

const toneByType: Record<MapActorType, string> = {
  user: "map-actor-user",
  driver: "map-actor-driver",
  roadside: "map-actor-roadside",
  tow: "map-actor-roadside",
  pickup: "map-actor-pickup",
  destination: "map-actor-destination"
};

function createActorIcon({ type, label, etaLabel, pulse, heading }: Omit<MapActorMarkerProps, "position">): DivIcon {
  const Icon = iconByType[type];
  const markup = renderToStaticMarkup(
    <div className={cn("map-actor-marker", toneByType[type], pulse && "map-actor-pulse")}>
      <span className="map-actor-icon" style={{ transform: heading ? `rotate(${heading}deg)` : undefined }}>
        <Icon size={16} strokeWidth={2.4} />
      </span>
      <span className="map-actor-label">
        {label}
        {etaLabel && <strong>{etaLabel}</strong>}
      </span>
    </div>
  );

  return divIcon({
    className: "",
    html: markup,
    iconSize: [132, 42],
    iconAnchor: [22, 22]
  });
}

export function MapActorMarker({ position, ...props }: MapActorMarkerProps) {
  if (!position) {
    return null;
  }

  return <Marker position={[position.lat, position.lng]} icon={createActorIcon(props)} />;
}
