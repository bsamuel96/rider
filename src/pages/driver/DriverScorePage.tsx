import { CheckCircle2, CircleGauge, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

export function DriverScorePage() {
  return (
    <DriverEducationPage
      eyebrow="Scorul șoferului"
      title="Scor curent: 92/100"
      icon={CircleGauge}
      metric="Foarte bun"
      points={["Acceptă cursele potrivite zonei tale.", "Finalizează cursele fără anulări inutile.", "Păstrează comunicarea clară cu pasagerii."]}
    />
  );
}

export function DriverRatingPage() {
  return (
    <DriverEducationPage
      eyebrow="Evaluare cu stele"
      title="Rating curent: 4.96"
      icon={TrendingUp}
      metric="+0.04 față de săptămâna trecută"
      points={["Salută pasagerul și confirmă destinația.", "Păstrează mașina curată.", "Evită frânările sau virajele bruște."]}
    />
  );
}

export function DriverAcceptanceRatePage() {
  return (
    <DriverEducationPage
      eyebrow="Rata de acceptare"
      title="Acceptare: 88%"
      icon={CheckCircle2}
      metric="Eligibil pentru campanii"
      points={["Stai online doar când poți accepta curse.", "Folosește pauza pentru întreruperi.", "Alege preferințele de pickup realist."]}
    />
  );
}

export function DriverPassengerScorePage() {
  return (
    <DriverEducationPage
      eyebrow="Scorul pasagerului"
      title="Înțelege ratingul clientului"
      icon={CircleGauge}
      metric="Vizibil înainte de acceptare"
      points={["Folosește scorul ca semnal, nu ca verdict.", "Raportează comportamentul nesigur.", "Cere suport dacă apare un conflict."]}
    />
  );
}

export function DriverSafetyPage() {
  return (
    <DriverEducationPage
      eyebrow="Siguranță"
      title="Rămâi în control în fiecare cursă"
      icon={CheckCircle2}
      metric="Suport disponibil permanent"
      points={["Oprește într-un loc sigur dacă apare o problemă.", "Sună suportul Rider din panoul de siguranță.", "Raportează incidentele direct din cursă."]}
    />
  );
}

type DriverEducationPageProps = {
  eyebrow: string;
  title: string;
  metric: string;
  icon: typeof CircleGauge;
  points: string[];
};

function DriverEducationPage({ eyebrow, title, metric, icon: Icon, points }: DriverEducationPageProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-6">
      <header>
        <p className="text-sm font-semibold text-primary">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Educație operațională pentru performanță mai bună.</p>
      </header>
      <Card className="p-5">
        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
        <p className="mt-4 text-3xl font-semibold">{metric}</p>
        <div className="mt-5 grid gap-3">
          {points.map((point) => (
            <p key={point} className="flex items-start gap-3 rounded-2xl bg-muted/60 p-3 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {point}
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
}
