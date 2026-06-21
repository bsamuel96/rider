import { cn } from "@/utils/cn";

type AppLogoProps = {
  className?: string;
  markClassName?: string;
};

export function AppLogo({ className, markClassName }: AppLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "grid h-12 w-12 place-items-center rounded-2xl bg-[#101820] text-xl font-black text-[#29C7AC] shadow-map-control",
          markClassName
        )}
        aria-hidden="true"
      >
        R
      </span>
      <span className="text-lg font-black tracking-normal">Rider</span>
    </span>
  );
}
