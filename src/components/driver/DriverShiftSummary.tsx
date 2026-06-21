import { Banknote, Clock, Route } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DriverShiftSummary as DriverShiftSummaryData } from "@/types/domain";
import { formatCurrency } from "@/utils/format";

type DriverShiftSummaryProps = {
  summary: DriverShiftSummaryData;
};

export function DriverShiftSummary({ summary }: DriverShiftSummaryProps) {
  const metrics = [
    {
      label: "Câștig azi",
      value: formatCurrency(summary.grossEarnings),
      icon: Banknote
    },
    {
      label: "Curse finalizate",
      value: String(summary.completedRides),
      icon: Route
    },
    {
      label: "Minute online",
      value: String(summary.onlineMinutes),
      icon: Clock
    }
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <Card key={metric.label} className="p-4">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
          </Card>
        );
      })}
    </div>
  );
}
