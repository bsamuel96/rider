import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

type DriverGuideCardProps = {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
};

export function DriverGuideCard({ title, description, to, icon: Icon }: DriverGuideCardProps) {
  return (
    <Link to={to} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Card className="h-full p-4 transition-colors hover:bg-muted/55">
        <div className="flex h-full items-start justify-between gap-3">
          <div>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-3 font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </div>
      </Card>
    </Link>
  );
}
