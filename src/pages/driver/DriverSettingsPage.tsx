import { Bell, CreditCard, Languages, SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";

const settings = [
  { title: "Notificări", helper: "Sunete și alerte pentru curse noi.", icon: Bell },
  { title: "Plată", helper: "Numerar, card și încasări.", icon: CreditCard },
  { title: "Limbă", helper: "Română implicit.", icon: Languages },
  { title: "Preferințe curse", helper: "Tipuri de curse și distanță pickup.", icon: SlidersHorizontal }
];

export function DriverSettingsPage() {
  const { toast } = useToast();

  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-6">
      <header>
        <p className="text-sm font-semibold text-primary">Setări</p>
        <h1 className="mt-1 text-2xl font-semibold">Configurează portalul șoferului</h1>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {settings.map((item) => (
          <Card key={item.title} className="p-4">
            <button
              type="button"
              onClick={() => toast({ title: item.title, description: "Demo: setarea a fost deschisă." })}
              className="flex min-h-20 w-full items-start gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold">{item.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{item.helper}</span>
              </span>
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
