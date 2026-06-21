import { ShieldAlert } from "lucide-react";
import { SupportPriorityBadge } from "@/components/support/SupportPriorityBadge";
import { SupportStatusTimeline } from "@/components/support/SupportStatusTimeline";
import { SupportTicketComposer } from "@/components/support/SupportTicketComposer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Profile, SupportMessage, SupportTicket } from "@/types/domain";

type SupportTicketDetailProps = {
  ticket: SupportTicket;
  messages: SupportMessage[];
  profile?: Profile | null;
  saving?: boolean;
  onReply: (body: string) => Promise<void>;
  onResolve: () => Promise<void>;
  onReopen: () => Promise<void>;
  onClose: () => Promise<void>;
  onAssign: () => Promise<void>;
  onEscalate: () => Promise<void>;
};

export function SupportTicketDetail({
  ticket,
  messages,
  profile,
  saving,
  onReply,
  onResolve,
  onReopen,
  onClose,
  onAssign,
  onEscalate
}: SupportTicketDetailProps) {
  const adminLike = profile?.role === "admin" || profile?.role === "fleet_manager";

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <Card className="rounded-3xl p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{ticket.category}</Badge>
            <SupportPriorityBadge priority={ticket.priority} />
            <Badge variant={ticket.status === "closed" || ticket.status === "resolved" ? "secondary" : "warning"}>
              {ticket.status.replace(/_/g, " ")}
            </Badge>
          </div>
          <h1 className="mt-4 text-2xl font-semibold">{ticket.subject}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{ticket.description}</p>
          <div className="mt-5">
            <SupportStatusTimeline status={ticket.status} />
          </div>
        </Card>

        <Card className="rounded-3xl p-4">
          <h2 className="font-semibold">Conversație suport</h2>
          <div className="mt-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="rounded-2xl bg-muted/55 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{message.senderName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleString("ro-RO", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{message.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <SupportTicketComposer onReply={onReply} saving={saving} />
          </div>
        </Card>
      </section>

      <aside className="space-y-3">
        <Card className="rounded-3xl p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/12 text-primary">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold">Acțiuni</h2>
              <p className="text-xs text-muted-foreground">Fiecare acțiune modifică starea demo.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {ticket.status === "resolved" || ticket.status === "closed" ? (
              <Button type="button" variant="outline" onClick={() => void onReopen()}>
                Redeschide
              </Button>
            ) : (
              <Button type="button" onClick={() => void onResolve()}>
                Marchează rezolvat
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => void onClose()}>
              Închide ticket
            </Button>
            {adminLike && (
              <>
                <Button type="button" variant="outline" onClick={() => void onAssign()}>
                  Asignează mie
                </Button>
                <Button type="button" variant="outline" onClick={() => void onEscalate()}>
                  Escaladează
                </Button>
              </>
            )}
          </div>
        </Card>
      </aside>
    </div>
  );
}
