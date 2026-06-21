import { Button } from "@/components/ui/button";

type CustomerIssueSolvedConfirmationProps = {
  onConfirm: () => void;
  onDispute: () => void;
};

export function CustomerIssueSolvedConfirmation({ onConfirm, onDispute }: CustomerIssueSolvedConfirmationProps) {
  return (
    <div className="space-y-3 rounded-3xl bg-muted/55 p-4">
      <div>
        <p className="font-semibold">Problema a fost rezolvată?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirmă doar dacă mașina este în siguranță sau problema pentru care ai cerut ajutor a fost rezolvată.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" onClick={onConfirm}>
          Confirmă rezolvarea
        </Button>
        <Button type="button" variant="outline" onClick={onDispute}>
          Raportează problemă
        </Button>
      </div>
    </div>
  );
}
