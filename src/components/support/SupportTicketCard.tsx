import { MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatUnreadBadge } from "@/components/chat/ChatUnreadBadge";
import { SupportPriorityBadge } from "@/components/support/SupportPriorityBadge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { SupportTicket } from "@/types/domain";

type SupportTicketCardProps = {
  ticket: SupportTicket;
  basePath: string;
};

export function SupportTicketCard({ ticket, basePath }: SupportTicketCardProps) {
  return (
    <Link to={`${basePath}/${ticket.id}`} className="block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Card className="rounded-3xl p-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-floating active:scale-[0.98]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{ticket.category}</Badge>
              <SupportPriorityBadge priority={ticket.priority} />
              <ChatUnreadBadge count={ticket.unreadCount} />
            </div>
            <h2 className="mt-3 truncate font-semibold">{ticket.subject}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{ticket.description}</p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
            <MessageSquareText className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        <p className="mt-3 text-xs font-semibold text-muted-foreground">Status: {ticket.status.replace(/_/g, " ")}</p>
      </Card>
    </Link>
  );
}
