import { SupportAdminQueue } from "@/components/support/SupportAdminQueue";
import { ErrorState } from "@/components/ui/ErrorState";
import { useSupportTickets } from "@/hooks/useSupportTickets";

export function AdminSupportPage() {
  const support = useSupportTickets();

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <p className="text-sm font-semibold text-primary">Admin Support</p>
        <h1 className="mt-1 text-2xl font-semibold">Support queue</h1>
        <p className="mt-1 text-sm text-muted-foreground">Vezi, asignează, escaladează și închide tichete pentru toate rolurile.</p>
      </div>
      {support.error && <ErrorState description={support.error} onRetry={support.retry} />}
      {support.loading ? (
        <div className="rounded-3xl border border-border/60 bg-background/80 p-5 text-sm text-muted-foreground">Se încarcă tichetele...</div>
      ) : (
        <SupportAdminQueue tickets={support.tickets} basePath="/admin/support" />
      )}
    </div>
  );
}
