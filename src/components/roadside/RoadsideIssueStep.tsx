import { CarFront, Fuel, KeyRound, ShieldAlert, Wrench, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RoadsideIssue } from "@/types/domain";
import { cn } from "@/utils/cn";

type RoadsideIssueStepProps = {
  mode: "roadside" | "tow";
  issueType: RoadsideIssue;
  description: string;
  vehicleType: string;
  towDestination: string;
  canRoll: boolean;
  safePlace: boolean;
  onIssueChange: (issue: RoadsideIssue) => void;
  onDescriptionChange: (value: string) => void;
  onVehicleTypeChange: (value: string) => void;
  onTowDestinationChange: (value: string) => void;
  onCanRollChange: (value: boolean) => void;
  onSafePlaceChange: (value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
};

const issueOptions: Array<{ value: RoadsideIssue; label: string; icon: typeof Wrench }> = [
  { value: "flat_tire", label: "Pană", icon: Wrench },
  { value: "battery", label: "Baterie descărcată", icon: Zap },
  { value: "accident", label: "Accident", icon: ShieldAlert },
  { value: "fuel", label: "Fără combustibil", icon: Fuel },
  { value: "engine", label: "Motor / defecțiune", icon: CarFront },
  { value: "locked_keys", label: "Chei blocate", icon: KeyRound },
  { value: "other", label: "Altceva", icon: Wrench }
];

export function RoadsideIssueStep({
  mode,
  issueType,
  description,
  vehicleType,
  towDestination,
  canRoll,
  safePlace,
  onIssueChange,
  onDescriptionChange,
  onVehicleTypeChange,
  onTowDestinationChange,
  onCanRollChange,
  onSafePlaceChange,
  onNext,
  onBack
}: RoadsideIssueStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold">{mode === "tow" ? "Detalii tractare" : "Alege problema"}</p>
        <p className="mt-1 text-xs text-muted-foreground">Alege opțiunea cea mai apropiată. Poți adăuga detalii scurte.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {issueOptions.map((issue) => (
          <button
            key={issue.value}
            type="button"
            onClick={() => onIssueChange(issue.value)}
            className={cn(
              "min-h-12 rounded-xl border border-border/60 bg-background/55 px-3 text-left text-xs font-semibold transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              issueType === issue.value && "border-primary bg-primary text-primary-foreground"
            )}
          >
            <issue.icon className="mb-1 h-4 w-4" aria-hidden="true" />
            {issue.label}
          </button>
        ))}
      </div>

      {mode === "tow" && (
        <div className="grid gap-3">
          <div className="space-y-2">
            <Label htmlFor="vehicle-type">Tip vehicul</Label>
            <Input
              id="vehicle-type"
              value={vehicleType}
              onChange={(event) => onVehicleTypeChange(event.target.value)}
              placeholder="Ex: autoturism, SUV, dubă"
              className="bg-background/70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tow-destination">Service / destinație opțională</Label>
            <Input
              id="tow-destination"
              value={towDestination}
              onChange={(event) => onTowDestinationChange(event.target.value)}
              placeholder="Poți adăuga mai târziu"
              className="bg-background/70"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={canRoll} onChange={(event) => onCanRollChange(event.target.checked)} />
            Mașina poate fi rulată/împinsă
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={safePlace} onChange={(event) => onSafePlaceChange(event.target.checked)} />
            Vehiculul este într-un loc sigur
          </label>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="roadside-description">Observații</Label>
        <Textarea
          id="roadside-description"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Descrie pe scurt situația."
          className="min-h-24 bg-background/70"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onBack}
          className="min-h-11 rounded-xl border border-border/60 bg-background/55 px-4 text-sm font-semibold"
        >
          Înapoi
        </button>
        <button
          type="button"
          onClick={onNext}
          className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          disabled={!description.trim()}
        >
          Continuă
        </button>
      </div>
    </div>
  );
}
