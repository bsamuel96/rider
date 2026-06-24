type DriverActivityChartProps = {
  title: string;
  values: { label: string; value: number; helper?: string }[];
  unit?: string;
};

export function DriverActivityChart({ title, values, unit = "h" }: DriverActivityChartProps) {
  const max = Math.max(...values.map((item) => item.value), 1);

  return (
    <section className="rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-5 flex h-44 items-end gap-2">
        {values.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-32 w-full items-end rounded-full bg-muted/70 p-1">
              <span
                className="block w-full rounded-full bg-primary"
                style={{ height: `${Math.max(8, (item.value / max) * 100)}%` }}
                aria-label={`${item.label}: ${item.value}${unit}`}
              />
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground">{item.label}</span>
            <span className="text-[11px] font-semibold">{item.value}{unit}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
