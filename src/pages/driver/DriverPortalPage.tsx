import { BookOpen, FileCheck2, LifeBuoy, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

const portalLinks = [
  { title: "Documente", body: "Verifică actele și validitatea lor.", to: "/driver/documents", icon: FileCheck2 },
  { title: "Scorul șoferului", body: "Înțelege performanța operațională.", to: "/driver/score", icon: Star },
  { title: "Ghiduri", body: "Articole utile pentru ture.", to: "/driver/support/guides", icon: BookOpen },
  { title: "Ajutor", body: "Cazuri suport și mesaje.", to: "/driver/support", icon: LifeBuoy }
];

export function DriverPortalPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-6">
      <header>
        <p className="text-sm font-semibold text-primary">Portalul șoferului</p>
        <h1 className="mt-1 text-2xl font-semibold">Tot ce ține de contul tău</h1>
        <p className="mt-1 text-sm text-muted-foreground">Documente, scor, suport și recomandări operaționale.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {portalLinks.map((item) => (
          <Link key={item.to} to={item.to} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Card className="h-full p-4 transition-colors hover:bg-muted/55">
              <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <p className="mt-3 font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
