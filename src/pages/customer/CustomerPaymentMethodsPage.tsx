import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";

export function CustomerPaymentMethodsPage() {
  const { toast } = useToast();
  const [demoCardAdded, setDemoCardAdded] = useState(false);

  const addDemoCard = () => {
    setDemoCardAdded(true);
    toast({
      title: "Card demo pregătit",
      description: "În producție, aici se va deschide fluxul securizat de adăugare card.",
      tone: "success"
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Metode plată</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pregătit pentru carduri, wallet și plăți corporate.</p>
        </div>
        <Button type="button" onClick={addDemoCard}>
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
      {demoCardAdded && (
        <Card className="p-5">
          <p className="flex items-center gap-2 text-sm font-medium">
            <CreditCard className="h-4 w-4 text-primary" />
            Card demo terminat în 4242 este disponibil pentru test.
          </p>
        </Card>
      )}
    </div>
  );
}
