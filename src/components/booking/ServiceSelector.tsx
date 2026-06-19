import { BatteryCharging, Car, Check, Crown, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ServiceType } from "@/types/domain";
import { SERVICE_OPTIONS } from "@/utils/constants";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format";

const icons = {
  standard: Car,
  premium: Crown,
  tow: Truck,
  roadside: BatteryCharging
};

type ServiceSelectorProps = {
  selected?: ServiceType;
  distanceKm?: number;
  price?: number;
  onSelect: (type: ServiceType) => void;
};

export function ServiceSelector({ selected, distanceKm, price, onSelect }: ServiceSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {SERVICE_OPTIONS.map((option) => {
        const Icon = icons[option.type];
        const isSelected = selected === option.type;
        const estimatedPrice = isSelected && price ? price : option.basePrice + Math.round((distanceKm || 3) * 2.2);

        return (
          <Card
            key={option.type}
            className={cn(
              "p-4 transition-colors",
              isSelected && "border-primary bg-primary/10 ring-1 ring-primary"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-secondary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{option.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
                </div>
              </div>
              {isSelected && <Check className="h-5 w-5 text-primary" />}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Timp estimat</p>
                <p className="font-semibold">{option.etaMinutes} min</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Preț estimat</p>
                <p className="font-semibold">{formatCurrency(estimatedPrice)}</p>
              </div>
            </div>

            <Button
              type="button"
              variant={isSelected ? "default" : "outline"}
              className="mt-4 w-full"
              onClick={() => onSelect(option.type)}
            >
              Selectează
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
