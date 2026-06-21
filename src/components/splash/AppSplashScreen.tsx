import { AppLogo } from "@/components/brand/AppLogo";
import type { SplashRole } from "@/hooks/useRoleSplash";

type AppSplashScreenProps = {
  role: SplashRole;
};

const splashCopy: Record<SplashRole, { title: string; subtitle: string }> = {
  customer: {
    title: "Rider",
    subtitle: "Cursă, tractare și asistență."
  },
  driver: {
    title: "Rider Șofer",
    subtitle: "Curse live și câștiguri."
  },
  roadside: {
    title: "Rider Roadside",
    subtitle: "Intervenții și tractări."
  },
  fleet_manager: {
    title: "Rider Fleet",
    subtitle: "Transport și roadside, separat."
  },
  admin: {
    title: "Rider Admin",
    subtitle: "Control operațional."
  }
};

export function AppSplashScreen({ role }: AppSplashScreenProps) {
  const copy = splashCopy[role];

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-background text-foreground">
      <div className="grid place-items-center gap-4 text-center motion-safe:animate-[fade-in_360ms_ease-out] motion-safe:scale-100">
        <AppLogo markClassName="h-20 w-20 rounded-[1.75rem] text-3xl" className="flex-col gap-3" showWordmark={false} />
        <div>
          <h1 className="text-xl font-black">{copy.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>
      </div>
    </main>
  );
}
