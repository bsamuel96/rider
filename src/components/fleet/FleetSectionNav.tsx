import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

export type FleetSectionNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

type FleetSectionNavProps = {
  label: string;
  items: FleetSectionNavItem[];
};

export function FleetSectionNav({ label, items }: FleetSectionNavProps) {
  return (
    <nav className="no-scrollbar flex gap-2 overflow-x-auto pb-1" aria-label={label}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to.endsWith("/transport") || item.to.endsWith("/roadside")}
          className={({ isActive }) =>
            cn(
              "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border border-border/60 bg-background/72 px-3 text-sm font-semibold text-muted-foreground shadow-soft backdrop-blur-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive && "border-primary/30 bg-primary/12 text-primary"
            )
          }
        >
          <item.icon className="h-4 w-4" aria-hidden="true" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
