import { Link } from "react-router-dom";
import { SupportEmptyState } from "@/components/support/SupportEmptyState";
import { SupportTicketCard } from "@/components/support/SupportTicketCard";
import { Button } from "@/components/ui/button";
import type { SupportTicket } from "@/types/domain";

type SupportTicketListProps = {
  tickets: SupportTicket[];
  basePath: string;
};

export function SupportTicketList({ tickets, basePath }: SupportTicketListProps) {
  if (tickets.length === 0) {
    return (
      <SupportEmptyState
        action={
          <Button asChild>
            <Link to={`${basePath}/new`}>Creează ticket</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-3">
      {tickets.map((ticket) => (
        <SupportTicketCard key={ticket.id} ticket={ticket} basePath={basePath} />
      ))}
    </div>
  );
}
