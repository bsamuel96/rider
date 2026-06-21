import { Building2, Car, ShieldCheck, UserCog, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthRoleTabs } from "@/components/auth/AuthRoleTabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardPathForRole } from "@/services/roleRedirect";
import { useAppStore } from "@/store/useAppStore";
import type { AuthInstance, Profile } from "@/types/domain";
import { cn } from "@/utils/cn";

const demoProfiles: Record<AuthInstance, Profile> = {
  customer: {
    id: "demo-customer",
    email: "client@demo.rider",
    phone: "+40 700 000 001",
    username: "demo_client",
    fullName: "Client Demo",
    role: "client",
    activeInstance: "customer",
    registrationStatus: "active",
    theme: "system",
    preferredPaymentMethod: "cash"
  },
  driver: {
    id: "demo-driver",
    email: "driver@demo.rider",
    phone: "+40 700 000 002",
    username: "demo_driver",
    fullName: "Șofer Demo",
    role: "driver",
    activeInstance: "driver",
    registrationStatus: "active",
    theme: "system",
    preferredPaymentMethod: "cash"
  },
  roadside: {
    id: "demo-roadside",
    email: "roadside@demo.rider",
    phone: "+40 700 000 003",
    username: "demo_roadside",
    fullName: "Operator Roadside Demo",
    role: "roadside_operator",
    activeInstance: "roadside",
    registrationStatus: "active",
    theme: "system",
    preferredPaymentMethod: "cash"
  },
  fleet_manager: {
    id: "demo-fleet-manager",
    email: "fleet@rider.demo",
    phone: "+40 700 000 004",
    username: "demo_fleet",
    fullName: "Fleet Manager Demo",
    role: "fleet_manager",
    activeInstance: "fleet_manager",
    fleetScope: "both",
    registrationStatus: "active",
    theme: "system",
    preferredPaymentMethod: "cash"
  }
};

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeInstance = useAppStore((state) => state.activeInstance);
  const setActiveInstance = useAppStore((state) => state.setActiveInstance);
  const setProfile = useAppStore((state) => state.setProfile);
  const mode = location.pathname.includes("register") ? "register" : "login";

  const selectMode = (nextMode: "login" | "register") => {
    navigate(nextMode === "login" ? "/auth/login" : "/auth/register");
  };

  const enterDemo = (instance: AuthInstance) => {
    const profile = demoProfiles[instance];
    setActiveInstance(instance);
    setProfile(profile);
    navigate(getDashboardPathForRole(profile));
  };

  const enterAdminDemo = () => {
    const profile: Profile = {
      id: "demo-admin",
      email: "admin@rider.demo",
      phone: "+40 700 000 005",
      username: "demo_admin",
      fullName: "Admin Demo",
      role: "admin",
      activeInstance: activeInstance,
      registrationStatus: "active",
      theme: "system",
      preferredPaymentMethod: "cash"
    };

    setProfile(profile);
    navigate(getDashboardPathForRole(profile));
  };

  return (
    <main className="min-h-screen bg-background p-4 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <header className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-primary text-xl font-black text-primary-foreground">
            R
          </div>
          <h1 className="mt-4 text-2xl font-semibold">Alege tipul de cont</h1>
          <p className="mt-2 text-sm text-muted-foreground">Mobilitate, ridesharing, tractări și asistență rutieră într-un singur produs.</p>
        </header>

        <AuthRoleTabs value={activeInstance} onChange={setActiveInstance} />

        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <div className="grid grid-cols-2 rounded-lg border bg-muted p-1" role="tablist" aria-label="Login sau register">
              {(["login", "register"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => selectMode(item)}
                  className={cn(
                    "h-10 rounded-md text-sm font-semibold text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    mode === item && "bg-background text-foreground shadow-sm"
                  )}
                >
                  {item === "login" ? "Intră în cont" : "Creează cont"}
                </button>
              ))}
            </div>
            <CardTitle className="pt-3 text-xl">{mode === "login" ? "Intră în cont" : "Creează cont"}</CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Autentificarea verifică rolul real al profilului și blochează tabul greșit."
                : "Rolul este derivat din tabul ales și salvat în profilul Supabase."}
            </CardDescription>
          </CardHeader>
          <CardContent>{mode === "login" ? <LoginForm instance={activeInstance} /> : <RegisterForm instance={activeInstance} />}</CardContent>
        </Card>

        <Card className="mx-auto w-full max-w-5xl p-4 sm:p-5">
          <h2 className="text-base font-semibold sm:text-lg">Intră rapid în demo</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Button
              type="button"
              variant="outline"
              className="min-h-14 min-w-0 whitespace-normal rounded-2xl px-3 text-center text-sm leading-tight sm:min-h-16 sm:text-base"
              onClick={() => enterDemo("customer")}
            >
              <UserRound className="h-4 w-4" />
              Demo Client
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-14 min-w-0 whitespace-normal rounded-2xl px-3 text-center text-sm leading-tight sm:min-h-16 sm:text-base"
              onClick={() => enterDemo("driver")}
            >
              <Car className="h-4 w-4" />
              Demo Șofer
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-14 min-w-0 whitespace-normal rounded-2xl px-3 text-center text-sm leading-tight sm:min-h-16 sm:text-base"
              onClick={() => enterDemo("roadside")}
            >
              <ShieldCheck className="h-4 w-4" />
              Demo Roadside
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-14 min-w-0 whitespace-normal rounded-2xl px-3 text-center text-sm leading-tight sm:min-h-16 sm:text-base"
              onClick={() => enterDemo("fleet_manager")}
            >
              <Building2 className="h-4 w-4" />
              Demo Fleet Manager
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-14 min-w-0 whitespace-normal rounded-2xl px-3 text-center text-sm leading-tight sm:min-h-16 sm:text-base"
              onClick={enterAdminDemo}
            >
              <UserCog className="h-4 w-4" />
              Demo Admin
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
