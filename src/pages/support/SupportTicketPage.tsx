import { useParams } from "react-router-dom";
import { SupportTicketDetail } from "@/components/support/SupportTicketDetail";
import { ErrorState } from "@/components/ui/ErrorState";
import { useSupportTicket } from "@/hooks/useSupportTicket";
import { useToast } from "@/hooks/useToast";
import { useAppStore } from "@/store/useAppStore";

export function SupportTicketPage() {
  const { ticketId } = useParams();
  const profile = useAppStore((state) => state.profile);
  const { toast } = useToast();
  const support = useSupportTicket(ticketId);

  if (support.loading) {
    return <div className="mx-auto max-w-5xl rounded-3xl border border-border/60 bg-background/80 p-5 text-sm text-muted-foreground">Se încarcă ticketul...</div>;
  }

  if (support.error) {
    return <ErrorState description={support.error} onRetry={support.retry} className="mx-auto max-w-5xl" />;
  }

  if (!support.ticket) {
    return <ErrorState title="Ticket indisponibil" description="Nu am găsit ticketul cerut." className="mx-auto max-w-5xl" />;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <SupportTicketDetail
        ticket={support.ticket}
        messages={support.messages}
        profile={profile}
        saving={support.saving}
        onReply={async (body) => {
          await support.reply(body);
          toast({ title: "Răspuns trimis", description: "Mesajul este vizibil în conversația suport.", tone: "success" });
        }}
        onResolve={async () => {
          await support.resolve();
          toast({ title: "Ticket rezolvat", description: "Poți redeschide ticketul dacă problema reapare.", tone: "success" });
        }}
        onReopen={async () => {
          await support.reopen();
          toast({ title: "Ticket redeschis", description: "Suportul va vedea din nou solicitarea.", tone: "warning" });
        }}
        onClose={async () => {
          await support.close();
          toast({ title: "Ticket închis", description: "Ticketul a fost închis în demo.", tone: "success" });
        }}
        onAssign={async () => {
          await support.assign();
          toast({ title: "Ticket asignat", description: "Ticketul este acum în coada ta demo.", tone: "success" });
        }}
        onEscalate={async () => {
          await support.setStatus("escalated");
          toast({ title: "Ticket escaladat", description: "Cazul a fost marcat ca escaladat.", tone: "warning" });
        }}
      />
    </div>
  );
}
