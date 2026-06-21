import { MapPinned, Sparkles } from "lucide-react";

type CustomerWelcomeHeroProps = {
  firstName: string;
};

export function CustomerWelcomeHero({ firstName }: CustomerWelcomeHeroProps) {
  return (
    <section className="flex min-h-16 items-center justify-between gap-4 rounded-3xl px-1">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Salut, {firstName}</p>
        <h1 className="mt-1 text-xl font-black leading-tight">Unde mergem azi?</h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary shadow-map-control">
          <MapPinned className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="hidden h-11 items-center gap-2 rounded-2xl bg-muted/70 px-3 text-xs font-semibold sm:inline-flex">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          Rapid
        </span>
      </div>
    </section>
  );
}
