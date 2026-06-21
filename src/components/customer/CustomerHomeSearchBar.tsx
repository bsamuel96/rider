import { ArrowRight, Search } from "lucide-react";

type CustomerHomeSearchBarProps = {
  onClick: () => void;
};

export function CustomerHomeSearchBar({ onClick }: CustomerHomeSearchBarProps) {
  return (
    <section className="flex min-h-16 items-center">
      <button
        type="button"
        aria-label="Caută destinația"
        onClick={onClick}
        className="glass-panel flex min-h-14 w-full items-center justify-between gap-3 rounded-full px-4 text-left transition-colors hover:bg-muted/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex min-w-0 items-center gap-3">
          <Search className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <span>
            <span className="block text-sm font-semibold">Unde mergi?</span>
            <span className="block text-xs text-muted-foreground">Caută destinația</span>
          </span>
        </span>
        <ArrowRight className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      </button>
    </section>
  );
}
