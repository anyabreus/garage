import Link from "next/link";
import { notFound } from "next/navigation";
import { getVehicle } from "@/db/queries/vehicles";
import { getFuelLogs } from "@/db/queries/fuel-logs";
import AddFuelLogForm from "@/components/fuel-logs/AddFuelLogForm";
import FuelLogRow from "@/components/fuel-logs/FuelLogRow";

export default async function VehiclePage({
  params,
}: PageProps<"/vehicles/[id]">) {
  const { id } = await params;
  const vehicleData = await getVehicle(Number(id));
  const fuelLogs = await getFuelLogs(Number(id));

  if (!vehicleData) return notFound();

  return (
    <div>
      <h1>
        {vehicleData.nickname && <span>{vehicleData.nickname} </span>}Vehicle
        Details
      </h1>

      <p>Make: {vehicleData.make}</p>
      <p>Model: {vehicleData.model}</p>
      <p>Year: {vehicleData.year}</p>
      <p>Current Odometer: {vehicleData.currentOdometer}</p>
      {vehicleData.vin && <p>VIN: {vehicleData.vin}</p>}
      <Link href={`/vehicles/${vehicleData.id}/settings`}>Settings</Link>
      <h2>Fuel Logs</h2>
      <AddFuelLogForm />
      {fuelLogs.length > 0 ? (
        <ul>
          {fuelLogs.map((log) => (
            <FuelLogRow key={log.id} log={log} />
          ))}
        </ul>
      ) : (
        <p>No fuel logs available.</p>
      )}
    </div>
  );
}
