import { Car, CarFront, ShieldAlert, Sparkles, Truck, Wrench } from "lucide-react";
import type { ServiceType } from "@/types/domain";
import { cn } from "@/utils/cn";

type CustomerServiceChoicesProps = {
  onSelectRide: (serviceType: Extract<ServiceType, "standard" | "premium">) => void;
  onSelectTow: () => void;
  onSelectRoadside: () => void;
};

const choices = [
  {
    id: "standard",
    label: "Cursă standard",
    helper: "Rapid și economic",
    icon: Car
  },
  {
    id: "premium",
    label: "Premium",
    helper: "Confort ridicat",
    icon: CarFront,
    accentIcon: Sparkles
  },
  {
    id: "tow",
    label: "Tractare",
    helper: "Platformă pentru vehicul",
    icon: Truck
  },
  {
    id: "roadside",
    label: "Asistență rutieră",
    helper: "Pană, baterie, combustibil",
    icon: Wrench,
    accentIcon: ShieldAlert
  }
] as const;

export function CustomerServiceChoices({
  onSelectRide,
  onSelectTow,
  onSelectRoadside
}: CustomerServiceChoicesProps) {
  const handleSelect = (choiceId: (typeof choices)[number]["id"]) => {
    if (choiceId === "standard" || choiceId === "premium") {
      onSelectRide(choiceId);
      return;
    }

    if (choiceId === "tow") {
      onSelectTow();
      return;
    }

    onSelectRoadside();
  };

  return (
    <section className="grid min-h-[230px] grid-cols-2 gap-3">
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          onClick={() => handleSelect(choice.id)}
          className={cn(
            "glass-panel group flex min-h-24 flex-col items-start justify-between rounded-3xl p-4 text-left transition-colors hover:bg-muted/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            choice.id === "roadside" && "border-primary/35"
          )}
        >
          <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary transition-transform group-active:scale-95">
            <choice.icon className="h-5 w-5" aria-hidden="true" />
            {"accentIcon" in choice && choice.accentIcon && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-background text-primary shadow-map-control">
                <choice.accentIcon className="h-3 w-3" aria-hidden="true" />
              </span>
            )}
          </span>
          <span>
            <span className="block text-sm font-semibold">{choice.label}</span>
            <span className="mt-1 block text-xs text-muted-foreground">{choice.helper}</span>
          </span>
        </button>
      ))}
    </section>
  );
}
