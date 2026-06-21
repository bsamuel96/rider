import { CheckCircle2, Circle } from "lucide-react";
import type { RoadsideRequestStatus } from "@/types/domain";
import { cn } from "@/utils/cn";

type RoadsideProgressTimelineProps = {
  status: RoadsideRequestStatus;
};

const steps: Array<{ id: RoadsideRequestStatus; label: string }> = [
  { id: "searching", label: "Solicitare trimisă" },
  { id: "accepted", label: "Echipaj acceptat" },
  { id: "operator_en_route", label: "Echipaj în drum" },
  { id: "operator_arrived_confirmed", label: "Sosire la client" },
  { id: "issue_in_progress", label: "Intervenție în lucru" },
  { id: "issue_solved_confirmed", label: "Problemă rezolvată" },
  { id: "completed", label: "Finalizat" }
];

const order: RoadsideRequestStatus[] = [
  "draft",
  "searching",
  "accepted",
  "operator_en_route",
  "operator_arrived_pending_customer",
  "operator_arrived_confirmed",
  "issue_in_progress",
  "issue_solved_pending_customer",
  "issue_solved_confirmed",
  "completed"
];

export function RoadsideProgressTimeline({ status }: RoadsideProgressTimelineProps) {
  const currentIndex = order.indexOf(status);

  return (
    <ol className="grid gap-2">
      {steps.map((step) => {
        const stepIndex = order.indexOf(step.id);
        const done = currentIndex >= stepIndex;
        const pending =
          (status === "operator_arrived_pending_customer" && step.id === "operator_arrived_confirmed") ||
          (status === "issue_solved_pending_customer" && step.id === "issue_solved_confirmed");

        return (
          <li key={step.id} className="flex items-center gap-2 text-xs">
            {done ? (
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
            ) : (
              <Circle className={cn("h-4 w-4", pending ? "text-amber-500" : "text-muted-foreground")} aria-hidden="true" />
            )}
            <span className={cn(done && "font-semibold", pending && "font-semibold text-amber-600 dark:text-amber-300")}>
              {pending ? `${step.label} · așteptăm confirmarea` : step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
