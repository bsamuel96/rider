import { FileCheck2, Headphones, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function RoadsideOperatorPendingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-secondary">
            <ShieldAlert className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold">Contul este în analiză</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Verificăm compania, autorizațiile, vehiculul de intervenție și documentele încărcate.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <Button>
                <FileCheck2 className="h-4 w-4" />
                Vezi documentele
              </Button>
              <Button variant="outline">
                <Headphones className="h-4 w-4" />
                Contactează suportul
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
