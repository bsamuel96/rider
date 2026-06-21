import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { VehicleProfile } from "@/types/domain";

type VehicleDocumentStatusProps = {
  status: VehicleProfile["vehicleStatus"];
};

const labels: Record<VehicleProfile["vehicleStatus"], string> = {
  active: "Aprobat",
  pending_review: "În verificare",
  maintenance: "Mentenanță",
  suspended: "Suspendat",
  retired: "Retras"
};

export function VehicleDocumentStatus({ status }: VehicleDocumentStatusProps) {
  const active = status === "active";

  return (
    <div className="flex items-center gap-2 text-sm">
      {active ? (
        <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
      ) : (
        <ShieldAlert className="h-4 w-4 text-amber-500" aria-hidden="true" />
      )}
      <span className="text-muted-foreground">Status documente</span>
      <Badge variant={active ? "secondary" : "outline"}>{labels[status]}</Badge>
    </div>
  );
}
