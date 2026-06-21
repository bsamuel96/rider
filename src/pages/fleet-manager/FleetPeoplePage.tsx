import { useLocation } from "react-router-dom";
import { Phone, UserRound, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { demoFleetPeople, type DemoFleetPerson } from "@/data/demoFleet";

export function FleetPeoplePage() {
  const location = useLocation();
  const mode = location.pathname.includes("/drivers")
    ? "drivers"
    : location.pathname.includes("/operators")
      ? "operators"
      : "all";
  const people = demoFleetPeople.filter((person) => {
    if (mode === "drivers") {
      return person.role === "driver";
    }

    if (mode === "operators") {
      return person.role === "roadside_operator";
    }

    return true;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header>
        <p className="text-sm font-semibold text-primary">Fleet people</p>
        <h1 className="mt-1 text-2xl font-semibold">
          {mode === "drivers" ? "Transport drivers" : mode === "operators" ? "Roadside operators" : "Drivers and operators"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Disponibilitate, roluri și joburi active, fără a amesteca transportul cu intervențiile roadside.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <PeopleMetric icon={UsersRound} label="Total" value={people.length} />
        <PeopleMetric icon={UserRound} label="Online" value={people.filter((person) => person.status === "online").length} />
        <PeopleMetric icon={Phone} label="În job" value={people.filter((person) => person.status === "busy").length} />
      </div>

      <Card className="rounded-3xl p-4">
        <div className="grid gap-3">
          {people.map((person) => (
            <PersonRow key={person.id} person={person} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function PeopleMetric({ icon: Icon, label, value }: { icon: typeof UsersRound; label: string; value: number }) {
  return (
    <Card className="rounded-3xl p-4">
      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </Card>
  );
}

function PersonRow({ person }: { person: DemoFleetPerson }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-muted/55 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold">{person.name}</p>
          <Badge variant={person.fleetType === "roadside" ? "warning" : "secondary"}>
            {person.fleetType === "roadside" ? "Roadside" : "Transport"}
          </Badge>
          <Badge variant={person.status === "online" ? "secondary" : "outline"}>{person.status}</Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{person.activeJob || person.phone}</p>
      </div>
      <Button type="button" variant="outline" size="sm">
        <Phone className="h-4 w-4" aria-hidden="true" />
        Sună
      </Button>
    </div>
  );
}
