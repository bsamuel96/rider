import { FileCheck2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const documents = ["Permis", "Talon", "RCA", "ITP", "Poză vehicul"];

export function DriverDocumentsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Documente</h1>
        <p className="mt-1 text-sm text-muted-foreground">Documentele aprobate permit accesul la curse.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {documents.map((document) => (
          <Card key={document} className="flex items-center gap-3 p-4">
            <FileCheck2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{document}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
