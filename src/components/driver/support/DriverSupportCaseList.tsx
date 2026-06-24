import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const cases = {
  open: [
    { id: "case-101", status: "NECITITE", title: "Plată cash neconfirmată", summary: "Pasagerul a raportat o diferență la cursa demo." },
    { id: "case-102", status: "DESCHIS", title: "Adresă pickup greșită", summary: "Caz în analiză pentru traseul Unirii → Pipera." }
  ],
  closed: [
    { id: "case-090", status: "ÎNCHIS", title: "Taxă de anulare", summary: "Caz rezolvat în favoarea șoferului." }
  ]
};

type DriverSupportCaseListProps = {
  status: "open" | "closed";
};

export function DriverSupportCaseList({ status }: DriverSupportCaseListProps) {
  return (
    <div className="grid gap-3">
      {cases[status].map((item) => (
        <Link key={item.id} to={`/driver/support/cases/${item.id}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Card className="p-4 transition-colors hover:bg-muted/55">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Badge variant={item.status === "ÎNCHIS" ? "secondary" : item.status === "NECITITE" ? "warning" : "outline"}>
                  {item.status}
                </Badge>
                <p className="mt-2 font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
