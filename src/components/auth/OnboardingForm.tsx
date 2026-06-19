import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { AddressSearch } from "@/components/booking/AddressSearch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured, supabase } from "@/services/supabase";
import { useAppStore } from "@/store/useAppStore";
import type { AddressSuggestion } from "@/types/domain";

const onboardingSchema = z.object({
  fullName: z.string().min(3, "Introdu numele complet."),
  phone: z.string().min(8, "Introdu telefonul."),
  home: z.custom<AddressSuggestion>().optional(),
  work: z.custom<AddressSuggestion>().optional(),
  favorite: z.custom<AddressSuggestion>().optional()
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

const steps = ["Nume complet", "Telefon", "Adrese"] as const;

export function OnboardingForm() {
  const navigate = useNavigate();
  const profile = useAppStore((state) => state.profile);
  const setProfile = useAppStore((state) => state.setProfile);
  const [step, setStep] = useState(0);
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: profile?.fullName || "",
      phone: profile?.phone || ""
    }
  });

  const save = async (values: OnboardingValues) => {
    const nextProfile = {
      id: profile?.id || crypto.randomUUID(),
      email: profile?.email || "demo@rider.local",
      phone: values.phone,
      username: profile?.username,
      fullName: values.fullName,
      role: profile?.role || "client",
      theme: profile?.theme || "system"
    };

    setProfile(nextProfile);

    if (isSupabaseConfigured) {
      await supabase.from("profiles").upsert({
        id: nextProfile.id,
        email: nextProfile.email,
        phone: nextProfile.phone,
        full_name: nextProfile.fullName,
        role: nextProfile.role,
        theme: nextProfile.theme
      });

      const addresses = [
        ["Casă", values.home],
        ["Birou", values.work],
        ["Favorită", values.favorite]
      ] as const;

      await supabase.from("addresses").upsert(
        addresses
          .filter(([, address]) => Boolean(address))
          .map(([label, address]) => ({
            user_id: nextProfile.id,
            label,
            address: address!.label,
            lat: address!.lat,
            lng: address!.lng
          }))
      );
    }

    navigate("/");
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Onboarding</CardTitle>
        <CardDescription>Configurează profilul în 3 pași simpli.</CardDescription>
        <div className="grid grid-cols-3 gap-2 pt-3">
          {steps.map((label, index) => (
            <div key={label} className="space-y-1">
              <div className={`h-1.5 rounded-full ${index <= step ? "bg-primary" : "bg-muted"}`} />
              <p className="truncate text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={form.handleSubmit(save)}>
          {step === 0 && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Nume complet</Label>
              <Input id="fullName" placeholder="Samuel Buzatu" {...form.register("fullName")} />
              {form.formState.errors.fullName && (
                <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" type="tel" placeholder="+40 700 000 000" {...form.register("phone")} />
              {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <AddressSearch
                label="Adresă casă"
                placeholder="Caută adresa de acasă"
                onSelect={(address) => form.setValue("home", address)}
              />
              <AddressSearch
                label="Adresă birou"
                placeholder="Caută biroul"
                onSelect={(address) => form.setValue("work", address)}
              />
              <AddressSearch
                label="Adresă favorită"
                placeholder="Caută locația favorită"
                onSelect={(address) => form.setValue("favorite", address)}
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <Button type="button" variant="outline" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>
              <ArrowLeft className="h-4 w-4" />
              Înapoi
            </Button>
            {step < 2 ? (
              <Button type="button" onClick={() => setStep((current) => current + 1)}>
                Înainte
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit">
                <Check className="h-4 w-4" />
                Finalizează
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
