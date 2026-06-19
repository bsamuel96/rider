import { SegmentedControl } from "@/components/ui/segmented-control";
import { useTheme } from "@/hooks/useTheme";
import type { ThemePreference as ThemePreferenceValue } from "@/types/domain";

const options: { label: string; value: ThemePreferenceValue }[] = [
  { label: "Auto", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" }
];

export function ThemePreference() {
  const { theme, setTheme } = useTheme();

  return (
    <SegmentedControl
      ariaLabel="Preferință temă"
      value={theme}
      options={options}
      onChange={(value) => {
        void setTheme(value);
      }}
    />
  );
}
