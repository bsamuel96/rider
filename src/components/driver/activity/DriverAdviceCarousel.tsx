import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const tips = [
  "Apelează pasagerul înainte de a anula.",
  "Acceptă cursele doar când poți ajunge în timpul estimat.",
  "Folosește pauza când ieși din zona activă.",
  "Verifică pickup-ul pe hartă înainte să pornești."
];

export function DriverAdviceCarousel() {
  const [index, setIndex] = useState(0);
  const tip = tips[index];

  return (
    <section className="rounded-3xl border border-border/60 bg-primary/10 p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <Lightbulb className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Recomandare</p>
          <p className="mt-1 text-sm text-muted-foreground">{tip}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          {index + 1}/{tips.length}
        </span>
        <div className="flex gap-2">
          <Button type="button" size="icon" variant="outline" onClick={() => setIndex((current) => (current === 0 ? tips.length - 1 : current - 1))} aria-label="Recomandarea anterioară">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button type="button" size="icon" variant="outline" onClick={() => setIndex((current) => (current + 1) % tips.length)} aria-label="Recomandarea următoare">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
