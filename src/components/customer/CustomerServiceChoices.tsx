import { Car, ShieldAlert, Sparkles, Truck } from "lucide-react";
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
    icon: Sparkles
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
    icon: ShieldAlert
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
            "glass-panel flex min-h-24 flex-col items-start justify-between p-4 text-left transition-colors hover:bg-muted/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            choice.id === "roadside" && "border-primary/35"
          )}
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
            <choice.icon className="h-5 w-5" aria-hidden="true" />
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
