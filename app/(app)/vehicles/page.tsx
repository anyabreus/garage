import { getVehicles } from "@/db/queries/vehicles";
import { getDueReminderCountsByVehicle } from "@/db/queries/reminders";
import VehicleCard from "@/components/vehicles/VehicleCard";
import AddNewVehicleButton from "@/components/vehicles/AddNewVehicleButton";

export default async function VehiclesPage() {
  const [vehicles, dueCounts] = await Promise.all([
    getVehicles(),
    getDueReminderCountsByVehicle(),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1>Your garage</h1>
        <AddNewVehicleButton />
      </div>
      {vehicles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-text-secondary">
          No vehicles yet — add your first one to start tracking it.
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id}>
              <VehicleCard
                vehicle={vehicle}
                dueCount={dueCounts[vehicle.id] ?? 0}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
