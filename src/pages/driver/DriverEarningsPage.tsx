import { useState } from "react";
import { ArrowLeft, ArrowRight, Download, ReceiptText } from "lucide-react";
import { DriverEarningsBreakdownSheet } from "@/components/driver/earnings/DriverEarningsBreakdownSheet";
import { DriverEarningsLedger } from "@/components/driver/earnings/DriverEarningsLedger";
import { DriverEarningsSummary } from "@/components/driver/earnings/DriverEarningsSummary";
import { DriverEarningsTabs, type DriverEarningsPeriod } from "@/components/driver/earnings/DriverEarningsTabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

const totals: Record<DriverEarningsPeriod, { total: number; cash: number; inApp: number; tips: number; bonuses: number }> = {
  day: { total: 421, cash: 136, inApp: 285, tips: 24, bonuses: 66 },
  week: { total: 1840, cash: 540, inApp: 1300, tips: 96, bonuses: 220 },
  month: { total: 7340, cash: 2120, inApp: 5220, tips: 340, bonuses: 760 }
};

export function DriverEarningsPage() {
  const [period, setPeriod] = useState<DriverEarningsPeriod>("day");
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const { toast } = useToast();
  const current = totals[period];

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Câștiguri</p>
          <h1 className="mt-1 text-2xl font-semibold">Banii tăi, clar pe perioade</h1>
          <p className="mt-1 text-sm text-muted-foreground">Venituri în aplicație, numerar, bonusuri, comisioane și ledger.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            toast({
              title: "Export demo",
              description: "Raportul de câștiguri ar fi descărcat ca CSV/PDF.",
              tone: "success"
            })
          }
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export
        </Button>
      </header>

      <DriverEarningsTabs value={period} onChange={setPeriod} />

      <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/45 p-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => toast({ title: "Perioada anterioară", description: "Demo: ai navigat la perioada anterioară." })}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Înapoi
        </Button>
        <p className="text-sm font-semibold">{period === "day" ? "Astăzi" : period === "week" ? "Săptămâna curentă" : "Luna curentă"}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => toast({ title: "Perioada următoare", description: "Demo: nu există perioadă viitoare." })}>
          Înainte
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <DriverEarningsSummary {...current} />

      <Button type="button" className="w-full justify-center" onClick={() => setBreakdownOpen(true)}>
        <ReceiptText className="h-4 w-4" aria-hidden="true" />
        Defalcarea câștigurilor
      </Button>

      <DriverEarningsLedger />

      <DriverEarningsBreakdownSheet open={breakdownOpen} onClose={() => setBreakdownOpen(false)} />
    </div>
  );
}
