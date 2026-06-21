import { Building2, Car, UserRound, Wrench } from "lucide-react";
import { AuthInstanceCard } from "@/components/auth/AuthInstanceCard";
import type { AuthInstance } from "@/types/domain";

const authInstances = [
  {
    value: "customer",
    title: "Client",
    description: "Comandă curse, premium, tractare sau asistență.",
    icon: UserRound
  },
  {
    value: "driver",
    title: "Șofer",
    description: "Primește curse și gestionează câștigurile.",
    icon: Car
  },
  {
    value: "roadside",
    title: "Tractare & Asistență",
    description: "Acceptă intervenții, tractări și solicitări roadside.",
    icon: Wrench
  },
  {
    value: "fleet_manager",
    title: "Fleet Manager",
    description: "Gestionează flote transport și roadside separat.",
    icon: Building2
  }
] as const;

type AuthRoleTabsProps = {
  value: AuthInstance;
  onChange: (instance: AuthInstance) => void;
};

export function AuthRoleTabs({ value, onChange }: AuthRoleTabsProps) {
  return (
    <div className="grid gap-2 md:grid-cols-4" role="tablist" aria-label="Alege tipul de cont">
      {authInstances.map((instance) => (
        <AuthInstanceCard
          key={instance.value}
          icon={instance.icon}
          title={instance.title}
          description={instance.description}
          active={value === instance.value}
          onClick={() => onChange(instance.value)}
        />
      ))}
    </div>
  );
}
