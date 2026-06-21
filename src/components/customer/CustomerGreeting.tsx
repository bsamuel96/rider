import { AppLogo } from "@/components/brand/AppLogo";

type CustomerGreetingProps = {
  firstName: string;
};

export function CustomerGreeting({ firstName }: CustomerGreetingProps) {
  return (
    <section className="flex min-h-16 items-center justify-between gap-3">
      <div>
        <p className="text-2xl font-semibold">Salut, {firstName}</p>
        <p className="text-sm text-muted-foreground">Ai nevoie de cursă, tractare sau asistență?</p>
      </div>
      <AppLogo className="hidden sm:inline-flex" markClassName="h-11 w-11 rounded-xl text-lg" />
    </section>
  );
}
