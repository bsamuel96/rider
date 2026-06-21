import { zodResolver } from "@hookform/resolvers/zod";
import { Chrome, LogIn, MessageSquareText } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { signInWithRole } from "@/services/auth";
import { INSTANCE_LABELS } from "@/services/roleRedirect";
import { isSupabaseConfigured, supabase } from "@/services/supabase";
import type { AuthInstance } from "@/types/domain";
import { customerLoginSchema, type LoginFormValues } from "@/validation/authSchemas";

type LoginFormProps = {
  instance: AuthInstance;
};

const buttonText: Record<AuthInstance, string> = {
  customer: "Intră ca client",
  driver: "Intră ca șofer",
  roadside: "Intră în dispecerat",
  fleet_manager: "Intră ca Fleet Manager"
};

export function LoginForm({ instance }: LoginFormProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  });

  const submit = async (values: LoginFormValues) => {
    setError(null);

    try {
      const result = await signInWithRole(values, instance);
      navigate(result.redirectTo);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Autentificarea nu a reușit.");
    }
  };

  const continueWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
  };

  const sendOtp = async () => {
    if (!isSupabaseConfigured) {
      return;
    }

    const phone = form.getValues("identifier");
    const result = await supabase.auth.signInWithOtp({ phone });

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setError("OTP trimis. Verificarea codului poate fi conectată în Supabase Auth.");
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
      <div className="space-y-2">
        <Label htmlFor="identifier">Email sau username</Label>
        <Input id="identifier" placeholder="email@rider.ro sau username" {...form.register("identifier")} />
        {form.formState.errors.identifier && (
          <p className="text-sm text-destructive">{form.formState.errors.identifier.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Parolă</Label>
        <Input id="password" type="password" placeholder="minimum 8 caractere" {...form.register("password")} />
        {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
        <Link to="/auth/forgot-password" className="inline-block text-xs font-semibold text-primary">
          Ai uitat parola?
        </Link>
      </div>

      {error && <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      <LoadingButton type="submit" className="w-full" size="lg" loading={form.formState.isSubmitting} loadingLabel="Se conectează...">
        <LogIn className="h-4 w-4" />
        {buttonText[instance]}
      </LoadingButton>

      <div className="grid gap-2">
        {isSupabaseConfigured && (
          <Button type="button" variant="outline" onClick={continueWithGoogle}>
            <Chrome className="h-4 w-4" />
            Continuă cu Google
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={sendOtp}
          disabled={!isSupabaseConfigured}
          title={!isSupabaseConfigured ? "OTP este disponibil după configurarea Supabase Auth." : undefined}
        >
          <MessageSquareText className="h-4 w-4" />
          OTP telefon pentru {INSTANCE_LABELS[instance]}
        </Button>
      </div>
    </form>
  );
}
