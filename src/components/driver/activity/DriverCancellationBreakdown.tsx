const reasons = [
  { label: "Ai anulat", value: 2, className: "bg-destructive" },
  { label: "Nu ai acceptat", value: 5, className: "bg-amber-500" },
  { label: "Clientul a anulat", value: 3, className: "bg-sky-500" },
  { label: "Pasagerul nu a ajuns", value: 1, className: "bg-primary" }
];

export function DriverCancellationBreakdown() {
  const total = reasons.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <h2 className="text-sm font-semibold">Anulări pe motive</h2>
      <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-muted" aria-label={`${total} anulări demo`}>
        {reasons.map((item) => (
          <span
            key={item.label}
            className={item.className}
            style={{ width: `${(item.value / total) * 100}%` }}
            title={`${item.label}: ${item.value}`}
          />
        ))}
      </div>
      <div className="mt-4 grid gap-2">
        {reasons.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className={`h-2.5 w-2.5 rounded-full ${item.className}`} aria-hidden="true" />
              {item.label}
            </span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
