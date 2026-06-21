import { PreferredPaymentMethod } from "@/components/profile/PreferredPaymentMethod";
import { ThemePreference } from "@/components/profile/ThemePreference";

export function ProfilePaymentSection() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <h3 className="font-semibold">Metodă de plată preferată</h3>
        <p className="mt-1 text-sm text-muted-foreground">Această metodă va fi selectată implicit la următoarea comandă.</p>
        <div className="mt-4">
          <PreferredPaymentMethod />
        </div>
      </div>
      <div>
        <h3 className="font-semibold">Tema aplicației</h3>
        <p className="mt-1 text-sm text-muted-foreground">Alege automat, light sau dark.</p>
        <div className="mt-4 max-w-sm">
          <ThemePreference />
        </div>
      </div>
    </div>
  );
}
