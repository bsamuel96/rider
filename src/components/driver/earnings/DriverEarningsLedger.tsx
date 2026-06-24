import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/utils/format";

const ledger = [
  { id: "booking-demo-1", title: "Piața Victoriei → Otopeni", time: "Azi, 14:20", payment: "Cash", amount: 58 },
  { id: "booking-demo-2", title: "Unirii → Pipera", time: "Azi, 12:05", payment: "Card", amount: 42 },
  { id: "booking-demo-3", title: "Universitate → Tineretului", time: "Ieri, 19:42", payment: "Card", amount: 37 }
];

export function DriverEarningsLedger() {
  const navigate = useNavigate();

  return (
    <section className="rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Ride ledger</h2>
        <button
          type="button"
          onClick={() => navigate("/driver/rides")}
          className="text-xs font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Vezi toate
        </button>
      </div>
      <div className="mt-3 divide-y divide-border/60">
        {ledger.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => navigate(`/driver/ride/${entry.id}`)}
            className="flex min-h-16 w-full items-center justify-between gap-3 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{entry.title}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{entry.time} · {entry.payment}</span>
            </span>
            <span className="flex items-center gap-2 font-semibold">
              {formatCurrency(entry.amount)}
              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
