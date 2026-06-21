import { Zap } from "lucide-react";
import type { RoadsideSpeedTier } from "@/types/domain";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";

type RoadsideSpeedSelectorProps = {
  value: RoadsideSpeedTier;
  onChange: (tier: RoadsideSpeedTier) => void;
  normalPrice: number;
};

export function RoadsideSpeedSelector({ value, onChange, normalPrice }: RoadsideSpeedSelectorProps) {
  const fastPrice = Math.round(normalPrice * 1.5);

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <SpeedCard
          selected={value === "normal"}
          title="Normal"
          helper="Timp standard de sosire"
          price={normalPrice}
          onClick={() => onChange("normal")}
        />
        <SpeedCard
          selected={value === "fast"}
          title="Rapid · +50%"
          helper="Prioritate ridicată"
          price={fastPrice}
          badge="Garanție 30 min"
          onClick={() => onChange("fast")}
        />
      </div>
      {value === "fast" && (
        <p className="rounded-2xl bg-primary/12 p-3 text-xs font-medium text-primary">
          Dacă echipajul nu ajunge în 30 min, plătești tariful normal.
        </p>
      )}
    </div>
  );
}

type SpeedCardProps = {
  selected: boolean;
  title: string;
  helper: string;
  price: number;
  badge?: string;
  onClick: () => void;
};

function SpeedCard({ selected, title, helper, price, badge, onClick }: SpeedCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-28 rounded-3xl border border-border/60 bg-background/60 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected && "border-primary bg-primary/12"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
        </div>
        {badge && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2 py-1 text-[11px] font-semibold text-primary">
            <Zap className="h-3 w-3" aria-hidden="true" />
            {badge}
          </span>
        )}
      </div>
      <p className="mt-4 text-lg font-black">{formatCurrency(price)}</p>
    </button>
  );
}
