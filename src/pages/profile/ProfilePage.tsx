import { CreditCard, Heart, Home, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { ThemePreference } from "@/components/profile/ThemePreference";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";

export function ProfilePage() {
  const profile = useAppStore((state) => state.profile);
  const notifications = useAppStore((state) => state.notifications);

  return (
    <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[360px_1fr]">
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-lg bg-primary text-lg font-black text-primary-foreground">
            {(profile?.fullName || "R").slice(0, 1).toUpperCase()}
          </span>
          <div>
            <h1 className="text-lg font-semibold">{profile?.fullName || "Client Rider"}</h1>
            <Badge variant="secondary">{profile?.role || "client"}</Badge>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            {profile?.email || "demo@rider.local"}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            {profile?.phone || "+40 700 000 000"}
          </p>
          <p className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-muted-foreground" />
            Date personale sincronizate
          </p>
        </div>
      </Card>

      <section className="space-y-5">
        <Card className="p-5">
          <h2 className="font-semibold">Tema aplicației</h2>
          <p className="mt-1 text-sm text-muted-foreground">Preferința este păstrată local și în Supabase când proiectul este configurat.</p>
          <div className="mt-4 max-w-sm">
            <ThemePreference />
          </div>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          <Card className="p-5">
            <h2 className="font-semibold">Favorite</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <p className="flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                Casă
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Birou
              </p>
              <p className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Locații frecvente
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold">Metode plată</h2>
            <p className="mt-4 flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-primary" />
              Card principal pregătit
            </p>
          </Card>
        </div>

        <Card className="p-5">
          <h2 className="font-semibold">Notificări</h2>
          <div className="mt-4 grid gap-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-lg border bg-background p-3">
                <p className="text-sm font-semibold">{notification.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
