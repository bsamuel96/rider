import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut, Save, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AddressSearch } from "@/components/booking/AddressSearch";
import { LocationPickerSheet } from "@/components/location/LocationPickerSheet";
import { ProfileAvatarEditor } from "@/components/profile/ProfileAvatarEditor";
import { ProfileContactSection } from "@/components/profile/ProfileContactSection";
import { ProfileField } from "@/components/profile/ProfileField";
import { ProfilePaymentSection } from "@/components/profile/ProfilePaymentSection";
import { ProfileRoleSection } from "@/components/profile/ProfileRoleSection";
import { ProfileSaveBar } from "@/components/profile/ProfileSaveBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateDriverProfile, updateProfileDetails, updateRoadsideOperatorProfile } from "@/services/profile";
import { createCurrentLocationSuggestion } from "@/services/geocoding";
import { ROLE_LABELS } from "@/services/roleRedirect";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAppStore } from "@/store/useAppStore";
import type { AddressSuggestion, Profile } from "@/types/domain";
import { commonProfileSchema, type CommonProfileValues } from "@/validation/profileSchemas";

type ProfileEditorProps = {
  profile: Profile;
};

type RoleDetails = {
  driverDisplayName: string;
  licenseNumber: string;
  serviceRegion: string;
  availabilityPreferences: string;
  companyName: string;
  dispatcherPhone: string;
  serviceRegions: string;
  serviceTypes: string;
};

type ProfileAddressField = "defaultAddress" | "homeAddress" | "workAddress";
type ProfileAddressSelections = Partial<Record<ProfileAddressField, AddressSuggestion>>;

function profileAddressStorageKey(profileId: string) {
  return `rider-profile-address-selections-${profileId}`;
}

function readProfileAddressSelections(profileId: string): ProfileAddressSelections {
  try {
    const rawValue = localStorage.getItem(profileAddressStorageKey(profileId));
    return rawValue ? (JSON.parse(rawValue) as ProfileAddressSelections) : {};
  } catch {
    localStorage.removeItem(profileAddressStorageKey(profileId));
    return {};
  }
}

function persistProfileAddressSelections(profileId: string, selections: ProfileAddressSelections) {
  localStorage.setItem(profileAddressStorageKey(profileId), JSON.stringify(selections));
}

function stringAddressSuggestion(label: string, fallback: AddressSuggestion): AddressSuggestion | undefined {
  if (!label) {
    return undefined;
  }

  return {
    ...fallback,
    id: `profile-address-${label}`,
    label,
    source: "favorite"
  };
}

function getDefaultValues(profile: Profile): CommonProfileValues {
  return {
    fullName: profile.fullName,
    username: profile.username || "",
    email: profile.email,
    phone: profile.phone || "",
    emergencyContactName: profile.emergencyContactName || "",
    emergencyContactPhone: profile.emergencyContactPhone || "",
    language: profile.language || "ro",
    defaultAddress: profile.defaultAddress || "",
    homeAddress: profile.homeAddress || "",
    workAddress: profile.workAddress || ""
  };
}

export function ProfileEditor({ profile }: ProfileEditorProps) {
  const navigate = useNavigate();
  const { position } = useGeolocation();
  const logout = useAppStore((state) => state.logout);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [roleDirty, setRoleDirty] = useState(false);
  const [addressPickerField, setAddressPickerField] = useState<ProfileAddressField | null>(null);
  const [addressSelections, setAddressSelections] = useState<ProfileAddressSelections>(() =>
    readProfileAddressSelections(profile.id)
  );
  const [roleDetails, setRoleDetails] = useState<RoleDetails>({
    driverDisplayName: profile.fullName,
    licenseNumber: "",
    serviceRegion: "",
    availabilityPreferences: "",
    companyName: "",
    dispatcherPhone: profile.phone || "",
    serviceRegions: "",
    serviceTypes: ""
  });
  const defaultValues = useMemo(() => getDefaultValues(profile), [profile]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<CommonProfileValues>({
    resolver: zodResolver(commonProfileSchema),
    defaultValues
  });
  const avatarDirty = avatarUrl !== profile.avatarUrl;
  const dirty = isDirty || avatarDirty || roleDirty;
  const formValues = watch();
  const currentLocation = createCurrentLocationSuggestion(position.lat, position.lng);

  const selectProfileAddress = (field: ProfileAddressField, address: AddressSuggestion) => {
    const nextAddress = {
      ...address,
      source: address.source || "map_pin"
    };
    const nextSelections = {
      ...addressSelections,
      [field]: nextAddress
    };

    setAddressSelections(nextSelections);
    persistProfileAddressSelections(profile.id, nextSelections);
    setValue(field, nextAddress.label, {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  const clearProfileAddress = (field: ProfileAddressField) => {
    const nextSelections = {
      ...addressSelections
    };

    delete nextSelections[field];
    setAddressSelections(nextSelections);
    persistProfileAddressSelections(profile.id, nextSelections);
    setValue(field, "", {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  const cancelChanges = () => {
    reset(defaultValues);
    setAvatarUrl(profile.avatarUrl);
    setRoleDirty(false);
    setSaveMessage(null);
  };

  const submit = handleSubmit(async (values) => {
    setSaving(true);
    setSaveMessage(null);

    try {
      await updateProfileDetails(profile.id, {
        ...values,
        avatarUrl
      });

      if (profile.role === "driver") {
        await updateDriverProfile(profile.id, {
          licenseNumber: roleDetails.licenseNumber,
          serviceRegion: roleDetails.serviceRegion,
          mainCity: roleDetails.availabilityPreferences
        });
      }

      if (profile.role === "roadside_operator") {
        await updateRoadsideOperatorProfile(profile.id, {
          companyName: roleDetails.companyName,
          dispatcherPhone: roleDetails.dispatcherPhone,
          serviceRegions: roleDetails.serviceRegions.split(",").map((item) => item.trim()).filter(Boolean),
          serviceTypes: roleDetails.serviceTypes.split(",").map((item) => item.trim()).filter(Boolean)
        });
      }

      reset(values);
      setRoleDirty(false);
      setSaveMessage("Profil salvat.");
    } finally {
      setSaving(false);
    }
  });

  const confirmLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <div className="mx-auto max-w-5xl pb-28 md:pb-8">
      <form id="profile-editor-form" className="space-y-4" onSubmit={submit}>
        <Card className="glass-panel rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <ProfileAvatarEditor fullName={profile.fullName} avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} />
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{ROLE_LABELS[profile.role]}</Badge>
                <Badge variant="outline">{profile.registrationStatus}</Badge>
              </div>
              <h1 className="mt-3 truncate text-2xl font-black">{profile.fullName}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{profile.email || "demo@rider.local"}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-panel rounded-3xl p-5">
          <SectionHeader title="Date personale" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ProfileField
              id="profile-full-name"
              label="Nume complet"
              error={errors.fullName?.message}
              inputProps={{ autoComplete: "name", ...register("fullName") }}
            />
            <ProfileField
              id="profile-username"
              label="Username"
              error={errors.username?.message}
              inputProps={{ autoComplete: "username", ...register("username") }}
            />
            <ProfileField
              id="profile-language"
              label="Limbă"
              error={errors.language?.message}
              inputProps={{ ...register("language") }}
            />
          </div>
        </Card>

        <Card className="glass-panel rounded-3xl p-5">
          <SectionHeader title="Contact" />
          <div className="mt-4">
            <ProfileContactSection register={register} errors={errors} />
          </div>
        </Card>

        <Card className="glass-panel rounded-3xl p-5">
          <SectionHeader title="Plată preferată" />
          <div className="mt-4">
            <ProfilePaymentSection />
          </div>
        </Card>

        {profile.role === "client" && (
          <Card className="glass-panel rounded-3xl p-5">
            <SectionHeader title="Adrese" />
            <div className="mt-4 grid gap-3">
              <ProfileAddressSelector
                label="Adresă implicită"
                placeholder="Caută adresa implicită"
                value={addressSelections.defaultAddress || stringAddressSuggestion(formValues.defaultAddress || "", currentLocation)}
                onSelect={(address) => selectProfileAddress("defaultAddress", address)}
                onPickOnMap={() => setAddressPickerField("defaultAddress")}
                onUseCurrentLocation={() => selectProfileAddress("defaultAddress", currentLocation)}
                onClear={() => clearProfileAddress("defaultAddress")}
              />
              <ProfileAddressSelector
                label="Acasă"
                placeholder="Caută adresa de acasă"
                value={addressSelections.homeAddress || stringAddressSuggestion(formValues.homeAddress || "", currentLocation)}
                onSelect={(address) => selectProfileAddress("homeAddress", address)}
                onPickOnMap={() => setAddressPickerField("homeAddress")}
                onUseCurrentLocation={() => selectProfileAddress("homeAddress", currentLocation)}
                onClear={() => clearProfileAddress("homeAddress")}
              />
              <ProfileAddressSelector
                label="Serviciu"
                placeholder="Caută adresa de serviciu"
                value={addressSelections.workAddress || stringAddressSuggestion(formValues.workAddress || "", currentLocation)}
                onSelect={(address) => selectProfileAddress("workAddress", address)}
                onPickOnMap={() => setAddressPickerField("workAddress")}
                onUseCurrentLocation={() => selectProfileAddress("workAddress", currentLocation)}
                onClear={() => clearProfileAddress("workAddress")}
              />
            </div>
          </Card>
        )}

        {profile.role === "driver" && (
          <Card className="glass-panel rounded-3xl p-5">
            <SectionHeader title="Detalii șofer" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ProfileField
                id="driver-display-name"
                label="Nume afișat"
                inputProps={{
                  value: roleDetails.driverDisplayName,
                  onChange: (event) => {
                    setRoleDirty(true);
                    setRoleDetails((current) => ({ ...current, driverDisplayName: event.target.value }));
                  }
                }}
              />
              <ProfileField
                id="driver-license"
                label="Număr permis"
                inputProps={{
                  value: roleDetails.licenseNumber,
                  onChange: (event) => {
                    setRoleDirty(true);
                    setRoleDetails((current) => ({ ...current, licenseNumber: event.target.value }));
                  }
                }}
              />
              <ProfileField
                id="driver-region"
                label="Regiune servicii"
                inputProps={{
                  value: roleDetails.serviceRegion,
                  onChange: (event) => {
                    setRoleDirty(true);
                    setRoleDetails((current) => ({ ...current, serviceRegion: event.target.value }));
                  }
                }}
              />
              <ProfileField
                id="driver-availability"
                label="Preferințe disponibilitate"
                inputProps={{
                  value: roleDetails.availabilityPreferences,
                  onChange: (event) => {
                    setRoleDirty(true);
                    setRoleDetails((current) => ({ ...current, availabilityPreferences: event.target.value }));
                  }
                }}
              />
            </div>
          </Card>
        )}

        {profile.role === "roadside_operator" && (
          <Card className="glass-panel rounded-3xl p-5">
            <SectionHeader title="Companie și dispatch" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ProfileField
                id="roadside-company"
                label="Companie"
                inputProps={{
                  value: roleDetails.companyName,
                  onChange: (event) => {
                    setRoleDirty(true);
                    setRoleDetails((current) => ({ ...current, companyName: event.target.value }));
                  }
                }}
              />
              <ProfileField
                id="roadside-dispatch-phone"
                label="Telefon dispecerat"
                inputProps={{
                  value: roleDetails.dispatcherPhone,
                  onChange: (event) => {
                    setRoleDirty(true);
                    setRoleDetails((current) => ({ ...current, dispatcherPhone: event.target.value }));
                  }
                }}
              />
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="roadside-regions">Zone servicii</Label>
                <Textarea
                  id="roadside-regions"
                  value={roleDetails.serviceRegions}
                  onChange={(event) => {
                    setRoleDirty(true);
                    setRoleDetails((current) => ({ ...current, serviceRegions: event.target.value }));
                  }}
                  placeholder="București, Ilfov, DN1"
                  className="rounded-2xl bg-background/70"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="roadside-service-types">Tipuri servicii</Label>
                <Textarea
                  id="roadside-service-types"
                  value={roleDetails.serviceTypes}
                  onChange={(event) => {
                    setRoleDirty(true);
                    setRoleDetails((current) => ({ ...current, serviceTypes: event.target.value }));
                  }}
                  placeholder="tractare, baterie, pană"
                  className="rounded-2xl bg-background/70"
                />
              </div>
            </div>
          </Card>
        )}

        <Card className="glass-panel rounded-3xl p-5">
          <SectionHeader title="Rol și documente" />
          <div className="mt-4">
            <ProfileRoleSection profile={profile} />
          </div>
        </Card>

        <Card className="glass-panel rounded-3xl p-5">
          <SectionHeader title="Securitate" />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-muted text-muted-foreground">
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold">Cont Rider</p>
                <p className="text-sm text-muted-foreground">Logout este disponibil și pe mobil din acest ecran.</p>
              </div>
            </div>
            <Button type="button" variant="destructive" onClick={() => setLogoutDialogOpen(true)}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Ieși din cont
            </Button>
          </div>
        </Card>

        {saveMessage && (
          <p className="rounded-2xl bg-primary/12 px-4 py-3 text-sm font-semibold text-primary" role="status">
            <Save className="mr-2 inline h-4 w-4" aria-hidden="true" />
            {saveMessage}
          </p>
        )}
      </form>

      <ProfileSaveBar dirty={dirty} saving={saving} onCancel={cancelChanges} />

      <LocationPickerSheet
        open={Boolean(addressPickerField)}
        title="Alege adresa"
        initialLocation={
          addressPickerField
            ? addressSelections[addressPickerField] ||
              stringAddressSuggestion(formValues[addressPickerField] || "", currentLocation)
            : undefined
        }
        onClose={() => setAddressPickerField(null)}
        onConfirm={(address) => {
          if (addressPickerField) {
            selectProfileAddress(addressPickerField, address);
          }
        }}
      />

      {logoutDialogOpen && (
        <div className="fixed inset-0 z-[800] grid place-items-center bg-background/45 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm rounded-3xl p-5">
            <h2 className="text-lg font-semibold">Sigur vrei să ieși din cont?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Va trebui să te autentifici din nou pentru a continua.</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" onClick={() => setLogoutDialogOpen(false)}>
                Anulează
              </Button>
              <Button type="button" variant="destructive" onClick={() => void confirmLogout()}>
                Ieși din cont
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold">{title}</h2>
    </div>
  );
}

type ProfileAddressSelectorProps = {
  label: string;
  placeholder: string;
  value?: AddressSuggestion;
  onSelect: (address: AddressSuggestion) => void;
  onPickOnMap: () => void;
  onUseCurrentLocation: () => void;
  onClear: () => void;
};

function ProfileAddressSelector({
  label,
  placeholder,
  value,
  onSelect,
  onPickOnMap,
  onUseCurrentLocation,
  onClear
}: ProfileAddressSelectorProps) {
  return (
    <div className="rounded-3xl bg-muted/40 p-3">
      <AddressSearch
        label={label}
        placeholder={placeholder}
        value={value}
        currentLat={value?.lat}
        currentLng={value?.lng}
        onSelect={onSelect}
        onPickOnMap={onPickOnMap}
      />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Button type="button" variant="outline" onClick={onUseCurrentLocation}>
          Folosește locația curentă
        </Button>
        <Button type="button" variant="outline" onClick={onClear}>
          Șterge adresa
        </Button>
      </div>
      {value && (
        <p className="mt-2 text-xs text-muted-foreground">
          Lat {value.lat.toFixed(5)}, Lng {value.lng.toFixed(5)}
          {value.source === "map_pin" ? " · Pin pe hartă" : ""}
        </p>
      )}
    </div>
  );
}
