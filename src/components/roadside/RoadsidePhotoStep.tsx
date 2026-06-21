import { Camera } from "lucide-react";

type RoadsidePhotoStepProps = {
  photo?: File;
  onPhotoChange: (file?: File) => void;
  onNext: () => void;
  onBack: () => void;
};

export function RoadsidePhotoStep({ photo, onPhotoChange, onNext, onBack }: RoadsidePhotoStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold">Adaugă o poză opțional</p>
        <p className="mt-1 text-xs text-muted-foreground">O poză poate ajuta operatorul să înțeleagă situația mai repede.</p>
      </div>
      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/70 bg-background/45 p-4 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/60">
        <Camera className="h-5 w-5 text-primary" aria-hidden="true" />
        {photo ? photo.name : "Alege o poză sau continuă fără poză"}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => onPhotoChange(event.target.files?.[0])}
        />
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onBack}
          className="min-h-11 rounded-xl border border-border/60 bg-background/55 px-4 text-sm font-semibold"
        >
          Înapoi
        </button>
        <button type="button" onClick={onNext} className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
          Continuă
        </button>
      </div>
    </div>
  );
}
