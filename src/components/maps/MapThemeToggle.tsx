import { CarHeadlightThemeToggle } from "@/components/theme/CarHeadlightThemeToggle";

type MapThemeToggleProps = {
  onToggle?: () => void;
};

export function MapThemeToggle({ onToggle }: MapThemeToggleProps) {
  return <CarHeadlightThemeToggle floating onToggle={onToggle} />;
}
