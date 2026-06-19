import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CustomerPaymentMethodsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Metode plată</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pregătit pentru carduri, wallet și plăți corporate.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Adaugă
        </Button>
      </div>
      <Card className="p-5">
        <p className="flex items-center gap-2 text-sm font-medium">
          <CreditCard className="h-4 w-4 text-primary" />
          Card principal pregătit pentru integrare de plată.
        </p>
      </Card>
    </div>
  );
}
