import { Camera } from "lucide-react";
import { uploadAvatar } from "@/services/profile";

type ProfileAvatarEditorProps = {
  fullName: string;
  avatarUrl?: string;
  onAvatarChange: (avatarUrl: string) => void;
};

export function ProfileAvatarEditor({ fullName, avatarUrl, onAvatarChange }: ProfileAvatarEditorProps) {
  const initial = (fullName || "R").slice(0, 1).toUpperCase();

  const handleFileChange = async (file?: File) => {
    if (!file) {
      return;
    }

    const nextAvatarUrl = await uploadAvatar(file);
    onAvatarChange(nextAvatarUrl);
  };

  return (
    <div className="relative h-20 w-20">
      <span className="grid h-20 w-20 overflow-hidden rounded-3xl bg-primary text-2xl font-black text-primary-foreground shadow-map-control">
        {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : <span className="m-auto">{initial}</span>}
      </span>
      <label className="absolute -bottom-2 -right-2 grid h-10 w-10 cursor-pointer place-items-center rounded-2xl bg-background text-primary shadow-map-control ring-1 ring-border focus-within:ring-2 focus-within:ring-ring">
        <Camera className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Schimbă avatarul</span>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            void handleFileChange(event.target.files?.[0]);
          }}
        />
      </label>
    </div>
  );
}
