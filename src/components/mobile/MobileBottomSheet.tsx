import type { PropsWithChildren } from "react";
import { cn } from "@/utils/cn";

type MobileBottomSheetProps = PropsWithChildren<{
  size?: "compact" | "medium" | "large";
  className?: string;
}>;

const sizeClasses = {
  compact: "max-h-[30svh]",
  medium: "max-h-[38svh]",
  large: "max-h-[46svh]"
};

export function MobileBottomSheet({ children, size = "medium", className }: MobileBottomSheetProps) {
  return (
    <section
      className={cn(
        "absolute inset-x-3 bottom-[var(--floating-bottom-offset)] z-[540] overflow-y-auto rounded-t-[2rem] border border-border/60 bg-background/86 px-4 pb-[calc(1rem+var(--safe-bottom))] pt-4 shadow-floating backdrop-blur-2xl md:hidden",
        sizeClasses[size],
        className
      )}
    >
      <span className="mx-auto mb-4 block h-[5px] w-11 rounded-full bg-muted-foreground/25" aria-hidden="true" />
      {children}
    </section>
  );
}
