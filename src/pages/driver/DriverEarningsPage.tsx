import { DriverEarningsLedger } from "@/components/driver/DriverEarningsLedger";
import { DriverShiftSummary } from "@/components/driver/DriverShiftSummary";
import { useDriverShift } from "@/hooks/useDriverShift";

export function DriverEarningsPage() {
  const { summary, ledger } = useDriverShift();

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Câștiguri</h1>
        <p className="mt-1 text-sm text-muted-foreground">Rezumat pentru tura curentă și ultimele încasări.</p>
      </div>

      <DriverShiftSummary summary={summary} />

      <section className="space-y-3" aria-labelledby="earnings-ledger-title">
        <h2 id="earnings-ledger-title" className="font-semibold">
          Ledger încasări
        </h2>
        <DriverEarningsLedger entries={ledger} />
      </section>
    </div>
  );
}
