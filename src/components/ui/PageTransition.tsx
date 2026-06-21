import type { PropsWithChildren } from "react";
import { cn } from "@/utils/cn";

type PageTransitionProps = PropsWithChildren<{
  pageKey: string;
  className?: string;
}>;

export function PageTransition({ pageKey, children, className }: PageTransitionProps) {
  return (
    <div key={pageKey} className={cn("motion-safe:animate-page-enter", className)}>
      {children}
    </div>
  );
}
