import type { PropsWithChildren } from "react";
import { cn } from "@/utils/cn";

type CustomerHomeLayoutProps = PropsWithChildren<{
  className?: string;
}>;

export function CustomerHomeLayout({ children, className }: CustomerHomeLayoutProps) {
  return (
    <main className={cn("customer-home min-h-[var(--home-safe-height)] bg-background px-3 py-3 md:px-5", className)}>
      {children}
    </main>
  );
}
