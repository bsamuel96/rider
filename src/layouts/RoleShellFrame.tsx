import type { LucideIcon } from "lucide-react";
import { Bell, LogOut } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AppLogo } from "@/components/brand/AppLogo";
import { CarHeadlightThemeToggle } from "@/components/theme/CarHeadlightThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";

export type RoleNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

type RoleShellFrameProps = {
  portalLabel: string;
  homePath: string;
  profilePath?: string;
  navItems: RoleNavItem[];
  mapFirst?: boolean;
};

export function RoleShellFrame({
  portalLabel,
  homePath,
  profilePath = `${homePath}/profile`,
  navItems,
  mapFirst = false
}: RoleShellFrameProps) {
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const profile = useAppStore((state) => state.profile);
  const notifications = useAppStore((state) => state.notifications);
  const logout = useAppStore((state) => state.logout);
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  useRealtimeNotifications();

  const exit = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <header
        className={cn(
          "sticky top-0 z-30 border-b bg-background/92 backdrop-blur",
          mapFirst && "hidden border-border/50 bg-background/80 lg:block"
        )}
      >
        <div className="container flex h-16 items-center justify-between gap-3">
          <button type="button" className="flex items-center gap-3 text-left" onClick={() => navigate(homePath)}>
            <AppLogo markClassName="h-10 w-10 rounded-lg text-base" showWordmark={false} />
            <span>
              <span className="block text-sm font-semibold">{portalLabel}</span>
              <span className="block text-xs text-muted-foreground">
                {profile?.fullName ? `Salut, ${profile.fullName.split(" ")[0]}` : "Portal Rider"}
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex" aria-label={`Navigare ${portalLabel}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === homePath}
                className={({ isActive }) =>
                  cn(
                    "inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    isActive && "bg-secondary text-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {!online && <Badge variant="warning">Offline</Badge>}
            <CarHeadlightThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => navigate(profilePath)} aria-label="Notificări">
              <span className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-2 -top-2 h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
                )}
              </span>
            </Button>
            <Button variant="ghost" size="icon" onClick={exit} aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className={cn(mapFirst ? "pb-0 pt-0" : "container pb-24 pt-5 lg:pb-8")}>
        <Outlet />
      </main>

      <nav
        className="map-layer-nav fixed inset-x-0 bottom-0 border-t border-border/60 bg-background/90 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur-xl lg:hidden"
        aria-label={`Navigare mobilă ${portalLabel}`}
      >
        <div
          className="glass-dock mx-auto grid max-w-md gap-1 p-1"
          style={{ gridTemplateColumns: `repeat(${Math.min(navItems.length, 5)}, minmax(0, 1fr))` }}
        >
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === homePath}
              className={({ isActive }) =>
                cn(
                  "flex h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-semibold text-muted-foreground transition-colors",
                  isActive && "bg-primary/12 text-primary dark:bg-primary/18"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
