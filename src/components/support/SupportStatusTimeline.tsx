import { CheckCircle2, Circle } from "lucide-react";
import type { SupportTicketStatus } from "@/types/domain";
import { cn } from "@/utils/cn";

type SupportStatusTimelineProps = {
  status: SupportTicketStatus;
};

const steps: Array<{ status: SupportTicketStatus; label: string }> = [
  { status: "open", label: "Deschis" },
  { status: "in_review", label: "În review" },
  { status: "waiting_for_user", label: "Așteaptă răspuns" },
  { status: "resolved", label: "Rezolvat" }
];

export function SupportStatusTimeline({ status }: SupportStatusTimelineProps) {
  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => step.status === status)
  );

  return (
    <ol className="grid gap-2 sm:grid-cols-4">
      {steps.map((step, index) => {
        const complete = index <= activeIndex || status === "closed";
        const Icon = complete ? CheckCircle2 : Circle;
        return (
          <li key={step.status} className={cn("flex items-center gap-2 text-xs font-semibold", complete ? "text-primary" : "text-muted-foreground")}>
            <Icon className="h-4 w-4" aria-hidden="true" />
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}
