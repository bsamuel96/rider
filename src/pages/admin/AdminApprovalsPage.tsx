import { useState } from "react";
import { CheckCircle2, FileWarning, PauseCircle, UserCheck, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";

const approvalItems = [
  {
    name: "Andrei Popescu",
    email: "andrei.driver@rider.ro",
    phone: "+40 721 000 100",
    role: "Șofer",
    status: "pending_review",
    vehicle: "Dacia Jogger B120RID",
    documents: "Permis, Talon, RCA, ITP",
    createdAt: "2026-06-19"
  },
  {
    name: "Tow Rapid SRL",
    email: "dispatch@towrapid.ro",
    phone: "+40 731 000 200",
    role: "Tractare & Asistență",
    status: "pending_review",
    vehicle: "Platformă B300TOW",
    documents: "Certificat firmă, RCA, ITP, Autorizații",
    createdAt: "2026-06-19"
  }
];

const sections = ["Șoferi în așteptare", "Operatori roadside în așteptare", "Vehicule în așteptare", "Documente expirate", "Documente respinse"];

export function AdminApprovalsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState(approvalItems);

  const updateStatus = (email: string, status: string, message: string) => {
    setItems((current) => current.map((item) => (item.email === email ? { ...item, status } : item)));
    toast({
      title: "Acțiune demo aplicată",
      description: message,
      tone: status === "approved" ? "success" : status === "rejected" ? "error" : "warning"
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <Badge variant="secondary">Administrator</Badge>
        <h1 className="mt-3 text-2xl font-semibold">Aprobări</h1>
        <p className="mt-1 text-sm text-muted-foreground">Aprobă, respinge sau cere documente suplimentare pentru conturi operaționale.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        {sections.map((section) => (
          <Card key={section} className="p-4">
            <p className="text-sm font-semibold">{section}</p>
            <p className="mt-2 text-2xl font-semibold">{section.includes("Documente") ? 1 : 2}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.email} className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{item.name}</h2>
                  <Badge variant="warning">{item.status}</Badge>
                  <Badge variant="outline">{item.role}</Badge>
                </div>
                <dl className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <div>
                    <dt>Email</dt>
                    <dd className="font-medium text-foreground">{item.email}</dd>
                  </div>
                  <div>
                    <dt>Telefon</dt>
                    <dd className="font-medium text-foreground">{item.phone}</dd>
                  </div>
                  <div>
                    <dt>Vehicul</dt>
                    <dd className="font-medium text-foreground">{item.vehicle}</dd>
                  </div>
                  <div>
                    <dt>Documente</dt>
                    <dd className="font-medium text-foreground">{item.documents}</dd>
                  </div>
                  <div>
                    <dt>Dată înregistrare</dt>
                    <dd className="font-medium text-foreground">{item.createdAt}</dd>
                  </div>
                </dl>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:w-72 lg:grid-cols-1">
                <Button
                  type="button"
                  onClick={() => updateStatus(item.email, "approved", `${item.name} a fost aprobat în demo.`)}
                  disabled={item.status === "approved"}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {item.status === "approved" ? "Aprobat" : "Aprobă contul"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    updateStatus(item.email, "needs_more_documents", `Am cerut documente suplimentare pentru ${item.name}.`)
                  }
                >
                  <FileWarning className="h-4 w-4" />
                  Cere documente suplimentare
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => updateStatus(item.email, "suspended", `${item.name} a fost suspendat în demo.`)}
                >
                  <PauseCircle className="h-4 w-4" />
                  Suspendă
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => updateStatus(item.email, "rejected", `Documentul pentru ${item.name} a fost respins.`)}
                >
                  <XCircle className="h-4 w-4" />
                  Respinge documentul
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserCheck className="h-4 w-4 text-primary" />
          În producție, acțiunile vor actualiza `registration_status`, `vehicle_status` și `user_documents.status`, apoi vor trimite notificări.
        </p>
      </Card>
    </div>
  );
}
