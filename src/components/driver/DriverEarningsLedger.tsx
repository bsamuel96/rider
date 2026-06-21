import { Banknote, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DriverEarningsLedgerEntry } from "@/types/domain";
import { formatCurrency } from "@/utils/format";

type DriverEarningsLedgerProps = {
  entries: DriverEarningsLedgerEntry[];
};

export function DriverEarningsLedger({ entries }: DriverEarningsLedgerProps) {
  if (entries.length === 0) {
    return (
      <Card className="p-5">
        <p className="font-semibold">Nicio încasare încă</p>
        <p className="mt-1 text-sm text-muted-foreground">Cursele finalizate vor apărea aici în demo și în producție.</p>
      </Card>
    );
  }

  return (
    <Card className="divide-y overflow-hidden">
      {entries.map((entry) => {
        const Icon = entry.paymentMethod === "cash" ? Banknote : CreditCard;

        return (
          <div key={entry.id} className="flex items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/12 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">{entry.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {entry.paymentMethod === "cash" ? "Cash" : "Card"} · {new Date(entry.createdAt).toLocaleTimeString("ro-RO", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </div>
            <strong className="text-sm">{formatCurrency(entry.amount)}</strong>
          </div>
        );
      })}
    </Card>
  );
}
