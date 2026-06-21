import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/utils/cn";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-3xl border border-border/60 bg-background/70 p-6 text-center shadow-sm", className)}>
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
        {icon || <Inbox className="h-5 w-5" aria-hidden="true" />}
      </span>
      <h2 className="mt-4 text-base font-semibold">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
