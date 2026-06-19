import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

type AuthInstanceCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
};

export function AuthInstanceCard({ icon: Icon, title, description, active, onClick }: AuthInstanceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-24 w-full items-start gap-3 rounded-lg border bg-card p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "border-primary bg-primary/10 text-foreground" : "hover:bg-muted"
      )}
    >
      <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary", active && "bg-primary text-primary-foreground")}>
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>
      </span>
    </button>
  );
}
