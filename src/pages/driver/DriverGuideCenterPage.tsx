import { useMemo } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { DriverGuideGrid } from "@/components/driver/support/DriverGuideGrid";
import { driverGuides } from "@/components/driver/support/driverGuides";
import { Card } from "@/components/ui/card";

export function DriverGuideCenterPage() {
  const { slug } = useParams();
  const guide = useMemo(() => driverGuides.find((item) => item.slug === slug), [slug]);

  if (slug && guide) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 pb-6">
        <Link to="/driver/support/guides" className="inline-flex min-h-10 items-center gap-2 rounded-xl text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Înapoi la ghiduri
        </Link>
        <Card className="p-5">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary">
            <guide.icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold">{guide.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{guide.description}</p>
          <div className="mt-5 grid gap-3">
            {[
              "Verifică harta și pickup-ul înainte să pornești.",
              "Comunică politicos și clar cu pasagerul.",
              "Folosește suportul când apare o situație neclară."
            ].map((item) => (
              <p key={item} className="flex items-start gap-3 rounded-2xl bg-muted/60 p-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {item}
              </p>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-6">
      <header>
        <p className="text-sm font-semibold text-primary">Centrul de ghidare</p>
        <h1 className="mt-1 text-2xl font-semibold">Articole utile pentru șoferi</h1>
        <p className="mt-1 text-sm text-muted-foreground">Recomandări, siguranță, scoruri și curse business.</p>
      </header>
      <DriverGuideGrid />
    </div>
  );
}
