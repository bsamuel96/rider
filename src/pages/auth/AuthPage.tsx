import { Building2, Car, ShieldCheck, UserRound } from "lucide-react";
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

        <Card className="mx-auto w-full max-w-2xl p-4">
          <h2 className="text-sm font-semibold">Intră rapid în demo</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            <Button type="button" variant="outline" onClick={() => enterDemo("customer")}>
              <UserRound className="h-4 w-4" />
              Demo Client
            </Button>
            <Button type="button" variant="outline" onClick={() => enterDemo("driver")}>
              <Car className="h-4 w-4" />
              Demo Șofer
            </Button>
            <Button type="button" variant="outline" onClick={() => enterDemo("roadside")}>
              <ShieldCheck className="h-4 w-4" />
              Demo Roadside
            </Button>
            <Button type="button" variant="outline" onClick={() => enterDemo("fleet_manager")}>
              <Building2 className="h-4 w-4" />
              Demo Fleet Manager
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
