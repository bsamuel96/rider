import {
  Accessibility,
  BriefcaseBusiness,
  Car,
  CircleGauge,
  HeartHandshake,
  Lock,
  Route,
  ShieldCheck,
  Star,
  UserCheck
} from "lucide-react";

export const driverGuides = [
  { slug: "recomandari", title: "Recomandări", description: "Sfaturi rapide pentru ture bune.", icon: HeartHandshake },
  { slug: "condusul-cu-rider", title: "Condusul cu Rider", description: "Cum funcționează fluxurile de cursă.", icon: Car },
  { slug: "siguranta", title: "Siguranță", description: "Ce faci în situații neprevăzute.", icon: ShieldCheck },
  { slug: "respect-diversitate", title: "Respect și diversitate", description: "Standarde de conduită.", icon: HeartHandshake },
  { slug: "securitatea-informatiilor", title: "Securitatea informațiilor", description: "Protejează datele pasagerilor.", icon: Lock },
  { slug: "curse-accesibile", title: "Curse accesibile", description: "Asistență pentru pasageri cu nevoi speciale.", icon: Accessibility },
  { slug: "scor-sofer", title: "Scorul șoferului", description: "Ce îl influențează și cum îl crești.", icon: CircleGauge },
  { slug: "rata-acceptare", title: "Rata de acceptare", description: "Impact asupra campaniilor.", icon: UserCheck },
  { slug: "scor-pasager", title: "Scorul pasagerului", description: "Cum interpretezi ratingurile.", icon: Star },
  { slug: "curse-optionale", title: "Curse opționale", description: "Alege tipuri de curse potrivite.", icon: Route },
  { slug: "pe-drum", title: "Pe drum", description: "Navigație, pickup și comunicare.", icon: Route },
  { slug: "business", title: "Curse Business", description: "Așteptări pentru clienți business.", icon: BriefcaseBusiness }
];
