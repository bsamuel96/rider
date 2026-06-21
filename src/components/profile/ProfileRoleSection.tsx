import type { ReactNode } from "react";
import { Building2, Car, FileCheck2, LifeBuoy, ShieldCheck, Truck, UserCog } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/domain";
import { getSupportBasePath } from "@/utils/communicationRoutes";

type ProfileRoleSectionProps = {
  profile: Profile;
};

export function ProfileRoleSection({ profile }: ProfileRoleSectionProps) {
  if (profile.role === "driver") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <RoleTile icon={Car} title="Vehicul activ" body="Editează mașina folosită pentru curse.">
          <Button asChild variant="outline" className="mt-3 w-full">
            <Link to="/driver/vehicle">Deschide vehiculul</Link>
          </Button>
        </RoleTile>
        <RoleTile icon={FileCheck2} title="Documente șofer" body="Permis, talon și documente de verificare.">
          <Button asChild variant="outline" className="mt-3 w-full">
            <Link to="/driver/documents">Vezi documente</Link>
          </Button>
        </RoleTile>
        <SupportRoleTile profile={profile} />
      </div>
    );
  }

  if (profile.role === "roadside_operator") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <RoleTile icon={Truck} title="Vehicul intervenție" body="Platformă, van service sau vehicul utilitar.">
          <Button asChild variant="outline" className="mt-3 w-full">
            <Link to="/roadside-operator/vehicles">Editează vehiculul</Link>
          </Button>
        </RoleTile>
        <RoleTile icon={ShieldCheck} title="Zone și servicii" body="Regiuni active, tractare și intervenții.">
          <Badge variant="secondary" className="mt-3">
            Operator verificare
          </Badge>
        </RoleTile>
        <SupportRoleTile profile={profile} />
      </div>
    );
  }

  if (profile.role === "admin") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <RoleTile icon={UserCog} title="Administrator" body="Rol operațional cu acces la control și aprobări.">
          <Badge variant="secondary" className="mt-3">
            Read-only role badge
          </Badge>
        </RoleTile>
        <SupportRoleTile profile={profile} />
      </div>
    );
  }

  if (profile.role === "fleet_manager") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <RoleTile icon={Building2} title="Fleet Manager" body="Gestionează separat flota transport și flota roadside.">
          <Button asChild variant="outline" className="mt-3 w-full">
            <Link to="/fleet-manager">Deschide fleet dashboard</Link>
          </Button>
        </RoleTile>
        <RoleTile icon={Truck} title="Roadside SLA" body="Urmărește solicitările Rapid, garanția de 30 min și confirmările clientului.">
          <Badge variant="warning" className="mt-3">
            SLA activ
          </Badge>
        </RoleTile>
        <SupportRoleTile profile={profile} />
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <RoleTile icon={ShieldCheck} title="Client Rider" body="Adrese, plată preferată și locații favorite.">
        <Badge variant="secondary" className="mt-3">
          Client activ
        </Badge>
      </RoleTile>
      <SupportRoleTile profile={profile} />
    </div>
  );
}

type RoleTileProps = {
  icon: typeof Car;
  title: string;
  body: string;
  children?: ReactNode;
};

function RoleTile({ icon: Icon, title, body, children }: RoleTileProps) {
  return (
    <div className="rounded-3xl bg-muted/50 p-4">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      {children}
    </div>
  );
}

function SupportRoleTile({ profile }: { profile: Profile }) {
  return (
    <RoleTile icon={LifeBuoy} title="Suport" body="Vezi tichetele tale sau cere ajutor pentru curse, plăți, documente ori aplicație.">
      <Button asChild variant="outline" className="mt-3 w-full">
        <Link to={getSupportBasePath(profile)}>Deschide suport</Link>
      </Button>
    </RoleTile>
  );
}
