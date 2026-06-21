import { Button } from "@/components/ui/button";

type CustomerArrivalConfirmationProps = {
  onConfirm: () => void;
  onNotArrived: () => void;
};

export function CustomerArrivalConfirmation({ onConfirm, onNotArrived }: CustomerArrivalConfirmationProps) {
  return (
    <div className="space-y-3 rounded-3xl bg-muted/55 p-4">
      <div>
        <p className="font-semibold">A ajuns echipajul?</p>
        <p className="mt-1 text-sm text-muted-foreground">Confirmă doar dacă echipajul este lângă tine sau lângă vehicul.</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" onClick={onConfirm}>
          Confirmă sosirea
        </Button>
        <Button type="button" variant="outline" onClick={onNotArrived}>
          Nu a ajuns încă
        </Button>
      </div>
    </div>
  );
}
