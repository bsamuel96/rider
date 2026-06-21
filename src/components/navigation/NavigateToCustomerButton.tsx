import { useState } from "react";
import { Navigation, Route } from "lucide-react";
import { NavigationProviderSheet } from "@/components/navigation/NavigationProviderSheet";
import { Button } from "@/components/ui/button";
import { openNavigationToCoordinates } from "@/services/navigation";
import type { Coordinates } from "@/types/domain";
import { cn } from "@/utils/cn";

type NavigateToCustomerButtonProps = {
  coordinates?: Coordinates;
  label?: string;
  children?: string;
  compact?: boolean;
  className?: string;
};

export function NavigateToCustomerButton({
  coordinates,
  label = "Client Rider",
  children = "Navighează la client",
  compact = false,
  className
}: NavigateToCustomerButtonProps) {
  const [providerSheetOpen, setProviderSheetOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const disabled = !coordinates;

  const openNavigation = () => {
    if (!coordinates) {
      return;
    }

    try {
      setError(null);
      openNavigationToCoordinates({
        lat: coordinates.lat,
        lng: coordinates.lng,
        label
      });
    } catch {
      setError("Nu am putut deschide navigația.");
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Button
          type="button"
          size={compact ? "sm" : "default"}
          onClick={openNavigation}
          disabled={disabled}
          aria-label={children}
          className="min-w-0"
        >
          <Navigation className="h-4 w-4" aria-hidden="true" />
          {compact ? "Navighează" : children}
        </Button>
        <Button
          type="button"
          size={compact ? "sm" : "icon"}
          variant="outline"
          onClick={() => setProviderSheetOpen(true)}
          disabled={disabled}
          aria-label="Alege aplicația de navigație"
        >
          <Route className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      <NavigationProviderSheet
        open={providerSheetOpen}
        coordinates={coordinates}
        label={label}
        onClose={() => setProviderSheetOpen(false)}
      />
    </div>
  );
}
