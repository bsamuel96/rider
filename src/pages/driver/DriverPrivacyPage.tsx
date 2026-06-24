import { Eye, FileText, Lock, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const items = [
  { title: "Date afișate pasagerilor", body: "Numele, ratingul și detaliile mașinii sunt vizibile în timpul cursei.", icon: Eye },
  { title: "Istoric curse", body: "Cursele sunt păstrate pentru plăți, suport și siguranță.", icon: FileText },
  { title: "Securitate cont", body: "Folosește autentificare sigură și nu distribui coduri OTP.", icon: Lock },
  { title: "Solicitări suport", body: "Datele sunt accesate doar pentru cazuri operaționale.", icon: ShieldCheck }
];

export function DriverPrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-6">
      <header>
        <p className="text-sm font-semibold text-primary">Confidențialitate</p>
        <h1 className="mt-1 text-2xl font-semibold">Date și control</h1>
        <p className="mt-1 text-sm text-muted-foreground">Cum sunt folosite datele în portalul Rider.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.title} className="p-4">
            <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 font-semibold">{item.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
