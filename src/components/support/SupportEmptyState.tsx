import { LifeBuoy } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/EmptyState";

type SupportEmptyStateProps = {
  action?: ReactNode;
};

export function SupportEmptyState({ action }: SupportEmptyStateProps) {
  return (
    <EmptyState
      icon={<LifeBuoy className="h-5 w-5" aria-hidden="true" />}
      title="Nu ai tichete de suport"
      description="Când ai nevoie de ajutor, creează un ticket și conversația apare aici."
      action={action}
    />
  );
}
