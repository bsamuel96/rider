import { Clock3 } from "lucide-react";
import { Card } from "@/components/ui/card";

const history = ["Cursă standard finalizată", "Asistență baterie finalizată", "Cursă premium finalizată"];

export function CustomerHistoryPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Istoric comenzi</h1>
        <p className="mt-1 text-sm text-muted-foreground">Cursele și intervențiile recente apar aici.</p>
      </div>
      <div className="grid gap-3">
        {history.map((item) => (
          <Card key={item} className="flex items-center gap-3 p-4">
            <Clock3 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{item}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
