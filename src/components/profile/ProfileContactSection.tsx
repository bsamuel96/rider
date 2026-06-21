import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProfileField } from "@/components/profile/ProfileField";
import type { CommonProfileValues } from "@/validation/profileSchemas";

type ProfileContactSectionProps = {
  register: UseFormRegister<CommonProfileValues>;
  errors: FieldErrors<CommonProfileValues>;
};

export function ProfileContactSection({ register, errors }: ProfileContactSectionProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <ProfileField
        id="profile-email"
        label="Email"
        error={errors.email?.message}
        inputProps={{ type: "email", autoComplete: "email", ...register("email") }}
      />
      <ProfileField
        id="profile-phone"
        label="Telefon"
        error={errors.phone?.message}
        inputProps={{ type: "tel", autoComplete: "tel", ...register("phone") }}
      />
      <ProfileField
        id="profile-emergency-name"
        label="Contact urgență"
        error={errors.emergencyContactName?.message}
        inputProps={{ ...register("emergencyContactName") }}
      />
      <ProfileField
        id="profile-emergency-phone"
        label="Telefon urgență"
        error={errors.emergencyContactPhone?.message}
        inputProps={{ type: "tel", ...register("emergencyContactPhone") }}
      />
    </div>
  );
}
