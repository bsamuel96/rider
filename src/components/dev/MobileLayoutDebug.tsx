export function MobileLayoutDebug() {
  const enabled = import.meta.env.DEV && import.meta.env.VITE_ENABLE_LAYOUT_DEBUG === "true";

  if (!enabled) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] text-[10px] font-semibold uppercase tracking-wide text-foreground/70">
      <div className="absolute inset-x-0 top-0 border-b border-sky-500/70 bg-sky-500/10" style={{ height: "var(--safe-top)" }}>
        safe top
      </div>
      <div
        className="absolute inset-x-0 bottom-0 border-t border-rose-500/70 bg-rose-500/10"
        style={{ height: "calc(var(--bottom-nav-height) + var(--safe-bottom))" }}
      >
        bottom nav
      </div>
      <div
        className="absolute inset-x-3 rounded-3xl border border-emerald-500/70 bg-emerald-500/10"
        style={{
          bottom: "var(--floating-bottom-offset)",
          height: "38svh"
        }}
      >
        sheet zone
      </div>
      <div className="absolute right-3 top-[calc(var(--safe-top)+0.75rem)] h-24 w-12 rounded-2xl border border-amber-500/70 bg-amber-500/10">
        controls
      </div>
    </div>
  );
}
