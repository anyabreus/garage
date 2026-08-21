import Link from "next/link";
import { notFound } from "next/navigation";
import { getVehicle } from "@/db/queries/vehicles";
import AddFuelLogForm from "@/components/fuel-logs/AddFuelLogForm";
import AddMaintenanceLogForm from "@/components/maintenance-logs/AddMaintenanceLogForm";
import { getVehicleTimeline } from "@/db/queries/timeline";
import TimelineItem from "@/components/timeline/TimelineItem";

export default async function VehiclePage({
  params,
}: PageProps<"/vehicles/[id]">) {
  const { id } = await params;
  const vehicleData = await getVehicle(Number(id));
  const timeline = await getVehicleTimeline(vehicleData.id);

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
      <Link href={`/vehicles/${vehicleData.id}/stats`}>View Stats</Link>
      <h2>Fuel Logs</h2>
      <AddFuelLogForm />
      <AddMaintenanceLogForm />
      <div>
        <h2>History</h2>
        {timeline.length === 0 && <p>No logs yet.</p>}
        {timeline.map((entry) => (
          <TimelineItem key={`${entry.kind}-${entry.data.id}`} entry={entry} />
        ))}
      </div>
    </div>
  );
}
