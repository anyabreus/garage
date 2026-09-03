import { getVehicles } from "@/db/queries/vehicles";
import VehicleCard from "@/components/vehicles/VehicleCard";
import AddNewVehicleButton from "@/components/vehicles/AddNewVehicleButton";

export default async function VehiclesPage() {
  const vehicles = await getVehicles();

  return (
    <div>
      <h1>Your garage</h1>
      <AddNewVehicleButton />
      {vehicles.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </ul>
      ) : (
        <p>No vehicles available.</p>
      )}
    </div>
  );
}
