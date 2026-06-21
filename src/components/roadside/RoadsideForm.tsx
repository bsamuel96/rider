import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RoadsideIssue } from "@/types/domain";
import { cn } from "@/utils/cn";

const issueOptions: { value: RoadsideIssue; label: string }[] = [
  { value: "flat_tire", label: "Pană" },
  { value: "battery", label: "Baterie" },
  { value: "engine", label: "Motor" },
  { value: "accident", label: "Accident" },
  { value: "fuel", label: "Combustibil" },
  { value: "locked_keys", label: "Chei blocate" },
  { value: "other", label: "Altceva" }
];

const roadsideSchema = z.object({
  issueType: z.enum(["flat_tire", "battery", "engine", "accident", "fuel", "locked_keys", "other"]),
  description: z.string().min(6, "Adaugă câteva detalii pentru operator.")
});

export type RoadsideFormValues = z.infer<typeof roadsideSchema>;

type RoadsideFormProps = {
  onSubmit: (values: RoadsideFormValues) => void;
};

export function RoadsideForm({ onSubmit }: RoadsideFormProps) {
  const form = useForm<RoadsideFormValues>({
    resolver: zodResolver(roadsideSchema),
    defaultValues: {
      issueType: "flat_tire",
      description: ""
    }
  });

  const selectedIssue = form.watch("issueType");

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label>Tip problemă</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {issueOptions.map((issue) => (
            <button
              type="button"
              key={issue.value}
              aria-pressed={selectedIssue === issue.value}
              onClick={() => form.setValue("issueType", issue.value, { shouldValidate: true })}
              className={cn(
                "h-11 rounded-xl border px-3 text-sm font-semibold transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selectedIssue === issue.value
                  ? "border-primary bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-md ring-2 ring-primary/30"
                  : "border-border/60 bg-background/55 text-foreground hover:border-primary/45 hover:bg-muted/70"
              )}
            >
              {issue.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Observații</Label>
        <Textarea id="description" placeholder="Descrie ce s-a întâmplat și unde este vehiculul." {...form.register("description")} />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="photos">Poze</Label>
        <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-background/45 p-4 text-sm text-muted-foreground transition-colors hover:bg-muted/60">
          <Camera className="h-5 w-5" />
          Upload multiplu pentru avarii sau poziția vehiculului
          <input id="photos" type="file" multiple accept="image/*" className="sr-only" />
        </label>
      </div>

      <Button type="submit" className="w-full" size="lg">
        <Send className="h-4 w-4" />
        Solicită intervenție
      </Button>
    </form>
  );
}
