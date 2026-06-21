import { LifeBuoy, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { SupportTicketList } from "@/components/support/SupportTicketList";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/button";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { useAppStore } from "@/store/useAppStore";
import { getSupportBasePath } from "@/utils/communicationRoutes";

export function SupportPage() {
  const profile = useAppStore((state) => state.profile);
  const basePath = getSupportBasePath(profile);
  const support = useSupportTickets();

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <LifeBuoy className="h-4 w-4" aria-hidden="true" />
            Suport Rider
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Tichetele mele</h1>
          <p className="mt-1 text-sm text-muted-foreground">Creează, urmărește și răspunde la solicitările de suport.</p>
        </div>
        <Button asChild>
          <Link to={`${basePath}/new`}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Ticket nou
          </Link>
        </Button>
      </div>

      {support.error && <ErrorState description={support.error} onRetry={support.retry} />}
      {support.loading ? (
        <div className="rounded-3xl border border-border/60 bg-background/80 p-5 text-sm text-muted-foreground">Se încarcă suportul...</div>
      ) : (
        <SupportTicketList tickets={support.tickets} basePath={basePath} />
      )}
    </div>
  );
}
