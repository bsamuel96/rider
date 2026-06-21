import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/LoadingButton";

type ProfileSaveBarProps = {
  dirty: boolean;
  saving: boolean;
  onCancel: () => void;
};

export function ProfileSaveBar({ dirty, saving, onCancel }: ProfileSaveBarProps) {
  if (!dirty) {
    return null;
  }

  return (
    <div className="fixed inset-x-3 bottom-[calc(var(--floating-bottom-offset)+0.5rem)] z-[650] rounded-3xl border border-border/60 bg-background/90 p-3 shadow-floating backdrop-blur-xl md:sticky md:bottom-4">
      <div className="grid grid-cols-[1fr_1.4fr] gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          Anulează
        </Button>
        <LoadingButton type="submit" form="profile-editor-form" loading={saving} loadingLabel="Se salvează...">
          Salvează modificările
        </LoadingButton>
      </div>
    </div>
  );
}
