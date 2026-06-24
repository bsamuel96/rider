import { Banknote, CarFront, Crown, Route } from "lucide-react";
import { useState } from "react";
import { MinimizableBottomSheet } from "@/components/mobile/MinimizableBottomSheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";

type DriverPreferencesSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function DriverPreferencesSheet({ open, onClose }: DriverPreferencesSheetProps) {
  const { toast } = useToast();
  const [cash, setCash] = useState(true);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [pickupDistance, setPickupDistance] = useState("5 km");

  if (!open) {
    return null;
  }

  return (
    <MinimizableBottomSheet title="Preferințe curse" description="Filtre demo pentru cererile pe care le primești." initialState="half" dismissible onStateChange={(state) => state === "closed" && onClose()}>
      <div className="space-y-4">
        <PreferenceToggle
          icon={Banknote}
          title="Curse cu numerar"
          description="Primește curse unde pasagerul plătește cash."
          checked={cash}
          onClick={() => setCash((value) => !value)}
        />
        <PreferenceToggle
          icon={Crown}
          title="Premium only"
          description="Demo: disponibil doar pentru șoferi eligibili."
          checked={premiumOnly}
          onClick={() => setPremiumOnly((value) => !value)}
        />
        <div>
          <p className="text-sm font-semibold">Distanță maximă pickup</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {["3 km", "5 km", "8 km"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPickupDistance(item)}
                className={cn(
                  "min-h-11 rounded-xl border px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  pickupDistance === item ? "border-primary bg-primary text-primary-foreground" : "bg-background/70"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <Button
          type="button"
          className="w-full"
          onClick={() =>
            toast({
              title: "Preferințe salvate",
              description: `Cash ${cash ? "activ" : "oprit"}, pickup maxim ${pickupDistance}.`,
              tone: "success"
            })
          }
        >
          <Route className="h-4 w-4" aria-hidden="true" />
          Aplică filtrele
        </Button>
      </div>
    </MinimizableBottomSheet>
  );
}

type PreferenceToggleProps = {
  icon: typeof CarFront;
  title: string;
  description: string;
  checked: boolean;
  onClick: () => void;
};

function PreferenceToggle({ icon: Icon, title, description, checked, onClick }: PreferenceToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full min-h-14 items-center justify-between gap-3 rounded-2xl bg-muted/60 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-background text-primary">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-sm font-semibold">{title}</span>
          <span className="block text-xs text-muted-foreground">{description}</span>
        </span>
      </span>
      <span className={cn("h-6 w-11 rounded-full p-1 transition-colors", checked ? "bg-primary" : "bg-muted-foreground/25")}>
        <span className={cn("block h-4 w-4 rounded-full bg-white transition-transform", checked && "translate-x-5")} />
      </span>
    </button>
  );
}
