import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type ErrorStateProps = {
  title?: string;
  description: string;
  retryLabel?: string;
  onRetry?: () => void;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({ title = "Ceva nu a mers bine", description, retryLabel = "Încearcă din nou", onRetry, action, className }: ErrorStateProps) {
  return (
    <div className={cn("rounded-3xl border border-destructive/30 bg-destructive/[0.08] p-5 text-center", className)}>
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-destructive/12 text-destructive">
        <TriangleAlert className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="mt-3 font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {(onRetry || action) && (
        <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
          {onRetry && (
            <Button type="button" variant="outline" onClick={onRetry}>
              {retryLabel}
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
