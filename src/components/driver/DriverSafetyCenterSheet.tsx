import { AlertTriangle, LifeBuoy, Phone, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MinimizableBottomSheet } from "@/components/mobile/MinimizableBottomSheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

type DriverSafetyCenterSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function DriverSafetyCenterSheet({ open, onClose }: DriverSafetyCenterSheetProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!open) {
    return null;
  }

  return (
    <MinimizableBottomSheet title="Siguranță șofer" description="Acțiuni rapide pentru situații neprevăzute." initialState="half" dismissible onStateChange={(state) => state === "closed" && onClose()}>
      <div className="space-y-3">
        <div className="grid gap-2">
          <Button
            type="button"
            onClick={() =>
              toast({
                title: "Demo: apel de siguranță",
                description: "În producție, acest buton poate apela contactul de urgență sau dispeceratul.",
                tone: "warning"
              })
            }
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Sună siguranța Rider
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/driver/support/new")}>
            <LifeBuoy className="h-4 w-4" aria-hidden="true" />
            Raportează un incident
          </Button>
        </div>
        {[
          { title: "Oprește într-un loc sigur", body: "Dacă te simți în pericol, oprește cursa și contactează suportul.", icon: ShieldCheck },
          { title: "Comportament nesigur", body: "Notează detaliile cursei și cere ajutor pentru cursa respectivă.", icon: AlertTriangle }
        ].map((item) => (
          <article key={item.title} className="rounded-2xl bg-muted/60 p-3">
            <div className="flex gap-3">
              <item.icon className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </MinimizableBottomSheet>
  );
}
