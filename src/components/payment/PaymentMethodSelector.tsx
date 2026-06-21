import { Banknote, CreditCard } from "lucide-react";
import type { PaymentMethod } from "@/types/domain";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format";

type PaymentMethodSelectorProps = {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  fareEstimate?: number;
  compact?: boolean;
  className?: string;
};

const paymentOptions: Array<{
  value: PaymentMethod;
  label: string;
  icon: typeof CreditCard;
}> = [
  { value: "card", label: "Card", icon: CreditCard },
  { value: "cash", label: "Cash", icon: Banknote }
];

export function PaymentMethodSelector({
  value,
  onChange,
  fareEstimate,
  compact,
  className
}: PaymentMethodSelectorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="glass-dock grid grid-cols-2 gap-2 p-1.5">
        {paymentOptions.map((option) => {
          const Icon = option.icon;
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={cn(
                "flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected && "bg-primary text-primary-foreground shadow-map-control"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{option.label}</span>
              {fareEstimate !== undefined && (!compact || selected) && (
                <span className={cn("text-xs", selected ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {compact ? formatCurrency(fareEstimate) : `~${formatCurrency(fareEstimate)}`}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {!compact && <p className="px-1 text-xs text-muted-foreground">Poți schimba metoda înainte de confirmare.</p>}
    </div>
  );
}
