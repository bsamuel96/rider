import { ShieldCheck, TimerReset, Zap } from "lucide-react";
import type { RoadsideGuaranteeStatus } from "@/hooks/useRoadsideGuarantee";

type RoadsideGuaranteeBannerProps = {
  status: RoadsideGuaranteeStatus;
  remainingMinutes?: number;
  operatorView?: boolean;
};

export function RoadsideGuaranteeBanner({ status, remainingMinutes, operatorView }: RoadsideGuaranteeBannerProps) {
  if (status === "inactive") {
    return null;
  }

  if (status === "applied" || status === "expired_pending_apply") {
    return (
      <div className="flex items-start gap-2 rounded-2xl bg-amber-500/12 p-3 text-xs font-semibold text-amber-700 dark:text-amber-300">
        <TimerReset className="mt-0.5 h-4 w-4" aria-hidden="true" />
        {operatorView
          ? "Garanția rapidă a fost aplicată. Clientul plătește tariful normal."
          : "Echipajul nu a ajuns în 30 min. Prețul a revenit la tariful normal."}
      </div>
    );
  }

  if (status === "satisfied") {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-primary/12 p-3 text-xs font-semibold text-primary">
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        Garanția rapidă a fost respectată.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl bg-primary/12 p-3 text-xs font-semibold text-primary">
      <Zap className="h-4 w-4" aria-hidden="true" />
      Rapid · garanție 30 min · {remainingMinutes ?? 30} min rămase
    </div>
  );
}
