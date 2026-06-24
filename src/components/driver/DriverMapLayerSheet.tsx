import { Check, Flame, Layers, Moon, Route } from "lucide-react";
import { useState } from "react";
import { MinimizableBottomSheet } from "@/components/mobile/MinimizableBottomSheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";

type DriverMapLayerSheetProps = {
  open: boolean;
  onClose: () => void;
};

const layers = [
  { id: "standard", label: "Standard", helper: "Hartă OSM curată", icon: Layers },
  { id: "dark", label: "Dark", helper: "Contrast ridicat pe timp de noapte", icon: Moon },
  { id: "traffic", label: "Traffic demo", helper: "Simulare zone lente", icon: Route },
  { id: "demand", label: "Demand zones", helper: "Zone cu cerere ridicată", icon: Flame }
];

export function DriverMapLayerSheet({ open, onClose }: DriverMapLayerSheetProps) {
  const [selectedLayer, setSelectedLayer] = useState("demand");
  const { toast } = useToast();

  if (!open) {
    return null;
  }

  return (
    <MinimizableBottomSheet title="Straturi hartă" description="Alege ce vezi peste harta operațională." initialState="half" dismissible onStateChange={(state) => state === "closed" && onClose()}>
      <div className="space-y-3">
        {layers.map((layer) => (
          <button
            key={layer.id}
            type="button"
            onClick={() => setSelectedLayer(layer.id)}
            className={cn(
              "flex w-full min-h-14 items-center justify-between gap-3 rounded-2xl border p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selectedLayer === layer.id ? "border-primary bg-primary/12" : "border-border/60 bg-muted/50"
            )}
          >
            <span className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-background text-primary">
                <layer.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{layer.label}</span>
                <span className="block text-xs text-muted-foreground">{layer.helper}</span>
              </span>
            </span>
            {selectedLayer === layer.id && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
          </button>
        ))}
        <Button
          type="button"
          className="w-full"
          onClick={() =>
            toast({
              title: "Strat aplicat",
              description: `Harta folosește acum: ${layers.find((layer) => layer.id === selectedLayer)?.label}.`,
              tone: "success"
            })
          }
        >
          Aplică
        </Button>
      </div>
    </MinimizableBottomSheet>
  );
}
