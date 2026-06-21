import { Badge } from "@/components/ui/badge";
import type { SupportTicketPriority } from "@/types/domain";

type SupportPriorityBadgeProps = {
  priority: SupportTicketPriority;
};

const labels: Record<SupportTicketPriority, string> = {
  low: "Scăzut",
  normal: "Normal",
  high: "Ridicat",
  urgent: "Urgent"
};

export function SupportPriorityBadge({ priority }: SupportPriorityBadgeProps) {
  return <Badge variant={priority === "urgent" || priority === "high" ? "warning" : "secondary"}>{labels[priority]}</Badge>;
}
