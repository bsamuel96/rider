import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type MapBottomSheetProps = HTMLAttributes<HTMLDivElement> & {
  withHandle?: boolean;
};

export function MapBottomSheet({ children, className, withHandle = true, ...props }: MapBottomSheetProps) {
  return (
    <div className={cn("glass-bottom-sheet map-layer-dock p-3 text-foreground md:rounded-3xl", className)} {...props}>
      {withHandle && <span className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-muted-foreground/35" aria-hidden="true" />}
      {children}
    </div>
  );
}
