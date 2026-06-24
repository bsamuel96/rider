import { Link } from "react-router-dom";
import { Banknote, CalendarClock, Gift, HelpCircle, History, Settings } from "lucide-react";
import { DriverPerformanceCards } from "@/components/driver/DriverPerformanceCards";
import { DriverProfileSummary } from "@/components/driver/DriverProfileSummary";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";

const links = [
  { label: "Câștiguri", to: "/driver/earnings", icon: Banknote },
  { label: "Istoric curse", to: "/driver/rides", icon: History },
  { label: "Campanii", to: "/driver/campaigns", icon: Gift },
  { label: "Curse programate", to: "/driver/scheduled", icon: CalendarClock },
  { label: "Setări", to: "/driver/settings", icon: Settings },
  { label: "Ajutor", to: "/driver/support", icon: HelpCircle }
];

export function DriverMenuPage() {
  const profile = useAppStore((state) => state.profile);

  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-6">
      <header>
        <p className="text-sm font-semibold text-primary">Meniu</p>
        <h1 className="mt-1 text-2xl font-semibold">Profil și acțiuni șofer</h1>
      </header>
      <DriverProfileSummary profile={profile} />
      <DriverPerformanceCards />
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((item) => (
          <Link key={item.to} to={item.to} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Card className="p-4 transition-colors hover:bg-muted/55">
              <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <p className="mt-3 font-semibold">{item.label}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
