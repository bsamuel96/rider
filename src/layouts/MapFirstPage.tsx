import type { PropsWithChildren } from "react";
import { cn } from "@/utils/cn";

type MapFirstPageProps = PropsWithChildren<{
  bottomSafeArea?: boolean;
  withBottomNavOffset?: boolean;
  className?: string;
}>;

export function MapFirstPage({ children, bottomSafeArea = true, withBottomNavOffset = true, className }: MapFirstPageProps) {
  return (
    <section
      className={cn(
        "relative min-h-[100svh] overflow-hidden lg:min-h-[calc(100vh-4rem)]",
        bottomSafeArea && "pb-[calc(env(safe-area-inset-bottom)+72px)] lg:pb-0",
        withBottomNavOffset && "lg:pb-0",
        className
      )}
    >
      {children}
    </section>
  );
}
