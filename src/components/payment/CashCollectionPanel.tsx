import { Banknote, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapFloatingPanel } from "@/components/maps/MapFloatingPanel";
import type { CashStatus } from "@/types/domain";
import { formatCurrency } from "@/utils/format";

type CashCollectionPanelProps = {
  amount: number;
  status: CashStatus;
  onCollected: () => void;
};

export function CashCollectionPanel({ amount, status, onCollected }: CashCollectionPanelProps) {
  if (status === "not_required") {
    return null;
  }

  return (
    <MapFloatingPanel className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Banknote className="h-4 w-4 text-primary" />
          Cash de încasat
        </span>
        <span className="font-semibold">{formatCurrency(amount)}</span>
      </div>
      <Button className="w-full" onClick={onCollected} disabled={status === "collected"}>
        <CheckCircle2 className="h-4 w-4" />
        {status === "collected" ? "Cash încasat" : "Am încasat"}
      </Button>
    </MapFloatingPanel>
  );
}
