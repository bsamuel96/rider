import { zodResolver } from "@hookform/resolvers/zod";
import { Chrome, KeyRound, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured, supabase } from "@/services/supabase";
import { useAppStore } from "@/store/useAppStore";
import type { Profile } from "@/types/domain";

const authSchema = z.object({
  email: z.string().email("Introdu un email valid."),
  username: z.string().min(3, "Username-ul trebuie să aibă minimum 3 caractere."),
  phone: z.string().min(8, "Introdu un număr de telefon valid."),
  password: z.string().min(8, "Parola trebuie să aibă minimum 8 caractere.")
});

type AuthFormValues = z.infer<typeof authSchema>;

export function AuthForm() {
  const navigate = useNavigate();
  const setProfile = useAppStore((state) => state.setProfile);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      username: "",
      phone: "",
      password: ""
    }
  });

  const createLocalProfile = (values: AuthFormValues): Profile => ({
    id: crypto.randomUUID(),
    email: values.email,
    phone: values.phone,
    username: values.username,
    fullName: values.username,
    role: "client",
    theme: "system"
  });

  const handleEmailAuth = async (values: AuthFormValues) => {
    setError(null);

    if (!isSupabaseConfigured) {
      setProfile(createLocalProfile(values));
      navigate("/onboarding");
      return;
    }

    const signIn = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password
    });

    const authResult =
      signIn.error?.message === "Invalid login credentials"
        ? await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
              data: {
                username: values.username,
                phone: values.phone
              }
            }
          })
        : signIn;

    if (authResult.error || !authResult.data.user) {
      setError(authResult.error?.message || "Autentificarea nu a reușit.");
      return;
    }

    const profile: Profile = {
      id: authResult.data.user.id,
      email: values.email,
      phone: values.phone,
      username: values.username,
      fullName: values.username,
      role: "client",
      theme: "system"
    };

    setProfile(profile);
    await supabase.from("profiles").upsert({
      id: profile.id,
      email: profile.email,
      phone: profile.phone,
      full_name: profile.fullName,
      role: profile.role,
      theme: profile.theme
    });
    navigate("/onboarding");
  };

  const handleGoogle = async () => {
    setError(null);

    if (!isSupabaseConfigured) {
      setError("Configurează Supabase pentru Google OAuth. În modul local folosește email + parolă.");
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/onboarding`
      }
    });
  };

  const handlePhone = async () => {
    const phone = form.getValues("phone");

    if (!isSupabaseConfigured) {
      setError("Configurează Supabase pentru OTP SMS. În modul local folosește email + parolă.");
      return;
    }

    const result = await supabase.auth.signInWithOtp({ phone });
    if (result.error) {
      setError(result.error.message);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <div className="mb-2 grid h-14 w-14 place-items-center rounded-lg bg-primary text-xl font-black text-primary-foreground">
          R
        </div>
        <CardTitle className="text-xl">Bine ai venit</CardTitle>
        <CardDescription>Mobilitate și asistență rutieră într-o singură aplicație</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleEmailAuth)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="nume@email.com" {...form.register("email")} />
            {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="rider96" {...form.register("username")} />
            {form.formState.errors.username && (
              <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" type="tel" placeholder="+40 700 000 000" {...form.register("phone")} />
            {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Parolă</Label>
            <Input id="password" type="password" placeholder="minimum 8 caractere" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>

          {error && <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
            <Mail className="h-4 w-4" />
            Continuă
          </Button>
        </form>

        <div className="mt-4 grid gap-2">
          <Button type="button" variant="outline" onClick={handleGoogle}>
            <Chrome className="h-4 w-4" />
            Continuă cu Google
          </Button>
          <Button type="button" variant="outline" onClick={handlePhone}>
            <Phone className="h-4 w-4" />
            Continuă cu Telefon
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate("/")}>
            <KeyRound className="h-4 w-4" />
            Intră în modul demo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
