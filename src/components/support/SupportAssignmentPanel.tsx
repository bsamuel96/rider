import { UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type SupportAssignmentPanelProps = {
  onAssign: () => void;
};

export function SupportAssignmentPanel({ onAssign }: SupportAssignmentPanelProps) {
  return (
    <Button type="button" variant="outline" onClick={onAssign}>
      <UserCheck className="h-4 w-4" aria-hidden="true" />
      Asignează ticket
    </Button>
  );
}
