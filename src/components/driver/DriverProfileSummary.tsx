import { Award, ShieldCheck, Star } from "lucide-react";
import type { Profile } from "@/types/domain";
import { cn } from "@/utils/cn";

type DriverProfileSummaryProps = {
  profile: Profile | null;
  compact?: boolean;
};

export function DriverProfileSummary({ profile, compact }: DriverProfileSummaryProps) {
  const initials = (profile?.fullName || "Șofer Demo")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className={cn("rounded-2xl border border-border/60 bg-muted/45 p-4", compact && "p-3")}>
      <div className="flex items-center gap-3">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary text-base font-black text-primary-foreground">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold">{profile?.fullName || "Șofer Demo"}</p>
          <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] font-semibold">
            <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-1">
              <Award className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Silver
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-1">
              <Star className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              4.96
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-1">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Verificat
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
