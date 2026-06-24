import { DriverGuideCard } from "@/components/driver/support/DriverGuideCard";
import { driverGuides } from "@/components/driver/support/driverGuides";

export function DriverGuideGrid() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {driverGuides.map((guide) => (
        <DriverGuideCard
          key={guide.slug}
          title={guide.title}
          description={guide.description}
          to={`/driver/support/guides/${guide.slug}`}
          icon={guide.icon}
        />
      ))}
    </section>
  );
}
