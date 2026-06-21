import { CheckCircle2, MessageSquareWarning } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { getRoadsideRequests } from "@/services/roadsideFleet";

export function RoadsideConfirmationQueue() {
  const { toast } = useToast();
  const requests = getRoadsideRequests().filter(
    (request) =>
      request.status === "operator_arrived_pending_customer" ||
      request.status === "issue_solved_pending_customer" ||
      request.status === "disputed"
  );

  return (
    <Card className="rounded-3xl p-4">
      <h2 className="font-semibold">Customer Confirmation Queue</h2>
      <p className="mt-1 text-sm text-muted-foreground">Arrival and issue-solved confirmations must come from the customer.</p>
      <div className="mt-4 grid gap-3">
        {requests.map((request) => (
          <div key={request.id} className="rounded-2xl bg-muted/55 p-3">
            <div className="flex items-center justify-between gap-3">
              <span>
                <span className="block text-sm font-semibold">{request.label}</span>
                <span className="block text-xs text-muted-foreground">{request.customerLocation}</span>
              </span>
              <Badge variant={request.status === "disputed" ? "warning" : "secondary"}>
                {request.status === "operator_arrived_pending_customer"
                  ? "Arrival pending"
                  : request.status === "issue_solved_pending_customer"
                    ? "Solved pending"
                    : "Disputed"}
              </Badge>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                toast({
                  title: request.status === "disputed" ? "Dispută trimisă la review" : "Client notificat în demo",
                  description:
                    request.status === "disputed"
                      ? `${request.label} a fost marcată pentru suport.`
                      : `${request.label} a primit un reminder de confirmare.`,
                  tone: request.status === "disputed" ? "warning" : "success"
                })
              }
            >
              {request.status === "disputed" ? (
                <MessageSquareWarning className="h-4 w-4" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              )}
              {request.status === "disputed" ? "Resolve dispute" : "Contact customer"}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
