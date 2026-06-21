import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileFieldProps = {
  id: string;
  label: string;
  error?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
};

export function ProfileField({ id, label, error, inputProps }: ProfileFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} className="min-h-12 rounded-2xl bg-background/70" {...inputProps} />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
