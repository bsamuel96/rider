import {
  Banknote,
  CalendarClock,
  ChevronRight,
  Gauge,
  Gift,
  HelpCircle,
  History,
  Lock,
  LogOut,
  Settings,
  ShieldCheck,
  Star,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DriverPerformanceCards } from "@/components/driver/DriverPerformanceCards";
import { DriverProfileSummary } from "@/components/driver/DriverProfileSummary";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";

type DriverMenuDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const menuItems = [
  { label: "Câștiguri", to: "/driver/earnings", icon: Banknote },
  { label: "Istoric curse", to: "/driver/rides", icon: History },
  { label: "Activitate", to: "/driver/activity", icon: Gauge },
  { label: "Campanii", to: "/driver/campaigns", icon: Gift },
  { label: "Curse programate", to: "/driver/scheduled", icon: CalendarClock },
  { label: "Portalul șoferului", to: "/driver/portal", icon: Star },
  { label: "Setări", to: "/driver/settings", icon: Settings },
  { label: "Confidențialitate", to: "/driver/privacy", icon: Lock },
  { label: "Siguranță", to: "/driver/safety", icon: ShieldCheck },
  { label: "Ajutor", to: "/driver/support", icon: HelpCircle }
];

export function DriverMenuDrawer({ open, onClose }: DriverMenuDrawerProps) {
  const navigate = useNavigate();
  const profile = useAppStore((state) => state.profile);

  const openLogoutDialog = () => {
    onClose();
    navigate("/driver/profile?logout=1");
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[800] transition-opacity duration-200 motion-reduce:transition-none",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Închide meniul"
      />
      <aside
        className={cn(
          "absolute inset-y-0 left-0 flex w-[min(88vw,390px)] flex-col overflow-y-auto border-r border-border/60 bg-background/96 p-4 shadow-floating backdrop-blur-2xl transition-transform duration-200 motion-reduce:transition-none",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Meniu șofer"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-muted-foreground">Rider Driver</p>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-border/60 bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Închide meniul"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <DriverProfileSummary profile={profile} />
          <DriverPerformanceCards />
        </div>

        <nav className="mt-5 grid gap-1" aria-label="Navigare șofer">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="flex min-h-12 items-center justify-between gap-3 rounded-2xl px-3 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-primary">
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {item.label}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-5">
          <Button type="button" variant="outline" className="w-full justify-center" onClick={openLogoutDialog}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </Button>
        </div>
      </aside>
    </div>
  );
}
