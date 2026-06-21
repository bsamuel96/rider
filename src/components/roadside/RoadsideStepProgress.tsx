import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

export type RoadsideStep = "location" | "issue" | "photo" | "safety" | "confirm";

type RoadsideStepProgressProps = {
  currentStep: RoadsideStep;
};

const steps: RoadsideStep[] = ["location", "issue", "photo", "safety", "confirm"];

export function RoadsideStepProgress({ currentStep }: RoadsideStepProgressProps) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <nav className="flex items-center gap-1" aria-label="Pași solicitare roadside">
      {steps.map((step, index) => {
        const complete = index < currentIndex;
        const active = step === currentStep;

        return (
          <span
            key={step}
            className={cn(
              "h-2 flex-1 rounded-full bg-muted transition-colors",
              active && "bg-primary",
              complete && "bg-primary/55"
            )}
          >
            {complete && <Check className="sr-only" aria-hidden="true" />}
          </span>
        );
      })}
    </nav>
  );
}
