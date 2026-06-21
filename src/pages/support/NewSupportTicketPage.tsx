import { useNavigate } from "react-router-dom";
import { NewSupportTicketForm } from "@/components/support/NewSupportTicketForm";
import { ErrorState } from "@/components/ui/ErrorState";
import { useCreateSupportTicket } from "@/hooks/useCreateSupportTicket";
import { useToast } from "@/hooks/useToast";
import { useAppStore } from "@/store/useAppStore";
import { getSupportBasePath } from "@/utils/communicationRoutes";

export function NewSupportTicketPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const profile = useAppStore((state) => state.profile);
  const basePath = getSupportBasePath(profile);
  const createSupport = useCreateSupportTicket();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {createSupport.error && <ErrorState description={createSupport.error} />}
      <NewSupportTicketForm
        loading={createSupport.loading}
        onSubmit={async (values) => {
          const ticket = await createSupport.createTicket(values);
          toast({
            title: "Ticket creat",
            description: "Suportul Rider a primit solicitarea ta.",
            tone: "success"
          });
          navigate(`${basePath}/${ticket.id}`);
        }}
      />
    </div>
  );
}
