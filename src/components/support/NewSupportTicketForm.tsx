import { LifeBuoy } from "lucide-react";
import { useState } from "react";
import { SupportAttachmentUploader } from "@/components/support/SupportAttachmentUploader";
import { SupportCategorySelector } from "@/components/support/SupportCategorySelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Textarea } from "@/components/ui/textarea";
import type { CreateSupportTicketValues } from "@/services/support";
import type { SupportContactPreference, SupportTicketCategory, SupportTicketPriority } from "@/types/domain";

type NewSupportTicketFormProps = {
  loading?: boolean;
  onSubmit: (values: CreateSupportTicketValues) => Promise<void>;
};

export function NewSupportTicketForm({ loading, onSubmit }: NewSupportTicketFormProps) {
  const [category, setCategory] = useState<SupportTicketCategory>("app");
  const [priority, setPriority] = useState<SupportTicketPriority>("normal");
  const [contactPreference, setContactPreference] = useState<SupportContactPreference>("in_app");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit = subject.trim().length >= 4 && description.trim().length >= 8;

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSubmit) {
          return;
        }

        void onSubmit({
          category,
          priority,
          subject: subject.trim(),
          description: description.trim(),
          contactPreference
        });
      }}
    >
      <div className="rounded-3xl border border-border/60 bg-background/70 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/12 text-primary">
            <LifeBuoy className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-semibold">Ticket nou</h1>
            <p className="text-sm text-muted-foreground">Descrie problema. Suportul îți răspunde în aplicație.</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Categorie</Label>
        <SupportCategorySelector value={category} onChange={setCategory} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="support-priority">Prioritate</Label>
          <select
            id="support-priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value as SupportTicketPriority)}
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="low">Scăzut</option>
            <option value="normal">Normal</option>
            <option value="high">Ridicat</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="support-contact">Contact</Label>
          <select
            id="support-contact"
            value={contactPreference}
            onChange={(event) => setContactPreference(event.target.value as SupportContactPreference)}
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="in_app">În aplicație</option>
            <option value="phone">Telefon</option>
            <option value="email">Email</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="support-subject">Subiect</Label>
        <Input id="support-subject" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Ex: Problemă cu plata" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="support-description">Descriere</Label>
        <Textarea
          id="support-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Spune-ne ce s-a întâmplat și ce ai nevoie."
          className="min-h-32"
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SupportAttachmentUploader />
        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Anulează
          </Button>
          <LoadingButton type="submit" loading={loading} loadingLabel="Se creează..." disabled={!canSubmit}>
            Creează ticket
          </LoadingButton>
        </div>
      </div>
    </form>
  );
}
