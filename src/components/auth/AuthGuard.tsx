import { type PropsWithChildren, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/store/useAppStore";

export function AuthGuard({ children }: PropsWithChildren) {
  const hydrateSession = useAppStore((state) => state.hydrateSession);
  const sessionLoading = useAppStore((state) => state.sessionLoading);

  useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  if (sessionLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-4">
        <div className="w-full max-w-md space-y-3">
          <Skeleton className="h-12 w-12" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
