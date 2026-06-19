import { Home, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CustomerAddressesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Adrese</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestionează casă, birou și locații frecvente.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Adaugă
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {["Casă", "Birou"].map((label) => (
          <Card key={label} className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
                {label === "Casă" ? <Home className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
              </span>
              <div>
                <h2 className="font-semibold">{label}</h2>
                <p className="text-sm text-muted-foreground">Adresă favorită sincronizată în Supabase.</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
