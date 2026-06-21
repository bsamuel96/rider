import { CheckCircle2, MapPin } from "lucide-react";
import { NavigateToCustomerButton } from "@/components/navigation/NavigateToCustomerButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DEFAULT_CENTER } from "@/utils/constants";

const requests = [
  {
    id: "dn1-flat",
    label: "Pană - DN1",
    coordinates: { lat: DEFAULT_CENTER.lat + 0.027, lng: DEFAULT_CENTER.lng - 0.018 }
  },
  {
    id: "pipera-battery",
    label: "Baterie - Pipera",
    coordinates: { lat: DEFAULT_CENTER.lat + 0.018, lng: DEFAULT_CENTER.lng + 0.032 }
  },
  {
    id: "berceni-tow",
    label: "Tractare - Berceni",
    coordinates: { lat: DEFAULT_CENTER.lat - 0.035, lng: DEFAULT_CENTER.lng + 0.012 }
  }
];

export function RoadsideRequestsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Solicitări active</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acceptă intervenții și trimite ETA clientului.</p>
      </div>
      <div className="grid gap-3">
        {requests.map((request) => (
          <Card key={request.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-primary" />
              {request.label}
            </span>
            <div className="flex flex-col gap-2 sm:flex-row">
              <NavigateToCustomerButton coordinates={request.coordinates} label={request.label} compact>
                Navighează la client
              </NavigateToCustomerButton>
              <Button size="sm">
                <CheckCircle2 className="h-4 w-4" />
                Acceptă
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
