import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured, supabase } from "@/services/supabase";

const forgotPasswordSchema = z.object({
  email: z.string().email("Introdu un email valid.")
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const submit = async (values: ForgotPasswordValues) => {
    if (isSupabaseConfigured) {
      await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/login`
      });
    }

    setMessage("Dacă emailul există, vei primi instrucțiuni pentru resetarea parolei.");
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Resetare parolă</CardTitle>
          <CardDescription>Primești un link securizat pentru contul tău Rider.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input id="forgot-email" type="email" placeholder="email@rider.ro" {...form.register("email")} />
              {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
            </div>
            {message && <p className="rounded-lg border bg-muted p-3 text-sm">{message}</p>}
            <Button className="w-full" type="submit">
              <Mail className="h-4 w-4" />
              Trimite link
            </Button>
            <Button asChild className="w-full" type="button" variant="ghost">
              <Link to="/auth/login">Înapoi la login</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
