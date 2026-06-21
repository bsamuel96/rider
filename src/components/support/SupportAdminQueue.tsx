import { SupportTicketList } from "@/components/support/SupportTicketList";
import type { SupportTicket } from "@/types/domain";

type SupportAdminQueueProps = {
  tickets: SupportTicket[];
  basePath: string;
};

export function SupportAdminQueue({ tickets, basePath }: SupportAdminQueueProps) {
  const priorityTickets = tickets.filter((ticket) => ticket.priority === "urgent" || ticket.priority === "high");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold">Coadă prioritară</h2>
        <p className="mt-1 text-sm text-muted-foreground">Ticketuri urgente, escaladate sau cu risc operațional.</p>
      </div>
      <SupportTicketList tickets={priorityTickets.length > 0 ? priorityTickets : tickets} basePath={basePath} />
    </div>
  );
}
