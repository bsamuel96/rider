import { Clock3, Route, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { demoFleetJobs } from "@/data/demoFleet";
import { formatCurrency } from "@/utils/format";

export function FleetJobsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header>
        <p className="text-sm font-semibold text-primary">Fleet jobs</p>
        <h1 className="mt-1 text-2xl font-semibold">Transport rides and roadside jobs</h1>
        <p className="mt-2 text-sm text-muted-foreground">Joburile sunt afișate împreună aici, dar fiecare păstrează domeniul flotei.</p>
      </header>

      <Card className="rounded-3xl p-4">
        <div className="grid gap-3">
          {demoFleetJobs.map((job) => (
            <div key={job.id} className="flex flex-col gap-3 rounded-2xl bg-muted/55 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/12 text-primary">
                  {job.fleetType === "transport" ? <Route className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
                </span>
                <div>
                  <p className="text-sm font-semibold">{job.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {job.assignee} · {formatCurrency(job.valueRon)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={job.fleetType === "roadside" ? "warning" : "secondary"}>
                  {job.fleetType === "roadside" ? "Roadside" : "Transport"}
                </Badge>
                {job.speedTier === "fast" && (
                  <Badge variant="warning">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                    Rapid {job.guaranteeMinutesLeft} min
                  </Badge>
                )}
                <Badge variant="outline">{job.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
