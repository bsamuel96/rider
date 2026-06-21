import { AppLogo } from "@/components/brand/AppLogo";

export function CustomerSplashScreen() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-background text-foreground">
      <div className="motion-safe:animate-[fade-in_360ms_ease-out] motion-safe:scale-100">
        <AppLogo markClassName="h-20 w-20 rounded-[1.75rem] text-3xl" className="flex-col gap-4" />
      </div>
    </main>
  );
}
