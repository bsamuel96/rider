import { ShieldCheck } from "lucide-react";
import { roadsideSafetyInstructions, type RoadsideSafetyMode } from "@/config/roadsideSafetyInstructions";

type RoadsideSafetyStepProps = {
  mode: RoadsideSafetyMode;
  acknowledged: boolean;
  onAcknowledge: () => void;
  onBack: () => void;
};

export function RoadsideSafetyStep({ mode, acknowledged, onAcknowledge, onBack }: RoadsideSafetyStepProps) {
  const content = roadsideSafetyInstructions[mode];

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold">{content.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">Instrucțiuni generale, adaptabile regulilor locale.</p>
        </div>
      </div>
      <ol className="grid gap-2 text-sm">
        {content.items.map((instruction, index) => (
          <li key={instruction} className="flex gap-2 rounded-xl bg-muted/55 p-3">
            <span className="font-semibold text-primary">{index + 1}.</span>
            <span>{instruction}</span>
          </li>
        ))}
      </ol>
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
          onClick={onAcknowledge}
          className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          {acknowledged ? "Am înțeles" : "Am înțeles"}
        </button>
      </div>
    </div>
  );
}
