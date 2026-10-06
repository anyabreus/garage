import Link from "next/link";
import type { vehiclesTable } from "@/db/schema";
import { cn } from "@/lib/utils";

export default function VehicleCard({
  vehicle,
  dueCount,
}: {
  vehicle: typeof vehiclesTable.$inferSelect;
  dueCount: number;
}) {
  const isDue = dueCount > 0;

  return (
    <Link
      href={`/vehicles/${vehicle.id}`}
      className="flex flex-col gap-2.5 rounded-xl border border-border bg-surface p-4 hover:border-signal"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            {vehicle.nickname || `${vehicle.make} ${vehicle.model}`}
          </h3>
          <p className="mt-0.5 text-xs text-text-secondary">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </p>
        </div>
        <span
          className={cn(
            "rounded px-2 py-0.5 text-[10px]",
            isDue ? "bg-signal/12 text-signal" : "bg-coolant/12 text-coolant",
          )}
        >
          {isDue ? `${dueCount} due` : "on track"}
        </span>
      </div>

      <div className="h-px bg-border" />

      <div className="flex justify-between text-xs">
        <span className="text-text-secondary">Odometer</span>
        <span className="font-mono text-foreground">
          {vehicle.currentOdometer.toLocaleString()} km
        </span>
      </div>
    </Link>
  );
}
